import { DeleteTaskCommand } from '../commands/delete-task.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TaskRepository } from '../../infrastructure/persistence/task-repository';
import { Logger, NotFoundException } from '@nestjs/common'; // Importar Logger y excepción para NotFound

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand> {
  private readonly logger = new Logger(DeleteTaskHandler.name); // Instancia de Logger

  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(command: DeleteTaskCommand): Promise<void> {
    const { id } = command;
    this.logger.log(`Attempting to delete task with ID: ${id}`); // Logging antes de la operación

    const result = await this.taskRepository.delete(id);

    if (!result) {
      this.logger.error(`Failed to delete task with ID: ${id}`); // Logging en caso de error
      throw new NotFoundException(`Task with ID ${id} not found`); // Lanzar una excepción si la tarea no se encuentra
    }

    this.logger.log(`Task with ID: ${id} deleted successfully`); // Logging de éxito
  }
}
