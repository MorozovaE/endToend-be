import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsGuard } from '../guards/ws-jwt-guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@UseGuards(WsGuard)
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

  roomNameFromId(sprintId: number): string {
    return `sprint-${sprintId}`;
  }

  @SubscribeMessage('subscribeToSprint')
  async subscribeToSprint(
    @MessageBody() sprintId: any,
    @ConnectedSocket() client: Socket,
  ) {
    for (const room of client.rooms) {
      if (room.startsWith('sprint-')) {
        client.leave(room);
      }
    }
    client.join(this.roomNameFromId(sprintId));
  }

  @SubscribeMessage('getTasks')
  async getTasks(
    @MessageBody() sprintId: any,
    @ConnectedSocket() client: Socket,
  ) {
    const tasks = await this.tasksService.findAllBySprintId(sprintId);

    client.emit('tasks', tasks);
  }

  @SubscribeMessage('createTask')
  async createTask(@MessageBody() createTaskDto: CreateTaskDto) {
    const task = await this.tasksService.create(createTaskDto);
    const sprintId = task.sprint.id;

    const tasks = await this.tasksService.findAllBySprintId(sprintId);
    this.server.to(this.roomNameFromId(sprintId)).emit('tasks', tasks);
  }

  @SubscribeMessage('editTask')
  async editTask(@MessageBody() updateTaskDto: UpdateTaskDto) {
    const taskId = updateTaskDto.id;

    const [prevSprintId, newSprintId] = await this.tasksService.update(
      taskId,
      updateTaskDto,
    );

    const prevTasks = await this.tasksService.findAllBySprintId(prevSprintId);
    this.server.to(this.roomNameFromId(prevSprintId)).emit('tasks', prevTasks);

    const tasks = await this.tasksService.findAllBySprintId(newSprintId);
    this.server.to(this.roomNameFromId(newSprintId)).emit('tasks', tasks);
  }

  @SubscribeMessage('deleteTask')
  async deleteTask(@MessageBody() body: any) {
    await this.tasksService.deleteById(body.taskId);

    const tasks = await this.tasksService.findAllBySprintId(body.sprintId);
    this.server.to(this.roomNameFromId(body.sprintId)).emit('tasks', tasks);
  }
}
