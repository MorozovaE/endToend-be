import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { ResponseSprintDto } from './dto/response-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { SprintsService } from './sprints.service';

@ApiTags('Sprint')
@Controller('sprints')
export class SprintsController {
  constructor(private readonly sprintsService: SprintsService) {}

  @Get()
  async findAllByProjectId(
    @Query('projectId', ParseIntPipe) projectId: number,
  ) {
    const sprints = await this.sprintsService.findAllByProjectId(projectId);

    return sprints;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.sprintsService.findOne(id);
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    return await this.sprintsService.deleteById(id);
  }
  @Post()
  async create(@Body() createProjectDto: CreateSprintDto) {
    const sprint = await this.sprintsService.create(createProjectDto);
    return plainToClass(ResponseSprintDto, sprint);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSprintDto: UpdateSprintDto,
  ) {
    return await this.sprintsService.update(id, updateSprintDto);
  }
}
