import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Project } from '../projects/entities/project.entity';
import { Sprint } from '../sprints/entities/sprint.entity';
import { Status } from '../statuses/entities/status.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async findAllBySprintId(sprintId: number) {
    return await this.tasksRepository.find({
      relations: {
        status: true,
      },
      where: {
        sprint: {
          id: sprintId,
        },
      },
    });
  }

  async findAllInBacklogByProjId(projectId: number) {
    return await this.tasksRepository.find({
      relations: {
        status: true,
      },
      where: {
        project: {
          id: projectId,
        },
        sprint: {
          id: IsNull(),
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.tasksRepository.findOne({
      where: { id },
      relations: {
        status: true,
        sprint: true
      }
    });
  }

  async create(createTaskDto: CreateTaskDto) {
    const task = new Task();

    task.title = createTaskDto.title;
    task.desc = createTaskDto.desc;
    task.project = { id: createTaskDto.projectId } as Project;
    task.sprint = {
      id: createTaskDto.sprintId,
    } as Sprint;

    task.status = {
      id: createTaskDto.statusId,
    } as Status;
    await this.tasksRepository.save(task);
    return task;
  }

  /**
   * @return - resulting tuple [prevSprintId, newSprintId, projectId]
   */
  async update(taskId: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.tasksRepository.findOne({
      where: {
        id: taskId,
      },
      relations: {
        sprint: true,
        project: true,
      },
    });

    const prevSprintId: number | null = task.sprint ? task.sprint.id : null;
    const newSprintId = updateTaskDto.sprintId;
    const projectId = task.project.id;

    if (!task) {
      throw 'Task not found';
    }

    task.title = updateTaskDto.title;
    task.desc = updateTaskDto.desc;
    task.status = { id: updateTaskDto.statusId } as Status;
    task.sprint = { id: updateTaskDto.sprintId } as Sprint;

    await this.tasksRepository.update(task.id, task);

    return [prevSprintId, newSprintId, projectId] as const;
  }

  async deleteById(taskId: number) {
    const task = await this.tasksRepository.findOne({
      where: { id: taskId },
      relations: {
        project: true
      }
    });
    const projectId = task.project.id

    await this.tasksRepository.delete({ id: taskId })

    return projectId
  }
}
