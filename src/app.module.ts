import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configurations';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectMemberModule } from './modules/project_member/project_member.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { Role } from './modules/roles/entities/role.entity';
import { SprintsModule } from './modules/sprints/sprints.module';
import { Status } from './modules/statuses/entities/status.entity';
import { TasksModule } from './modules/tasks/tasks.module';
import { TokenModule } from './modules/token/token.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Status]),
    DatabaseModule,
    ProjectsModule,
    SprintsModule,
    UsersModule,
    AuthModule,
    TokenModule,
    TasksModule,
    ProjectMemberModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
