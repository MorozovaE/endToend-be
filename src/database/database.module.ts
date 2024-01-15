import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => ({
        synchronize: true,
        // dropSchema: true,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        type: 'mysql',
        port: configService.get('database.port'),
        host: configService.get('database.host'),
        username: configService.get('database.user_name'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
      }),
    }),
  ],
})
export class DatabaseModule {}
