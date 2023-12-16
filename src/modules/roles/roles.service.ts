import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepoistory: Repository<Role>,
  ) {}

  async findAll() {
    return await this.rolesRepoistory.find();
  }

  async findOne(id: number) {
    return await this.rolesRepoistory.findOne({
      where: {
        id: id,
      },
    });
  }
}
