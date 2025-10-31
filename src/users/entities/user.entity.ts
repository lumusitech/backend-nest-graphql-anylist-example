import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  fullName: string;

  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column()
  // @Field(() => String) -- IGNORE --
  password: string;

  @Column({
    type: 'text',
    array: true,
    default: ['user'],
  })
  @Field(() => [String])
  roles: string[];

  @Column({ type: 'boolean', default: true })
  @Field(() => Boolean)
  active: boolean;

  //TODO: Add relations with other entities
}
