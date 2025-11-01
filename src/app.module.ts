import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';

// interface NestValidationError {
//   statusCode: 400; // El ValidationPipe siempre usa 400 Bad Request
//   message: string[]; // Un array de strings con los mensajes de class-validator
//   error: 'Bad Request';
// }

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'AnyListDB',
      synchronize: true,
      autoLoadEntities: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      //? To avoid noised format error, for more error details set to true
      includeStacktraceInErrorResponses: false,

      //? OR
      //? Opcional: Formateo personalizado de errores GraphQL
      //? 1. Interceptamos los errores lanzados por los Resolvers y los simplificamos
      // formatError: (error: GraphQLError) => {
      //   // El 'originalError' viene envuelto en error.extensions
      //   const originalError = error.extensions?.originalError;

      //   // 2. Comprobación estricta para el error de Validación
      //   if (
      //     // ⚠️ Comprobamos si el objeto existe
      //     originalError &&
      //     // ⚠️ Comprobamos que tenga la estructura esperada (propiedades clave)
      //     typeof originalError === 'object' &&
      //     'statusCode' in originalError &&
      //     'message' in originalError &&
      //     Array.isArray((originalError as NestValidationError).message) // <-- Usamos aserción para Array.isArray
      //   ) {
      //     // Asignamos la aserción de tipo para usarla de forma segura
      //     const validationError = originalError as NestValidationError;

      //     if (validationError.statusCode === 400) {
      //       const validationErrors = validationError.message.map((msg) => ({
      //         fieldError: msg,
      //       }));

      //       return {
      //         message: 'Error de validación de entrada (Validation Failed)',
      //         errors: validationErrors,
      //         code: 'BAD_USER_INPUT',
      //       };
      //     }
      //   }

      //   // 3. Devolvemos el error original para todos los demás casos
      //   return {
      //     message: error.message,
      //     code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
      //   };
      // },
    }),

    ItemsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
