import { ApiProperty } from '@nestjs/swagger';
import { CreateSprintDto } from './create-sprint.dto';

export class ResponseSprintDto extends CreateSprintDto {
  @ApiProperty({
    type: Number,
    description: 'Sprint id',
  })
  id: number;
}
