import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiProperty({
    type: String,
    description: 'Project title',
    default: 'new project',
  })
  title: string;

  @ApiProperty({
    type: String,
    description: 'Project description',
    required: false,
    default: 'new project desc',
  })
  desc: string;
}
