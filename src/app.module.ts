import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configurations';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { RolesModule } from './modules/roles/roles.module';
import { SprintsModule } from './modules/sprints/sprints.module';
import { StatusesModule } from './modules/statuses/statuses.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { TokenModule } from './modules/token/token.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    DatabaseModule,
    ProjectsModule,
    SprintsModule,
    UsersModule,
    StatusesModule,
    TasksModule,
    RolesModule,
    AuthModule,
    TokenModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
