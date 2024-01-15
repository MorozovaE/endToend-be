import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepoistory: Repository<User>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    try {
      return bcrypt.hash(password, 10);
    } catch (e) {
      throw new Error(e);
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      return this.usersRepoistory.findOne({ where: { email } });
    } catch (e) {
      throw new Error(e);
    }
  }

  async verifyByEmail(emailConfirmationToken: string) {
    const user = await this.usersRepoistory.findOne({
      where: { emailConfirmationToken },
    });
    user.emailConfirmed = true;
    user.emailConfirmationToken = null;

    this.usersRepoistory.save(user);
  }

  async createUser(
    createUserDto: CreateUserDto,
    emailConfirmationToken: string,
  ): Promise<number> {
    try {
      createUserDto.password = await this.hashPassword(createUserDto.password);
      const res = await this.usersRepoistory.insert({
        ...createUserDto,
        emailConfirmationToken,
      });

      return Number(res.raw.insertId);
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateUser(
    email: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    try {
      await this.usersRepoistory.update({ email }, updateUserDto);
      return updateUserDto;
    } catch (e) {
      throw new Error(e);
    }
  }
}
