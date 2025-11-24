import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateListInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;
}
