import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from './entities/status.entity';
import { CreateStatusDto } from './dto/create-status.dto';

@Injectable()
export class StatusesService {
  constructor(
    @InjectRepository(Status)
    private statusRepository: Repository<Status>,
  ) {}

  async findAll() {
    return await this.statusRepository.find();
  }

  async findOne(id: number) {
    return await this.statusRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async deleteById(id: number) {
    return await this.statusRepository.delete({ id });
  }

  async create(createStatusDto: CreateStatusDto) {
    const project = this.statusRepository.create(createStatusDto);

    await this.statusRepository.save(project);

    return project;
  }
}
