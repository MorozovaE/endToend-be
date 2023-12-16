import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({
    type: Number,
    description: 'Project id',
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'Task title',
    default: 'new task',
  })
  title: string;

  @ApiProperty({
    type: String,
    description: 'Task description',
    required: false,
    default: 'new task desc',
  })
  desc: string;

  @IsNumber()
  sprintId: number;

  @IsNumber()
  statusId: number;
}
