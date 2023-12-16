import { IsString } from '@nestjs/class-validator';

export class CreateStatusDto {
  @IsString()
  name: string;
}
