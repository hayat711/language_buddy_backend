import { AbstractEntity } from "src/common/entities/abstract.entitiy";
import { UserLanguage } from "src/modules/userlanguage/entities/userlanguage.entity";
import {Column, Entity, OneToMany} from "typeorm";


@Entity()
export class Language extends AbstractEntity<Language>{
    @Column()
    name: string

    @Column()
    alias:string;

    @OneToMany(() => UserLanguage,userLanguage => userLanguage.language, {

    })
    userLanguages: UserLanguage[]

}
