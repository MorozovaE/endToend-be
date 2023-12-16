import { Project } from 'src/modules/projects/entities/project.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProjectMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, (role) => role.id)
  role: Role;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Project, (project) => project.id, {
    onDelete: 'CASCADE',
  })
  project: Project;
}
