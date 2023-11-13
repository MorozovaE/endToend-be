import { IsNumber, IsString, MaxLength } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSprintDto {
  @ApiProperty({
    type: String,
    description: 'Sprint title',
    default: 'sprint1',
  })
  @IsString()
  @MaxLength(30)
  title: string;

  @ApiProperty({
    type: String,
    description: 'Sprint description',
    required: false,
  })
  @IsString()
  desc: string;

  @ApiProperty({
    type: Number,
    description: 'Project id',
  })
  @IsNumber()
  projectId: number;
}
