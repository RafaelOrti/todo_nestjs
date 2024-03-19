import { Task } from '../../domain/entities/task.entity';
import { ListByIdTaskQuery } from '../queries/list-by-id-task.query';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { TaskRepository } from '../../infrastructure/persistence/task-repository';
import { Logger, NotFoundException } from '@nestjs/common'; 

@QueryHandler(ListByIdTaskQuery)
export class ListByIdTaskHandler implements IQueryHandler<ListByIdTaskQuery> {
  private readonly logger = new Logger(ListByIdTaskHandler.name); 

  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(query: ListByIdTaskQuery): Promise<Task> {
    const { id } = query;
    this.logger.log(`Retrieving task with ID: ${id}`); 

    const task = await this.taskRepository.findById(id);

    if (!task) {
      this.logger.error(`Task with ID: ${id} not found`); 
      throw new NotFoundException(`Task with ID ${id} not found`); 
    }

    this.logger.log(`Task with ID: ${id} retrieved successfully`); 
    return task;
  }
}
