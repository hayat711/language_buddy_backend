import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { UserLanguageService } from './userlanguage.service';
import { CreateUserlanguageDto } from './dto/create-userlanguage.dto';
import { UpdateUserlanguageDto } from './dto/update-userlanguage.dto';
import {CurrentUser} from "../../common/decorators";
import {JwtAuthGuard} from "../../common/guards/jwt.auth.guard";

@Controller('user_language')
export class UserLanguageController {
  constructor(private readonly userLanguageService: UserLanguageService) {}


  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createUserLanguageDto: CreateUserlanguageDto,
         @CurrentUser('id') userId: string,
         ) {
    return this.userLanguageService.create(createUserLanguageDto, userId);
  }

  @Get()
  findAll() {
    return this.userLanguageService.getUserLanguages();
  }
}
