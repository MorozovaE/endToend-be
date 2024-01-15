import { Body, Controller, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthResponseUser } from './dto/auth-response-user.dto';
import { UserLoginDto } from './dto/login-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 201, type: CreateUserDto })
  register(@Body() createDto: CreateUserDto): Promise<CreateUserDto> {
    return this.authService.registerUser(createDto);
  }

  @Post('login')
  @ApiResponse({ status: 200, type: AuthResponseUser })
  login(@Body() userLoginDto: UserLoginDto): Promise<AuthResponseUser> {
    return this.authService.loginUser(userLoginDto);
  }

  @Post('verify')
  verify(@Query('token') token: string) {
    return this.authService.verify(token);
  }
}
