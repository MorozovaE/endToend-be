import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        // type: 'sqlite',
        // database: './test.sqlite',
        synchronize: true,
        // dropSchema: true,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'endToendBackend',
        password: '1337',
        database: 'endToend'
      }),
    }),
  ],
})
export class DatabaseModule {}
