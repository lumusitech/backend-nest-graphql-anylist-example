import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ListItem } from './entities/list-item.entity';
import { Repository } from 'typeorm';
import { List } from 'src/lists/entities/list.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';

@Injectable()
export class ListItemService {
  constructor(
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
  ) { }
  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { listId, itemId, ...rest } = createListItemInput;

    const listItem = this.listItemRepository.create({
      ...rest,
      list: { id: listId },
      item: { id: itemId }
    });

    return await this.listItemRepository.save(listItem);
  }

  async findAll(list: List, paginationArgs: PaginationArgs, searchArgs: SearchArgs):
    Promise<ListItem[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listItemRepository.createQueryBuilder('listItem')
      // .innerJoin('listItem.item', 'item')
      .take(limit)
      .skip(offset)
      .where('"listId"=:listId', { listId: list.id });

    if (search) {
      queryBuilder.andWhere('LOWER(item.name) like :name', { name: `%${search.toLowerCase()}%` });
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<ListItem> {
    try {
      return await this.listItemRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(`List item with id ${id} not found`);
    }
  }

  // async update(id: string, updateListItemInput: UpdateListItemInput): Promise<ListItem> {
  //   const listItem = await this.findOne(id);
  //   return await this.listItemRepository.save({ ...listItem, ...updateListItemInput });
  // }

  async update(id: string, updateListItemInput: UpdateListItemInput): Promise<ListItem> {
    const listItem = await this.findOne(id);

    const { listId, itemId, ...rest } = updateListItemInput;

    const queryBuilder = this.listItemRepository.createQueryBuilder('listItem')
      .where('id = :id', { id })
      .update({ ...rest });

    //? Using for referecial integrity of relations
    if (listId) {
      queryBuilder.set({ list: { id: listId } });
    }

    if (itemId) {
      queryBuilder.set({ item: { id: itemId } });
    }

    await queryBuilder.execute()

    return await this.findOne(id);
  }

  async remove(id: string): Promise<ListItem> {
    const listItem = await this.findOne(id);
    return await this.listItemRepository.remove(listItem);
  }

  async getListItemCountByList(args: { where: { list: { id: string } } }): Promise<number> {
    return await this.listItemRepository.count(args);
  }
}
