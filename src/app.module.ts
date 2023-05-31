import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import {DatabaseModule} from "./db/db.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import { ChatModule } from './modules/chat/chat.module';
import { MessageModule } from './modules/message/message.module';
import { RoomModule } from './modules/room/room.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import {RedisModule, RedisModuleOptions} from "@liaoliaots/nestjs-redis";
import {WsEmitterClientOptions, WsEmitterModule} from "./modules/chat/ws-emitter.module";
import { LanguageModule } from './modules/language/language.module';
import { UserLanguageModule } from './modules/userlanguage/userlanguage.module';


@Module({
  imports: [UserModule, AuthModule, DatabaseModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true}),
    ChatModule,
    MessageModule,
    RoomModule,
    ConversationModule,
    LanguageModule,
    UserLanguageModule,
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<RedisModuleOptions> => {
        return {
          config: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT') ,
            password: configService.get('REDIS_PASSWORD'),
          }
        }
      }
    }),
    WsEmitterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) : Promise<WsEmitterClientOptions> => {
        return {
          config: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
            password: configService.get('REDIS_PASSWORD'),
          }
        }
      }
    }),

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
