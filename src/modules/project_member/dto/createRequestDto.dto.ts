import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateRequestDto {
  @ApiProperty({
    type: Number,
    description: 'projectId',
    default: 1,
  })
  @IsNumber()
  projectId: number;

  @ApiProperty({
    type: Number,
    description: 'roleId',
    default: 3,
  })
  @IsNumber()
  roleId: number;

  @ApiProperty({
    type: String,
    description: 'uuid',
  })
  @IsNumber()
  uuid: string;
}
