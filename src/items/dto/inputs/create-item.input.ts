import { Field, Float, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field(() => String, { description: 'Name of the item' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => Float, { description: 'Quantity of the item' })
  @IsNotEmpty()
  @IsPositive()
  quantity: number;

  @Field(() => String, { description: 'Unit of measurement', nullable: true })
  @IsString()
  @IsOptional()
  quantityUnit?: string;
}
