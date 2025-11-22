import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  // @Field(() => Float)
  // @Column({ type: 'float' })
  // quantity: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  quantityUnit?: string; // e.g., kg, ml,liters, pieces

  // stores
  // user
  @ManyToOne(() => User, (user) => user.items, { nullable: false, lazy: true })
  @Index('userId-index')
  @Field(() => User, { nullable: false })
  user: User;
}
