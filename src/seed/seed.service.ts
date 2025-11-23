import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { ItemsService } from 'src/items/items.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';

@Injectable()
export class SeedService {
    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,
        private readonly usersService: UsersService,
        private readonly itemsService: ItemsService,
    ) {
        this.isProd = this.configService.get('STATE') === 'prod';
    }

    async executeSeed(): Promise<boolean> {
        if (this.isProd) {
            throw new BadRequestException('You can only run the seed in development mode');
        }

        await this.deleteDatabase();
        const user = await this.loadUsers();
        await this.loadItems(user);
        return true;
    }

    async deleteDatabase(): Promise<boolean> {
        // await this.itemsRepository.delete({});
        // await this.usersRepository.delete({});
        // or
        // await this.itemsRepository.query('DELETE FROM items');
        // await this.usersRepository.query('DELETE FROM users');
        // or
        await this.itemsRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();
        await this.usersRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();
        return true;
    }

    async loadUsers(): Promise<User> {
        const usersPromises: Promise<User>[] = []
        for (const user of SEED_USERS) {
            usersPromises.push(this.usersService.create(user));
        }
        const usersResolved = await Promise.all(usersPromises);
        console.log(usersResolved[0]);

        return usersResolved[0];
    }

    async loadItems(user: User): Promise<boolean> {
        const itemsPromises: Promise<Item>[] = []
        for (const item of SEED_ITEMS) {
            itemsPromises.push(this.itemsService.create(item, user));
        }
        await Promise.all(itemsPromises);
        return true;
    }
}
