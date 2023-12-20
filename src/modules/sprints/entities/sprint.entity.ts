import { Project } from 'src/modules/projects/entities/project.entity';
import { Task } from 'src/modules/tasks/entities/task.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Sprint {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: 'varchar', length: 30 })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  desc: string;

  @OneToMany(() => Task, (task) => task.id)
  tasks: Task[];

  @ManyToOne(() => Project, (project) => project.id, {
    onDelete: 'CASCADE',
  })
  project: Project;
}
