import { Project } from 'src/modules/projects/entities/project.entity';
import { Sprint } from 'src/modules/sprints/entities/sprint.entity';
import { Status } from 'src/modules/statuses/entities/status.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  desc: string;

  @ManyToOne(() => Sprint, (sprint) => sprint.id, {
    onDelete: 'CASCADE',
  })
  sprint: Sprint;

  @ManyToOne(() => Project, (project) => project.id, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @ManyToOne(() => Status, (status) => status.id)
  status: Status;
}
