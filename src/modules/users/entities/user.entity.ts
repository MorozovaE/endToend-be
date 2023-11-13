import { ProjectMember } from 'src/modules/project_member/entities/project_member.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  firstName: string;

  @Column({ type: 'varchar', length: 30 })
  lastName: string;

  @Column({ type: 'varchar', length: 30 })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @OneToMany(() => ProjectMember, (projectUser) => projectUser.id)
  projectUsers: ProjectMember[];
}
