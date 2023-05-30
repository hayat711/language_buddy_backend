import {Column, Entity, ManyToOne} from "typeorm";
import {AbstractEntity} from "../../../../common/entities/abstract.entitiy";
import {User} from "../../../user/entities/user.entity";
import {Language} from "../../../language/language/entities/language.entity";
import {ProficiencyEnum} from "../../../../common/enums/profeciency.enum";


@Entity()
export class UserLanguage extends AbstractEntity<UserLanguage>{

    @Column({
        nullable: false,
        type: 'enum',
        enum: ProficiencyEnum,
        default: ProficiencyEnum.BEGINNER,
    })
    proficiency: ProficiencyEnum;

    @Column()
    isNative: boolean;

    @ManyToOne(() => User, user => user.languages, {
        onDelete: 'CASCADE', cascade: true,
    })
    user: User;

    @ManyToOne(() => Language, language => language.userLanguages, {
        onDelete: 'CASCADE', cascade: true,
    })
    language: Language;

}
