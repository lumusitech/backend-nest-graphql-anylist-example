import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { JwtService } from '@nestjs/jwt';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { ListsModule } from './lists/lists.module';
import { ListItemModule } from './list-item/list-item.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      // For deploy with SSL
      ssl: process.env.STATE === 'prod' ? { rejectUnauthorized: false } : false,
      extra: {
        sslmode: process.env.STATE === 'prod' ? 'require' : undefined,
      },
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'AnyListDB',
      synchronize: true,
      autoLoadEntities: true,
    }),
    //? basic config - load all schemas - we need avoid this for production
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   playground: false,
    //   autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //   plugins: [ApolloServerPluginLandingPageLocalDefault()],
    //   //? To avoid noised format error, for more error details set to true
    //   includeStacktraceInErrorResponses: false,
    // }),

    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [JwtService],
      useFactory: (_jwtService: JwtService) => ({
        playground: false,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        context: ({ _req }) => {
          //? This hide the schemas for non authenticated users, but the login and register method too
          //? Solution: Implement a rest full api endpoint for login and register
          // const token = req.headers.authorization?.replace('Bearer ', '');
          // if (!token) throw new Error('No token provided');
          // const payload = jwtService.decode(token);
          // if (!payload) throw new Error('Invalid token');
        },
        includeStacktraceInErrorResponses: false,
      }),
    }),

    ItemsModule,
    UsersModule,
    AuthModule,
    SeedModule,
    CommonModule,
    ListsModule,
    ListItemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
