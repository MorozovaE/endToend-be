import { IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class AuthResponseUser {
  @ApiProperty({
    type: String,
    description: 'User first name',
    default: 'Bob',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    type: String,
    description: 'User last name',
    default: 'Smith',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    type: String,
    description: 'User email',
    default: 'name123@gmail.com',
  })
  @IsEmail()
  email: string;

  @Exclude()
  password: string;

  @ApiProperty({
    type: String,
    description: 'User token',
    default: 'token',
  })
  @IsString()
  token: string;
}
