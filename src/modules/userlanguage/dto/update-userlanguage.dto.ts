import { PartialType } from '@nestjs/swagger';
import { CreateUserlanguageDto } from './create-userlanguage.dto';

export class UpdateUserlanguageDto extends PartialType(CreateUserlanguageDto) {}
