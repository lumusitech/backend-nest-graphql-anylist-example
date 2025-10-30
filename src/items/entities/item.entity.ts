import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => Float)
  @Column({ type: 'float' })
  quantity: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  quantityUnit?: string; // e.g., kg, ml,liters, pieces

  // stores
  // user
}
