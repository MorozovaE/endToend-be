import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './modules/roles/entities/role.entity';
import { RoleNamesEnum } from './modules/roles/enums/role-names.enum';
import { Status } from './modules/statuses/entities/status.entity';

@Injectable()
export class AppService implements OnModuleInit {

  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Status)
    private statusRepository: Repository<Status>,
  ) {}

  private seedDB() {
    const roles = [RoleNamesEnum.CREATOR, RoleNamesEnum.GUEST, RoleNamesEnum.REQUESTED]
    const statuses = ["TODO", "IN_PROGRESS", "DONE"]

    roles.forEach(async (role,i) => {

      const doesRoleExist = await this.roleRepository.exist({
        where: {
          name: role 
        }
      })

      if (!doesRoleExist) {
        await this.roleRepository.save(this.roleRepository.create({
          id: i+1,
          name: role
      }))
      }
    })
    
    statuses.forEach(async (status, i) => {

      const doesStatusExist = await this.statusRepository.exist({
        where: {
          name: status 
        } 
      })

      if (!doesStatusExist) {
        await this.statusRepository.save(this.statusRepository.create({
          id: i+1,
            name: status
        }))
      }
    })
  }

  onModuleInit() {
    this.seedDB()
  }

  getHello(): string {
    return 'Hello World!';
  }
}
