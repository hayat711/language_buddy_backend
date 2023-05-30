import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserLanguageService } from './userlanguage.service';
import { CreateUserlanguageDto } from './dto/create-userlanguage.dto';
import { UpdateUserlanguageDto } from './dto/update-userlanguage.dto';

@Controller('user_language')
export class UserLanguageController {
  constructor(private readonly userLanguageService: UserLanguageService) {}

  // @Post()
  // create(@Body() createUserLanguageDto: CreateUserlanguageDto) {
  //   return this.userlanguageService.create(createUserlanguageDto);
  // }
  //
  // @Get()
  // findAll() {
  //   return this.userlanguageService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userlanguageService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserlanguageDto: UpdateUserlanguageDto) {
  //   return this.userlanguageService.update(+id, updateUserlanguageDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userlanguageService.remove(+id);
  // }
}
