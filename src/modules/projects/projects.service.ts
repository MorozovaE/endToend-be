import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepoistory: Repository<Project>,
  ) {}

  async findAll(id: number) {
    return await this.projectsRepoistory.find({
      where: {
        projectMembers: {
          user: { id },
        },
      },
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

  async create(createProjectDto: CreateProjectDto) {
    const project = this.projectsRepoistory.create(createProjectDto);

    await this.projectsRepoistory.save(project);
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
