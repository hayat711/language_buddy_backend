import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";
import {PostgresErrorCode} from "../../common/enums/postgres-error.enum";
import {UniqueViolation} from "../../common/exceptions";
import {AuthRequest} from "../auth/dto/req-with-user.dto";
import {AccountStatus} from "../../common/enums/status.enum";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
  }

  public async create(data: Partial<User>) {
    const user = this.userRepository.create(data)

    await this.userRepository.save(user);

    return user;
  }

  public async update(usrId: string, values: QueryDeepPartialEntity<User>) {
    await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set(values)
        .where("id = :id", {id: usrId})
        .execute()
  }

  public async getUserByField(field:string, value: string |number) : Promise<User>{
    const user = await this.userRepository.findOne({
      where: {
        [field] : value
      }
    })
    return user;
  }

  public async updateProfile(userId: string, values: QueryDeepPartialEntity<User>) {
    try {
      await  this.userRepository.createQueryBuilder()
          .update(User)
          .set(values)
          .where("id = :id", { id: userId})
          .execute()
        return {
          success: true,
          message: 'Profile updated'
        }
    } catch (err) {
      if (err.code == PostgresErrorCode.UniqueViolation) {
        if (err.detail.includes('email')) {
          throw new UniqueViolation('email');
        }

        if (err.detail.includes('nick_name' || 'nick' || 'nickName')) {
          throw new UniqueViolation('displayName');
        }
      }
      throw new InternalServerErrorException();
    }
  }


  public async continueWithProvider(request: AuthRequest) {
    let user : User;

    const { providerId, email } = request.user;
    user = await this.userRepository
        .createQueryBuilder()
        .where('provider.id = :providerId', {providerId})
        .orWhere('email = :email', {email})
        .getOne();

    if (user) {
      if (request.user.email === user.email && user.provider == 'local') {
        throw new BadRequestException('User with email same as social provider already exists');
      }
    }

    if (!user) {
      user = this.userRepository.create({
        provider: request.user.provider,
        providerId: request.user.providerId,
        email: request.user.email,
        password: request.user.password,
        firstName: request.user.firstName,
        lastName : request.user.lastName,
        displayName: request.user.displayName,
        image: request.user.image,
        accountStatus: AccountStatus.VERIFIED,
      });

      await this.userRepository.save(user);
    }
    return user;
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }



  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
