import { IsEmail, IsString, MaxLength } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
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

  @ApiProperty({
    type: String,
    description: 'Password of user',
    default: 'password',
  })
  @IsString()
  password: string;

  @ApiProperty({
    type: String,
    description: 'confirm Password',
    default: 'password',
  })
  @IsString()
  confirmPassword: string;
}
