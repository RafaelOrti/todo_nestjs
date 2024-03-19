import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { CreateTaskCommand } from '../../application/commands/create-task.command';
import { UpdateByCompletedCommand } from '../../application/commands/update-by-completed.command';
import { DeleteTaskCommand } from '../../application/commands/delete-task.command';
import { ListTaskQuery } from '../../application/queries/list-task.query';
import { ListByIdTaskQuery } from '../../application/queries/list-by-id-task.query';
import { CreateTaskDto } from '../../application/dto/create-task-dto';
import { UpdateTaskDto } from '../../application/dto/update-task-dto';

@ApiTags('task')
@Controller('task')
export class TaskController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 201, description: 'Task created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.commandBus.execute(
      new CreateTaskCommand(createTaskDto.description, createTaskDto.author),
    );
  }

  @Get()
  @ApiOperation({ summary: 'List all tasks' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully.' })
  async find() {
    return this.queryBus.execute(new ListTaskQuery());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.queryBus.execute(new ListByIdTaskQuery(id));
  }

  @Patch(':id/completed')
  @ApiOperation({ summary: 'Update task completion status' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ status: 200, description: 'Task updated successfully.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async updateByCompleted(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.commandBus.execute(
      new UpdateByCompletedCommand(id, updateTaskDto.completed),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.commandBus.execute(new DeleteTaskCommand(id));
  }
}
