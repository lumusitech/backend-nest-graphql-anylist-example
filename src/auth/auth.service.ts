import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignupInput } from './dto/inputs/signup.input';
import { AuthResponse } from './types/auth-response.type';

@Injectable()
export class AuthService {
  constructor(private readonly UsersService: UsersService) {}

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    const user = await this.UsersService.create(signupInput);

    const token = 'mocked-jwt-token';

    return {
      token,
      user,
    };
  }
}
