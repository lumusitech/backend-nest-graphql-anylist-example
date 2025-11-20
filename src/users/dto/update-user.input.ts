import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { CreateUserInput } from './create-user.input';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => [ValidRoles], { nullable: true })
  @IsOptional()
  @IsEnum(ValidRoles, { each: true })
  roles?: ValidRoles[]

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean
}
