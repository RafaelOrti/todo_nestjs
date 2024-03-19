import { ListTaskQuery } from '../queries/list-task.query';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { TaskRepository } from '../../infrastructure/persistence/task-repository';
import { Logger, InternalServerErrorException } from '@nestjs/common'; 
import { Task } from '../../domain/entities/task.entity';

@QueryHandler(ListTaskQuery)
export class ListTaskHandler implements IQueryHandler<ListTaskQuery> {
  private readonly logger = new Logger(ListTaskHandler.name); 

  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(): Promise<Task[]> {
    try {
      this.logger.log('Retrieving all tasks'); 
      const tasks = await this.taskRepository.findAll();
      this.logger.log(`Successfully retrieved ${tasks.length} tasks`); 
      return tasks;
    } catch (error) {
      this.logger.error('Failed to retrieve tasks', error.stack); 
      throw new InternalServerErrorException('Failed to retrieve tasks'); 
    }
  }
}
