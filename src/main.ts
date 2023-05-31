import {NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import {ClassSerializerInterceptor, ValidationPipe} from "@nestjs/common";
import cookieParser from 'cookie-parser';
import * as express from 'express';
import {ConfigService} from "@nestjs/config";
import {RedisIoAdapter} from "./modules/chat/chat.adapter";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  const reflector = app.get(Reflector)

  app.enableCors({
    credentials: true,
    origin: ['http://localhost:8080'],
    optionsSuccessStatus: 200,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
  });
  app.use(express.json());
  app.use(express.urlencoded({ extended: true}))
  app.use(cookieParser());


  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);

  app.setGlobalPrefix('/api');
  app.useGlobalPipes( new ValidationPipe());
  await app.listen(8001);
}
bootstrap();
