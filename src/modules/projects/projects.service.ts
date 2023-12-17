import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProjectMemberService } from '../project_member/project_member.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepoistory: Repository<Project>,
    private projectMemberService: ProjectMemberService,
  ) {}

  async findAllByUserId(userId: number) {
    return await this.projectsRepoistory.find({
      where: {
        projectMembers: {
          user: { id: userId },
          role: { id: In([1, 2]) },
        },
      },
      relations: {
        projectMembers: {
          role: true
        }
      }
    });
  }

  async findOne(id: number) {
    return await this.projectsRepoistory.findOne({
      where: { id },
    });
  }

  async deleteById(id: number) {
    return await this.projectsRepoistory.delete({ id });
  }

  async create(userId: number, createProjectDto: CreateProjectDto) {
    const project = this.projectsRepoistory.create(createProjectDto);

    await this.projectsRepoistory.save(project);

    await this.projectMemberService.setCreator(userId, project.id, 1);

    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const updatedProject = await this.projectsRepoistory.update(
      id,
      updateProjectDto,
    );
    return updatedProject;
  }
}
