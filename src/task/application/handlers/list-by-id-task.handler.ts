import { Task } from '../../domain/entities/task.entity';
import { ListByIdTaskQuery } from '../queries/list-by-id-task.query';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { TaskRepository } from '../../infrastructure/persistence/task-repository';
import { Logger, NotFoundException } from '@nestjs/common'; // Importa Logger y NotFoundException

@QueryHandler(ListByIdTaskQuery)
export class ListByIdTaskHandler implements IQueryHandler<ListByIdTaskQuery> {
  private readonly logger = new Logger(ListByIdTaskHandler.name); // Crea una instancia de Logger

  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(query: ListByIdTaskQuery): Promise<Task> {
    const { id } = query;
    this.logger.log(`Retrieving task with ID: ${id}`); // Registra el intento de recuperar la tarea

    const task = await this.taskRepository.findById(id);

    if (!task) {
      this.logger.error(`Task with ID: ${id} not found`); // Registra un error si no se encuentra la tarea
      throw new NotFoundException(`Task with ID ${id} not found`); // Lanza una excepción si no se encuentra la tarea
    }

    this.logger.log(`Task with ID: ${id} retrieved successfully`); // Registra el éxito en la recuperación de la tarea
    return task;
  }
}
