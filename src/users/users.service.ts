import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import { Repository } from 'typeorm';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

interface ErrorDB {
  code: string;
  detail: string;
}

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput) {
    try {
      const user = this.usersRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });

      return await this.usersRepository.save(user);
    } catch (error) {
      this.handleDbErrors(error as unknown as ErrorDB);
    }
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  findOne(id: string): Promise<User> {
    throw new Error('findOne method not implemented.');
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  block(id: string): Promise<User> {
    throw new Error('blockUser method not implemented.');
  }

  private handleDbErrors(error: ErrorDB): never {
    this.logger.error(error.detail);

    if (error.code === '23505') {
      throw new BadRequestException(
        error.detail
          //? For a better message you can use:
          .replace('Key ', '')
          .replaceAll('(', '')
          .replaceAll(')', ''),
      );
    }
    throw new InternalServerErrorException('Please check server logs');
  }
}
