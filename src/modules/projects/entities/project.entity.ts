import { ProjectMember } from 'src/modules/project_member/entities/project_member.entity';
import { Sprint } from 'src/modules/sprints/entities/sprint.entity';
import { Task } from 'src/modules/tasks/entities/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  desc: string;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @OneToMany(() => Sprint, (sprint) => sprint.project)
  sprints: Sprint[];

  @OneToMany(() => ProjectMember, (projectMember) => projectMember.project)
  projectMembers: ProjectMember[];
}
