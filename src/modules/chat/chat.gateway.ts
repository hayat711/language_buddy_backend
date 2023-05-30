import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect, OnGatewayInit, WebSocketServer, WsException, ConnectedSocket
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import {Logger, OnModuleInit} from "@nestjs/common";
import {RoomService} from "../room/room.service";
import {User} from "../user/entities/user.entity";
import { Socket, Server } from 'socket.io'
import {ConversationService} from "../conversation/conversation.service";
import {Conversation} from "../conversation/entities/conversation.entity";
import {Room} from "../room/entities/room.entity";
import {MessageService} from "../message/message.service";
import {UserService} from "../user/user.service";

interface UserSocket extends Socket {
  user: User
}

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  },
  namespace: 'chat'
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, OnModuleInit{

  @WebSocketServer()
  public server: Server;

  private readonly logger: Logger = new Logger('ChatGateway');


  constructor(private readonly chatService: ChatService,
              private readonly roomService: RoomService,
              private readonly conversationService: ConversationService,
              private readonly messageService: MessageService,
              private readonly userService: UserService
  ) {}

  public async onModuleInit() {
    this.logger.log('Module has been initialized (chat)!');
  }

  public async handleConnection(socket: UserSocket) : Promise<void> {
    try {
      const user = await this.chatService.getUserFromSocket(socket);
      if (!user) {
        socket.disconnect(true);
        return;
      }
      socket.user = user;
      const rooms = await this.roomService.getUserRooms(user.id);
      const conversations = await this.conversationService.getUserConversations(user.id);
      socket.join(this.getChatIds(rooms));
      socket.join(this.getChatIds(conversations));
      this.logger.log(`Connection established: ${user.id}`);
      this.server.to(socket.id).emit('room:all', rooms);
      this.server.to(socket.id).emit('conversation:all', conversations);
      return;

    } catch (e) {
      this.logger.log(e);
      throw new WsException(e);
    }
  }

  public async handleDisconnect(socket: UserSocket) : Promise<void> {
      try {
        socket.disconnect()
        this.logger.log(`Connection Ended`);
        return;
      } catch (err) {
        this.logger.error(err);
        throw new WsException(err);
      }
  }

  public async afterInit() {
    this.logger.log('Gateway has been initialized!!');
  }

  @SubscribeMessage('message:create')
  public async onMessageAdd(
      @ConnectedSocket() socket: UserSocket,
      @MessageBody() data: { message: string, chatId: string, type: 'room' | 'conversation'}
  ){
    try {
      const { message, chatId, type} = data;
      const createdMessage = await this.messageService.create(socket.user, type, chatId, message);
      for (const room of socket.rooms) {
        if (createdMessage.room && createdMessage.room.id === room) {
          this.server.to(room).emit('message:created', createdMessage);
        }
        if (createdMessage.conversation && createdMessage.conversation.id === room) {
          this.server.to(room).emit('message:created', createdMessage);
        }
      }
      } catch(e) {
        this.logger.error(e);
        throw new WsException(e);
    }
  }

  @SubscribeMessage('room:create')
  public async onRoomCreate(
      @ConnectedSocket() socket : UserSocket,
      @MessageBody() data: { name: string, description?: string, isPublic? : boolean}
  ) {
    console.log('data for creating room => ', data);
    try {
      const createdRoom = await this.roomService.createRoom(data, socket.user);
      socket.join(createdRoom.id);
      for (const user of createdRoom.users) {
        const rooms = await this.roomService.getUserRooms(user.id);
        this.server.to(socket.id).emit('room:all', rooms);
      }
    } catch (err) {
      this.server.to(socket.id).emit('error:room-create', err);
      this.logger.error(err);
      throw new WsException(err);
    }
  }

  // @SubscribeMessage('createChat')
  // create(@MessageBody() createChatDto: CreateChatDto) {
  //   return this.chatService.create(createChatDto);
  // }

  // @SubscribeMessage('findAllChat')
  // findAll() {
  //   return this.chatService.findAll();
  // }
  //
  // @SubscribeMessage('findOneChat')
  // findOne(@MessageBody() id: number) {
  //   return this.chatService.findOne(id);
  // }
  //
  // @SubscribeMessage('updateChat')
  // update(@MessageBody() updateChatDto: UpdateChatDto) {
  //   return this.chatService.update(updateChatDto.id, updateChatDto);
  // }
  //
  // @SubscribeMessage('removeChat')
  // remove(@MessageBody() id: number) {
  //   return this.chatService.remove(id);

  private getChatIds(chats: Room[] | Conversation[]) {
    let chatIds: string[] = [];
    for (const chat of chats) {
      chatIds.push(chat.id);
    }
    return chatIds;
  }
}

