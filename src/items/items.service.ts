import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';

import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { User } from 'src/users/entities/user.entity';

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

  async findAll(user: User): Promise<Item[]> {
    //TODO: Add pagination, filtering, etc. if needed
    return await this.itemsRepository.find({ where: { user: { id: user.id } } });
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
