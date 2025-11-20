import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import { ArrayOverlap, In, Repository } from 'typeorm';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { ValidRoles } from '../auth/enums/valid-roles.enum';

interface CustomErrorDB {
  code: string;
  detail: string;
}

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  async create(signupInput: SignupInput) {
    try {
      const user = this.usersRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });

      return await this.usersRepository.save(user);
    } catch (error) {
      this.handleDbErrors(error as unknown as CustomErrorDB);
    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    if (roles.length === 0) return this.usersRepository.find(
      //? Not necessary because we have lazy: true within this property
      // {
      //   relations: {
      //     lastUpdateBy: true,
      //   }
      // }
    );

    return this.usersRepository.createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)
      .getMany();
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ email });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      //? Option 1:
      //?  throw new NotFoundException(`User with email ${email} not found`);

      //? Option 2:
      this.handleDbErrors({
        code: 'custom-error-001',
        detail: `User with email ${email} not found`,
      });
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ id });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      this.handleDbErrors({
        code: 'custom-error-002',
        detail: `User with id ${id} not found`,
      });
    }
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  async block(id: string, adminUser: User): Promise<User> {
    const userToBlock = await this.findOneById(id);

    userToBlock.isActive = false;
    userToBlock.lastUpdateBy = adminUser;

    return await this.usersRepository.save(userToBlock);
  }

  private handleDbErrors(error: CustomErrorDB): never {
    if (error.code === '23505') {
      throw new BadRequestException(
        error.detail
          //? For a better message you can use:
          .replace('Key ', '')
          .replaceAll('(', '')
          .replaceAll(')', ''),
      );
    }

    if (error.code === 'custom-error-001') {
      throw new NotFoundException(
        error.detail
          //? For a better message you can use:
          .replace('Key ', '')
          .replaceAll('(', '')
          .replaceAll(')', ''),
      );
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
