import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    type: String,
    description: 'Firstname of user',
    default: 'Bob',
  })
  @IsString()
  @MaxLength(30)
  firstName: string;

  @ApiProperty({
    type: String,
    description: 'Lastname of user',
    default: 'Smith',
  })
  @IsString()
  @MaxLength(30)
  lastName: string;

  @ApiProperty({
    type: String,
    description: 'Email of user',
    default: 'name123@gmail.com',
  })
  @IsEmail()
  @MaxLength(30)
  email: string;
}
