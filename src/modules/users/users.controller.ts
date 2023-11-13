import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-guard';
import { JWTPayload } from '../token/token.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch()
  @ApiResponse({ status: 200, type: UpdateUserDto })
  @UseGuards(JwtAuthGuard) //to check whether the user is authorized or not
  @ApiBearerAuth('access-token')
  updateUser(
    @Body() updateDto: UpdateUserDto,
    @Req() request,
  ): Promise<UpdateUserDto> {
    const user = request.user as JWTPayload;

    return this.usersService.updateUser(user.email, updateDto);
  }
}
