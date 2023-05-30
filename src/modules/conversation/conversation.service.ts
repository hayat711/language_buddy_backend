import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Conversation} from "./entities/conversation.entity";
import {Repository} from "typeorm";
import {User} from "../user/entities/user.entity";
import {PostgresErrorCode} from "../../common/enums/postgres-error.enum";
import {UniqueViolation} from "../../common/exceptions";

@Injectable()
export class ConversationService {
  constructor(@InjectRepository(Conversation) private readonly conversationRepository: Repository<Conversation>) {
  }
  public async createConversation(creator: User, recipient: User) {
    try {
        const conversation = new Conversation({
            creator,
            recipient
        });

        await this.conversationRepository.save(conversation);
        return conversation;
    }catch (err) {
        if (err.code == PostgresErrorCode.UniqueViolation) {
            if (err.default.includes('name')) {
                throw new UniqueViolation('name')
            }
        }
    }
  }

  public async findAll() {
    return await this.conversationRepository.find({
      loadRelationIds: true,
    });
  }

  public async findOne(id: string) {
    return await this.conversationRepository.findOne({
      where: { id }
    });
  }

  public async getUserConversations(userId: string) {
    const query = await this.conversationRepository
        .createQueryBuilder('conversation')
        .where('creator.id = :userId', { userId })
        .orWhere('recipient.id = :userId', { userId})
        .leftJoinAndSelect('conversation.creator', 'creator')
        .leftJoinAndSelect('conversation.recipient', 'recipient')
        .select([
            'conversation',
            'creator.id',
            'creator.displayName',
            'creator.image',
            'recipient.id',
            'recipient.displayName',
            'recipient.image'
        ])
        .orderBy('conversation.updated_at', 'DESC')
        .getMany();
      return query;
  }



  update(id: number, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}
