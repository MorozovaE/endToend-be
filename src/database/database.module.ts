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
        host: configService.get('host'),
        port: configService.get('port'),
        username: configService.get('user_name'),
        password: configService.get('password'),
        database: configService.get('database'),
      }),
    }),
  ],
})
export class DatabaseModule {}
