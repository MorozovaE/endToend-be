import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Auth } from '../auth/decorators/auth.decorators';
import { TokenPayload } from '../auth/decorators/token-payload.decorator';
import { IJwtPayload } from '../token/token.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ResponseProjectDto } from './dto/response-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@ApiTags('Project')
@Controller('projects')
@Auth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Get()
  async findAll(@TokenPayload() user: IJwtPayload) {
    return await this.projectsService.findAllByUserId(user.id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.projectsService.findOne(id);
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    return await this.projectsService.deleteById(id);
  }

  @Post()
  @ApiOkResponse({
    status: 201,
    type: ResponseProjectDto,
  })
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @TokenPayload() user: IJwtPayload,
  ) {
    const project = await this.projectsService.create(
      user.id,
      createProjectDto,
    );
    return plainToClass(ResponseProjectDto, project);
  }

  @Put(':id')
  @ApiOkResponse({
    status: 200,
    type: UpdateProjectDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return await this.projectsService.update(id, updateProjectDto);
  }
}
