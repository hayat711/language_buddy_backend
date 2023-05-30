import {AbstractEntity} from "../../../common/entities/abstract.entitiy";
import {BeforeInsert, Column, Entity, Index, JoinTable, OneToMany} from "typeorm";
import {Providers} from "../../../common/enums";
import {Exclude} from "class-transformer";
import {Role} from "../../../common/enums/roles.enum";
import {AccountStatus} from "../../../common/enums/status.enum";
import {Invitation} from "../../room/entities/invitation.entity";
import {Message} from "../../message/entities/message.entity";
import * as argon from 'argon2';
import {UserLanguage} from "../../userlanguage/userlanguage/entities/userlanguage.entity";

@Entity()
export class User extends AbstractEntity<User>{
    @Column({
        name: 'provider',
        nullable: true,
        type: 'enum',
        enum: Providers
    })
    public provider: Providers

    @Index()
    @Column({
        length: 200,
        name: 'provider_id',
        nullable: true
    })
    public providerId : string

    @Index()
    @Column({
        unique: true,
        length: 200,
        name: 'email',
        nullable: false
    })
    public email: string

    @Exclude()
    @Column({
        length: 200,
        name: 'password',
        nullable: false
    })
    password: string;

    @Column({
        name: 'first_name',
        length: 200,
        nullable: false
    })
    public firstName: string

    @Column({
        length: 200,
        name: 'last_name',
        nullable: false
    })
    public lastName: string


    @Column({
        unique: true,
        length: 200,
        name: 'nick_name',
        nullable: false
    })
    public displayName: string

    @Column({
        length: 200,
        name: 'image',
        nullable: true,
        default: null
    })
    public image: string

    @Column({
        nullable: true}
    )
    age: number;

    @Column()
    birthdate: Date;

    @Column({
        nullable: true
    })
    nationality: String;

    @Column({ nullable: true})
    location: String;

    @Column('simple-array')
    public interests: string[];

    @Column({
        type: "enum",
        name: 'role',
        nullable: false,
        default: Role.USER,
        enum: Role
    })
    public role: Role;

    @Column({
        type: 'enum',
        name: 'account_status',
        nullable: false,
        default: AccountStatus.PENDING,
        enum: AccountStatus
    })
    public accountStatus: AccountStatus;

    @OneToMany(() => Invitation,
        invitation => invitation.user)
    public invitations: Invitation[]

    @OneToMany(() => Message,
        message => message.author)
    public messages: Message[];

    @OneToMany(() => UserLanguage,  userLanguage => userLanguage.user, {
        eager: true,
    })
    public languages: UserLanguage[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await argon.hash(this.password)
    }

}
