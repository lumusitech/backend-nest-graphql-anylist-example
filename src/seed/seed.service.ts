import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { ItemsService } from 'src/items/items.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';
import { List } from 'src/lists/entities/list.entity';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { ListsService } from 'src/lists/lists.service';
import { ListItemService } from 'src/list-item/list-item.service';

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService,
    private readonly listItemsService: ListItemService,
  ) {
    this.isProd = this.configService.get('STATE') === 'prod';
  }

  async executeSeed(): Promise<boolean> {
    if (this.isProd) {
      throw new BadRequestException(
        'You can only run the seed in development mode',
      );
    }

    await this.deleteDatabase();
    const user = await this.loadUsers();
    await this.loadItems(user);
    const list = await this.loadLists(user);
    const items = await this.itemsService.findAll(
      user,
      { limit: 5, offset: 0 },
      { search: '' },
    );
    await this.loadListItems(list, items);
    return true;
  }

  async deleteDatabase(): Promise<boolean> {
    // await this.itemsRepository.delete({});
    // await this.usersRepository.delete({});
    // or
    // await this.itemsRepository.query('DELETE FROM items');
    // await this.usersRepository.query('DELETE FROM users');
    // or
    await this.listItemRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    await this.listRepository.createQueryBuilder().delete().where({}).execute();

    await this.itemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    return true;
  }

  async loadUsers(): Promise<User> {
    const usersPromises: Promise<User>[] = [];
    for (const user of SEED_USERS) {
      usersPromises.push(this.usersService.create(user));
    }
    const usersResolved = await Promise.all(usersPromises);

    return usersResolved[0];
  }

  async loadItems(user: User): Promise<boolean> {
    const itemsPromises: Promise<Item>[] = [];
    for (const item of SEED_ITEMS) {
      itemsPromises.push(this.itemsService.create(item, user));
    }
    await Promise.all(itemsPromises);
    return true;
  }

  async loadLists(user: User): Promise<List> {
    const listsPromises: Promise<List>[] = [];
    for (const list of SEED_LISTS) {
      listsPromises.push(this.listsService.create(list, user));
    }
    const listsResolved = await Promise.all(listsPromises);

    return listsResolved[0];
  }

  async loadListItems(list: List, items: Item[]): Promise<boolean> {
    const listItemsPromises: Promise<ListItem>[] = [];
    for (const item of items) {
      listItemsPromises.push(
        this.listItemsService.create({
          listId: list.id,
          itemId: item.id,
          quantity: Math.floor(Math.random() * 10),
          completed: Math.random() > 0.5,
        }),
      );
    }
    await Promise.all(listItemsPromises);
    return true;
  }
}
