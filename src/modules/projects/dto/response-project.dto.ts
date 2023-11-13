import { ApiProperty } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';

export class ResponseProjectDto extends CreateProjectDto {
  @ApiProperty({
    type: Number,
    description: 'Project id',
  })
  id: number;
}
