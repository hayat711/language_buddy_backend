import { Injectable } from '@nestjs/common';
import { CreateUserlanguageDto } from './dto/create-userlanguage.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {UserLanguage} from "./entities/userlanguage.entity";
import {Repository} from "typeorm";

@Injectable()
export class UserLanguageService {
    constructor(
        @InjectRepository(UserLanguage) private readonly userLanguageRepository: Repository<UserLanguage>,
    ) {}

    public async create(languageDto: CreateUserlanguageDto, userId: string) {
        const { name, level, isNative} = languageDto;
        const newUserLanguage = await this.userLanguageRepository.create({
             user: {id: userId},
             isNative,
            language: { name: name},
            proficiency:level
        });

        console.log('the created user language', newUserLanguage);
        return await this.userLanguageRepository.save(newUserLanguage);
    }

    public async getUserLanguages() {
        return await this.userLanguageRepository.find();
    }

    public async getUserLanguage(userId: string) {
        const languageInfo = await this.userLanguageRepository.findOne({
            where: { user :{ id: userId} },
            relations: ['language'],
        });
        return languageInfo;
    }

}
