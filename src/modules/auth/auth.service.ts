import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { AppError } from 'src/common/constants/error';
import { MailingService } from '../mailing/mailing.service';
import { IJwtPayload, TokenService } from '../token/token.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthResponseUser } from './dto/auth-response-user.dto';
import { UserLoginDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private mailingRepository: MailingService,
    private readonly tokenService: TokenService,
  ) {}

  async verify(token: string) {
    return this.userService.verifyByEmail(token);
  }

  async registerUser(createUserDto: CreateUserDto): Promise<any> {
    if (createUserDto.password !== createUserDto.confirmPassword)
      throw new BadRequestException(AppError.PASSWORD_MISSMATCH);

    const existUser = await this.userService.findUserByEmail(
      createUserDto.email,
    );
    if (existUser) throw new BadRequestException(AppError.USER_EXIST);

    const emailConfirmationToken =
      await this.mailingRepository.generateEmailToken();

    const id = await this.userService.createUser(
      createUserDto,
      emailConfirmationToken,
    );

    this.mailingRepository.sendEmailConfirm(
      createUserDto.email,
      `${createUserDto.firstName} ${createUserDto.lastName}`,
      emailConfirmationToken,
    );

    const userData: IJwtPayload = {
      id,
      name: createUserDto.firstName,
      email: createUserDto.email,
    };

    // login part
    const token = await this.tokenService.generateJwtToken(userData);

    // send email

    return { token };
  }

  async loginUser(userLoginDto: UserLoginDto): Promise<AuthResponseUser> {
    const existUser = await this.userService.findUserByEmail(
      userLoginDto.email,
    );
    if (!existUser) throw new UnauthorizedException(AppError.USER_NOT_EXIST);

    const validatePassword = await bcrypt.compare(
      userLoginDto.password,
      existUser.password,
    );

    if (!validatePassword) throw new UnauthorizedException(AppError.WRONG_DATA);

    const userData: IJwtPayload = {
      id: existUser.id,
      name: existUser.firstName,
      email: existUser.email,
    };

    const token = await this.tokenService.generateJwtToken(userData);
    const user = await this.userService.findUserByEmail(userLoginDto.email);

    return plainToClass(AuthResponseUser, { ...user, token });
  }
}
