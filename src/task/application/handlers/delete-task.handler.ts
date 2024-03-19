import { DeleteTaskCommand } from '../commands/delete-task.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TaskRepository } from '../../infrastructure/persistence/task-repository';
import { Logger, NotFoundException } from '@nestjs/common'; 

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand> {
  private readonly logger = new Logger(DeleteTaskHandler.name); 

  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(command: DeleteTaskCommand): Promise<void> {
    const { id } = command;
    this.logger.log(`Attempting to delete task with ID: ${id}`); 

    const result = await this.taskRepository.delete(id);

    if (!result) {
      this.logger.error(`Failed to delete task with ID: ${id}`); 
      throw new NotFoundException(`Task with ID ${id} not found`); 
    }

    this.logger.log(`Task with ID: ${id} deleted successfully`); 
  }
}
