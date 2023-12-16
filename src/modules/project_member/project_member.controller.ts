import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorators';
import { TokenPayload } from '../auth/decorators/token-payload.decorator';
import { IJwtPayload } from '../token/token.service';
import { ProjectMemberService } from './project_member.service';

@Auth()
@ApiTags('ProjectMember')
@Controller('projectMember')
export class ProjectMemberController {
  constructor(private readonly projectMemberService: ProjectMemberService) {}

  @ApiOkResponse({
    status: 201,
  })
  @Post("/:uuid")
  async createRequest(
    @Param('uuid') uuid: string,
    @TokenPayload() user: IJwtPayload,
  ) {    
    await this.projectMemberService.createRequest({
      userId: user.id,
      uuid: uuid,
    });

    return uuid;
  }

  @Delete('/:projectId/:userId')
  async deleteRequest(
    @Param('projectId') projectId: number,
    @Param('userId') userId: number,
  ) {
    return await this.projectMemberService.deleteRequest(projectId, userId);
  }

  @Put('/:userId/:projectId')
  @ApiOkResponse({
    status: 200,
  })
  async update(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.projectMemberService.setGuest(userId, projectId);
  }

  @Get('/:userId')
  async findAllOutGoingRequests(@Param('userId') userId: number) {
    return await this.projectMemberService.getOutgoingRequests(userId);
  }

  @Get('/:userId/:roleId')
  async findAllIncomingRequests(@Param('userId', ParseIntPipe) userId: number) {
    return await this.projectMemberService.getIncomingRequests(userId);
  }
}
