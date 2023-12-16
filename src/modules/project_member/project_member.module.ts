import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../projects/entities/project.entity';
import { ProjectMember } from './entities/project_member.entity';
import { ProjectMemberController } from './project_member.controller';
import { ProjectMemberService } from './project_member.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectMember, Project])],
  providers: [ProjectMemberService],
  controllers: [ProjectMemberController],
  exports: [ProjectMemberService],
})
export class ProjectMemberModule {}
