import { Module } from '@nestjs/common';
import { UserLanguageService } from './userlanguage.service';
import { UserLanguageController } from './userlanguage.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserLanguage} from "./entities/userlanguage.entity";
import {AuthModule} from "../../auth/auth.module";

@Module({
  controllers: [UserLanguageController],
  providers: [UserLanguageService],
  imports: [TypeOrmModule.forFeature([UserLanguage]), AuthModule],
})
export class UserLanguageModule {}
