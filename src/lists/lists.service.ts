import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { ListItemService } from 'src/list-item/list-item.service';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    private readonly listItemService: ListItemService
  ) { }

  async create(createListInput: CreateListInput, user: User): Promise<List> {
    const newItem = this.listRepository.create({ ...createListInput, user });

    //? Here you can add additional logic before saving the item, if needed

    return await this.listRepository.save(newItem);
  }

  async findAll(user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<List[]> {
    const { offset, limit } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listRepository.createQueryBuilder()
      .skip(offset)
      .take(limit)
      .where(`"userId" = :userId`, { userId: user.id })

    if (search) {
      queryBuilder.andWhere('LOWER(name) like :name', { name: `%${search.toLowerCase()}%` })
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<List> {
    try {
      return await this.listRepository.findOneByOrFail({ id, user: { id: user.id } })
    } catch (error) {
      throw new NotFoundException(`List with ID ${id} not found`);
    }
  }

  async update(id: string, updateListInput: UpdateListInput, user: User): Promise<List> {
    const list = await this.findOne(id, user);

    const updatedList = Object.assign(list, updateListInput);

    return this.listRepository.save(updatedList);
  }

  async remove(id: string, user: User): Promise<List> {
    const list = await this.findOne(id, user);
    return await this.listRepository.remove(list);
  }

  async listsCountByUser(user: User): Promise<number> {
    return await this.listRepository.count({ where: { user: { id: user.id } } });
  }

  async getListItemByList(list: List, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<ListItem[]> {
    return await this.listItemService.findAll(list, paginationArgs, searchArgs);
  }

  async getListItemCountByList(list: List): Promise<number> {
    return await this.listItemService.getListItemCountByList({ where: { list: { id: list.id } } });
  }
}
