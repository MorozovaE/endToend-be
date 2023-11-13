import { IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({
    type: String,
    description: 'User login email',
    default: 'name123@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'Password of user',
    default: 'password',
  })
  @IsString()
  password: string;
}
