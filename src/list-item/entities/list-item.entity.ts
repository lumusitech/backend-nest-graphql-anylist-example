import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import { List } from 'src/lists/entities/list.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity("ListItems")
@ObjectType()
@Unique('listItem-item', ['list', 'item'])
export class ListItem {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id: string;

  @Column({ type: "numeric" })
  @Field(() => Int)
  quantity: number;

  @Column()
  @Field(() => Boolean)
  completed: boolean;

  //? Relations
  @ManyToOne(() => List, (list) => list.listItem, { lazy: true })
  // @Field(() => List) // we do not need to get the list from the list item
  list: List

  @ManyToOne(() => Item, (item) => item.listItem, { lazy: true })
  @Field(() => Item)
  item: Item
}
