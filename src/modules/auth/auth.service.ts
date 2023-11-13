import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { AppError } from 'src/common/constants/error';
import { JWTPayload, TokenService } from '../token/token.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthResponseUser } from './dto/auth-response-user.dto';
import { UserLoginDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    try {
      if (createUserDto.password !== createUserDto.confirmPassword)
        throw new BadRequestException(AppError.PASSWORD_MISSMATCH);

      const existUser = await this.userService.findUserByEmail(
        createUserDto.email,
      );
      if (existUser) throw new BadRequestException(AppError.USER_EXIST);

      return this.userService.createUser(createUserDto);
    } catch (e) {
      throw new Error(e);
    }
  }

  async loginUser(userLoginDto: UserLoginDto): Promise<AuthResponseUser> {
    try {
      const existUser = await this.userService.findUserByEmail(
        userLoginDto.email,
      );
      if (!existUser) throw new BadRequestException(AppError.USER_NOT_EXIST);

      const validatePassword = await bcrypt.compare(
        userLoginDto.password,
        existUser.password,
      );
      if (!validatePassword) throw new BadRequestException(AppError.WRONG_DATA);

      const userData: JWTPayload = {
        id: existUser.id,
        name: existUser.firstName,
        email: existUser.email,
      };

      const token = await this.tokenService.generateJwtToken(userData);
      const user = await this.userService.findUserByEmail(userLoginDto.email);

      return plainToClass(AuthResponseUser, { ...user, token });
    } catch (e) {
      throw new Error(e);
    }
  }
}
