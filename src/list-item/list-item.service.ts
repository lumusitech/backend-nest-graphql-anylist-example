import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ListItem } from './entities/list-item.entity';
import { Repository } from 'typeorm';

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

  async findAll(): Promise<ListItem[]> {
    return await this.listItemRepository.find({
      relations: {
        list: true,
        item: true,
      },
    });
  }

  async findOne(id: string): Promise<ListItem> {
    try {
      return await this.listItemRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(`List item with id ${id} not found`);
    }
  }

  async update(id: string, updateListItemInput: UpdateListItemInput): Promise<ListItem> {
    const listItem = await this.findOne(id);
    return await this.listItemRepository.save({ ...listItem, ...updateListItemInput });
  }

  async remove(id: string): Promise<ListItem> {
    const listItem = await this.findOne(id);
    return await this.listItemRepository.remove(listItem);
  }
}
