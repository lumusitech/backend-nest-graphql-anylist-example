import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Column, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.lists)
  @Index('userId-list-index', ['user', 'id', 'list'])
  user: User;
}
