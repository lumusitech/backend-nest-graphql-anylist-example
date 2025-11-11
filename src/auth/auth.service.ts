import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginInput } from './dto/inputs/login.input';
import { SignupInput } from './dto/inputs/signup.input';
import { AuthResponse } from './types/auth-response.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(userId: string) {
    return this.jwtService.sign({ id: userId });
  }

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    const user = await this.usersService.create(signupInput);

    return {
      token: this.getJwtToken(user.id),
      user,
    };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;

    const user = await this.usersService.findOneByEmail(email);

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword)
      throw new UnauthorizedException(`email/password do not match`); //! Remove details for security

    return {
      token: this.getJwtToken(user.id),
      user,
    };
  }

  async validateUser(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findOneById(id);
    if (!user?.isActive)
      throw new UnauthorizedException(
        `user with id ${id} is inactive, contact with an admin`,
      );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPass } = user;

    return userWithoutPass;
  }

  revalidateUser(user: User): AuthResponse {
    const token = this.getJwtToken(user.id);

    return {
      token,
      user,
    };
  }
}
