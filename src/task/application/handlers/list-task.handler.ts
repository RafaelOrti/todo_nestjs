import { ListTaskQuery } from '../queries/list-task.query';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { TaskRepository } from '../../infrastructure/persistence/task-repository';
import { Logger, InternalServerErrorException } from '@nestjs/common'; // Importa Logger y InternalServerErrorException
import { Task } from '../../domain/entities/task.entity';

@QueryHandler(ListTaskQuery)
export class ListTaskHandler implements IQueryHandler<ListTaskQuery> {
  private readonly logger = new Logger(ListTaskHandler.name); // Instancia de Logger

  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(): Promise<Task[]> {
    try {
      this.logger.log('Retrieving all tasks'); // Registra el inicio de la operación
      const tasks = await this.taskRepository.findAll();
      this.logger.log(`Successfully retrieved ${tasks.length} tasks`); // Registra el éxito de la operación
      return tasks;
    } catch (error) {
      this.logger.error('Failed to retrieve tasks', error.stack); // Registra el error
      throw new InternalServerErrorException('Failed to retrieve tasks'); // Lanza una excepción en caso de error
    }
  }
}
