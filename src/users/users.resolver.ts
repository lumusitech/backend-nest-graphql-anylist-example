import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { UpdateItemInput } from 'src/items/dto/inputs';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ValidRoles.admin]) adminUser: User,
  ): Promise<User[]> {
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.superUser, ValidRoles.admin]) adminUser: User,
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.admin]) adminUser: User,
  ): Promise<User> {
    return await this.usersService.update(updateUserInput.id, updateUserInput, adminUser);
  }

  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) adminUser: User,
  ): Promise<User> {
    return this.usersService.block(id, adminUser);
  }
}
