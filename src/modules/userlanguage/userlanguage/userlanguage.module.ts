import { Module } from '@nestjs/common';
import { UserLanguageService } from './userlanguage.service';
import { UserLanguageController } from './userlanguage.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserLanguage} from "./entities/userlanguage.entity";

@Module({
  controllers: [UserLanguageController],
  providers: [UserLanguageService],
  imports: [TypeOrmModule.forFeature([UserLanguage])],
})
export class UserLanguageModule {}
