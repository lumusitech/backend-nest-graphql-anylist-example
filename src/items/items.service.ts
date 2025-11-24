import { Injectable, NotFoundException } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';

import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { User } from '../users/entities/user.entity';
import { PaginationArgs, SearchArgs } from '../common/dto/args';


@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) { }

  async create(createItemInput: CreateItemInput, owner: User): Promise<Item> {
    const newItem = this.itemsRepository.create({ ...createItemInput, user: owner });

    //? Here you can add additional logic before saving the item, if needed

    return await this.itemsRepository.save(newItem);
  }

  async findAll(user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<Item[]> {
    const { offset, limit } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.itemsRepository.createQueryBuilder()
      .skip(offset)
      .take(limit)
      .where(`"userId" = :userId`, { userId: user.id })

    if (search) {
      queryBuilder.andWhere('LOWER(name) like :name', { name: `%${search.toLowerCase()}%` })
    }

    return await queryBuilder.getMany();

    // other way
    // return await this.itemsRepository.find({
    //   take: limit,
    //   skip: offset,
    //   where: {
    //     user: { id: user.id },
    //     name: Like(`%${search}%`) // SELECT * FROM items WHERE user_id = :userId AND name LIKE '%search%'
    //   },
    // });
  }

  async findOne(id: string, user: User): Promise<Item> {
    try {
      return await this.itemsRepository.findOneByOrFail({ id, user: { id: user.id } })
    } catch (error) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User): Promise<Item> {
    const item = await this.findOne(id, user);

    const updatedItem = Object.assign(item, updateItemInput);

    return this.itemsRepository.save(updatedItem);
  }

  async remove(id: string, user: User): Promise<Item> {
    const item = await this.findOne(id, user);

    await this.itemsRepository.remove(item);

    return item;
  }

  async itemsCountByUser(user: User): Promise<number> {
    return await this.itemsRepository.count({ where: { user: { id: user.id } } });
  }
}
