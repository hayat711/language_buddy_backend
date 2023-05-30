import {Column, Entity, OneToMany} from "typeorm";
import {AbstractEntity} from "../../../../common/entities/abstract.entitiy";
import {UserLanguage} from "../../../userlanguage/userlanguage/entities/userlanguage.entity";


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
