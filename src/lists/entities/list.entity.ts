import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'lists' })
@ObjectType()
export class List {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  @IsString()
  @MinLength(3)
  name: string;

  @ManyToOne(() => User, (user) => user.list, { nullable: false, lazy: true })
  @Index('userId-list-index')
  @Field(() => User, { nullable: false })
  user: User;
}
