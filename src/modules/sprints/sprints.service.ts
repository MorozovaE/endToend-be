import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../projects/entities/project.entity';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { Sprint } from './entities/sprint.entity';

@Injectable()
export class SprintsService {
  constructor(
    @InjectRepository(Sprint)
    private sprintRepository: Repository<Sprint>,
  ) {}

  async findAllByProjectId(projectId: number) {
    return await this.sprintRepository.find({
      where: {
        project: {
          id: projectId,
        },
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    return await this.sprintRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async deleteById(id: number) {
    return await this.sprintRepository.delete({ id });
  }

  async create(createSprintDto: CreateSprintDto) {
    const sprint = this.sprintRepository.create(createSprintDto);

    const proj = new Project();

    proj.id = createSprintDto.projectId;

    sprint.project = proj;

    await this.sprintRepository.save(sprint);

    return sprint;
  }

  async update(id: number, updateSprintDto: UpdateSprintDto) {
    await this.sprintRepository.update(id, {
      title: updateSprintDto.title,
      desc: updateSprintDto.desc,
    });
    return id;
  }
}
