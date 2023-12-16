import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateTaskDto {
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
  projectId: number;

  @IsNumber()
  sprintId: number;

  @IsNumber()
  statusId: number;
}
