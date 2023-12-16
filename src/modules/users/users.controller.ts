import { Body, Controller, Patch, Req } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IJwtPayload } from '../token/token.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Auth } from '../auth/decorators/auth.decorators';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch()
  @ApiResponse({ status: 200, type: UpdateUserDto })
  @Auth()
  updateUser(
    @Body() updateDto: UpdateUserDto,
    @Req() request,
  ): Promise<UpdateUserDto> {
    const user = request.user as IJwtPayload;

    return this.usersService.updateUser(user.email, updateDto);
  }
}
