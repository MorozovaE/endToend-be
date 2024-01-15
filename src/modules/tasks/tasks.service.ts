import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThan, Repository } from 'typeorm';
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
        sprint: true,
      },
    });
  }

  async create(createTaskDto: CreateTaskDto) {
    const lastOrder = await this.tasksRepository.findOne({
      select: {
        id: true,
        order: true,
      },
      where: {
        status: {
          id: createTaskDto.statusId,
        },
        sprint: {
          id: createTaskDto.sprintId,
        },
      },
      relations: {
        status: true,
        sprint: true,
      },
      order: {
        order: 'DESC',
      },
    });

    let newOrder = lastOrder ? lastOrder.order + 1 : 0;

    const task = new Task();

    task.title = createTaskDto.title;
    task.desc = createTaskDto.desc;
    task.project = { id: createTaskDto.projectId } as Project;
    task.sprint = {
      id: createTaskDto.sprintId,
    } as Sprint;

    task.order = newOrder;
    task.status = {
      id: createTaskDto.statusId,
    } as Status;
    await this.tasksRepository.save(task);
    return task;
  }

  /**
   * @return - resulting tuple [prevSprintId, newSprintId, projectId, reorderInfo]
   */
  async update(taskId: number, updateTaskDto: UpdateTaskDto) {
    let task = await this.tasksRepository.findOne({
      where: {
        id: taskId,
      },
      relations: {
        sprint: true,
        project: true,
        status: true,
      },
    });

    if (!task) {
      throw 'Task not found';
    }

    const prevSprintId: number | null = task.sprint ? task.sprint.id : null;
    const prevStatusId = task.status.id;
    const prevOrder = task.order;

    const newSprintId = updateTaskDto.sprintId;
    const projectId = task.project.id;

    const didSprintChanged = prevSprintId != newSprintId;
    const didStatusChanged = prevStatusId != updateTaskDto.statusId;

    const prevTaskColumn = await this.tasksRepository.find({
      where: {
        status: {
          id: prevStatusId,
        },
        sprint: {
          id: prevSprintId,
        },
      },
      relations: {
        sprint: true,
        status: true,
      },
      order: {
        order: 'ASC',
      },
    });

    const newTaskColumn = await this.tasksRepository.find({
      where: {
        status: {
          id: updateTaskDto.statusId,
        },
        sprint: {
          id: newSprintId,
        },
      },
      relations: {
        sprint: true,
        status: true,
      },
      order: {
        order: 'ASC',
      },
    });

    const taskIndex = prevTaskColumn.map((task) => task.id).indexOf(taskId);

    let newOrder = updateTaskDto.order;

    if (newOrder === null) {
      if (didSprintChanged || didStatusChanged) {
        const lastOrder = await this.tasksRepository.findOne({
          select: {
            id: true,
            order: true,
          },
          where: {
            status: {
              id: updateTaskDto.statusId,
            },
            sprint: {
              id: updateTaskDto.sprintId,
            },
          },
          relations: {
            status: true,
            sprint: true,
          },
          order: {
            order: 'DESC',
          },
        });

        newOrder = lastOrder ? lastOrder.order + 1 : 0;
      } else {
        newOrder = task.order;
      }
    }

    let changePrevTaskColumn = false;
    let changeNewTaskColumn = false;

    if (!didSprintChanged && !didStatusChanged && taskIndex != newOrder) {
      task = prevTaskColumn.splice(taskIndex, 1)[0];
      prevTaskColumn.splice(newOrder, 0, task);
      changePrevTaskColumn = true;
    } else {
      if (didSprintChanged || didStatusChanged || taskIndex != newOrder) {
        task = prevTaskColumn.splice(taskIndex, 1)[0];
        newTaskColumn.splice(newOrder, 0, task);

        changePrevTaskColumn = true;
        changeNewTaskColumn = true;
      }
    }

    if (updateTaskDto.title) task.title = updateTaskDto.title;
    if (updateTaskDto.desc) task.desc = updateTaskDto.desc;

    task.order = newOrder;
    task.status = { id: updateTaskDto.statusId } as Status;
    task.sprint = { id: updateTaskDto.sprintId } as Sprint;

    await this.tasksRepository.save(task);

    if (changePrevTaskColumn) {
      prevTaskColumn.forEach(async (task_, i) => {
        await this.tasksRepository.update(task_.id, {
          order: i,
        });
      });
    }

    if (changeNewTaskColumn) {
      newTaskColumn.forEach(async (task_, i) => {
        await this.tasksRepository.update(task_.id, {
          order: i,
        });
      });
    }

    return [
      prevSprintId,
      newSprintId,
      projectId,
      {
        updatedTask: task,
        reorderInfo: {
          fromIndex: prevOrder,
          toIndex: task.order,

          fromStatus: prevStatusId,
          toStatus: task.status.id,

          fromSprint: prevSprintId,
          toSprint: task.sprint.id,

          taskId: task.id,
        },
      },
    ] as const;
  }

  async deleteById(taskId: number) {
    const task = await this.tasksRepository.findOne({
      where: { id: taskId },
      relations: {
        project: true,
        sprint: true,
        status: true,
      },
    });
    const projectId = task.project.id;
    const sprintId = task.sprint?.id || null;

    const tasksToDecrementOrder = await this.tasksRepository.find({
      where: {
        status: {
          id: task.status.id,
        },
        sprint: {
          id: sprintId,
        },
        order: MoreThan(task.order),
      },
      relations: {
        sprint: true,
        status: true,
      },
    });

    for (const key in tasksToDecrementOrder) {
      const taskToDecrement = tasksToDecrementOrder[key];
      taskToDecrement.order -= 1;

      await this.tasksRepository.save(taskToDecrement);
    }

    await this.tasksRepository.delete({ id: taskId });

    return projectId;
  }
}
