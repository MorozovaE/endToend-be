import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TasksGateway implements OnGatewayConnection {
  constructor(private tasksService: TasksService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {    
    client;
    args;
  }

  getRoomName(sprintId: number | null, projectId: number): string {
    if (sprintId) {
      return `sprint-${sprintId}`;
    }

    return `backlog-${projectId}`;
  }

  private async getTasksForSprintOrBacklog(
    sprintId: number | null,
    projectId: number,
  ) {
    let tasks = [];
    if (sprintId) {
      tasks = await this.tasksService.findAllBySprintId(sprintId);
    } else {
      tasks = await this.tasksService.findAllInBacklogByProjId(projectId);
    }

    return tasks;
  }

  @SubscribeMessage('subscribeToSprint')
  async subscribeToSprint(
    @MessageBody() data: { sprintId: number | null; projectId: string },
    @ConnectedSocket() client: Socket,
  ) {
    for (const room of client.rooms) {
      if (room.startsWith('sprint-') || room.startsWith('backlog-')) {
        client.leave(room);
      }
    }

    client.join(this.getRoomName(data.sprintId, Number(data.projectId)));
  }

  @SubscribeMessage('getTasks')
  async getTasks(
    @MessageBody()
    data: { sprintId: number | null; projectId: string },
    @ConnectedSocket() client: Socket,
  ) {
    let tasks = await this.getTasksForSprintOrBacklog(data.sprintId, Number(data.projectId))
    
    client.emit('tasks', tasks);
  }

  @SubscribeMessage('getTask')
  async getTask(
    @MessageBody()
    taskId: number,
  ) {
    return this.tasksService.findOne(taskId);
  }

  @SubscribeMessage('createTask')
  async createTask(@MessageBody() createTaskDto: CreateTaskDto) {
    const task = await this.tasksService.create(createTaskDto);
    const sprintId = task.sprint.id;

    const tasks = await this.getTasksForSprintOrBacklog(sprintId, task.project.id)
    this.server
      .to(this.getRoomName(sprintId, task.project.id))
      .emit('tasks', tasks);
  }

  @SubscribeMessage('editTask')
  async editTask(@MessageBody() updateTaskDto: UpdateTaskDto) {
    const taskId = updateTaskDto.id;

    const [prevSprintId, newSprintId, projectId] =
      await this.tasksService.update(taskId, updateTaskDto);

    let prevTasks = await this.getTasksForSprintOrBacklog(prevSprintId, projectId)
    this.server
      .to(this.getRoomName(prevSprintId, projectId))
      .emit('tasks', prevTasks);

    let tasks = await this.getTasksForSprintOrBacklog(newSprintId, projectId)
    this.server
      .to(this.getRoomName(newSprintId, projectId))
      .emit('tasks', tasks);
  }

  @SubscribeMessage('deleteTask')
  async deleteTask(@MessageBody() body: any) {
    const projectId = await this.tasksService.deleteById(body.taskId);

    const tasks = await this.getTasksForSprintOrBacklog(body.sprintId, projectId)
    this.server
      .to(this.getRoomName(body.sprintId, projectId))
      .emit('tasks', tasks);
  }
}
