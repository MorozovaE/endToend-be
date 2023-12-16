import { IsString, MaxLength } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    type: String,
    description: 'Project title',
    default: 'project1',
  })
  @IsString()
  @MaxLength(30)
  title: string;

  @ApiProperty({
    type: String,
    description: 'Project description',
    default: 'project',
    required: false,
  })
  @IsString()
  desc: string;
}
