import { ProjectMember } from 'src/modules/project_member/entities/project_member.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleNamesEnum } from '../enums/role-names.enum';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, unique: true, nullable: false })
  name: RoleNamesEnum;

  @OneToMany(() => ProjectMember, (projectUser) => projectUser.id)
  projectUsers: ProjectMember[];
}
