import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/inputs/signup.input';
import { AuthResponse } from './types/auth-response.type';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'signup' })
  async signup(
    @Args('signupInput') signupInput: SignupInput,
  ): Promise<AuthResponse> {
    return this.authService.signup(signupInput);
  }

  // @Mutation(() => Boolean, { name: 'login' })
  // async login(): Promise<boolean> {
  //   // Implement login logic here
  //   return await this.authService.login();
  // }

  // @Query(() => Boolean, { name: 'revalidateToken' })
  // async revalidateToken(): Promise<boolean> {
  //   // Implement token revalidation logic here
  //   return await this.authService.revalidateToken();
  // }
}
