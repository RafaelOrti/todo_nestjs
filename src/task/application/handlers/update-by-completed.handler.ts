import { UpdateByCompletedCommand } from '../commands/update-by-completed.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TaskRepository } from '../../infrastructure/persistence/task-repository';
import { Logger, NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateByCompletedCommand)
export class UpdateByCompletedHandler
  implements ICommandHandler<UpdateByCompletedCommand>
{
  private readonly logger = new Logger(UpdateByCompletedHandler.name);

  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(command: UpdateByCompletedCommand): Promise<void> {
    const { id, completed } = command;

    this.logger.log(`Updating task ${id} to completed: ${completed}`);

    const task = await this.taskRepository.findById(id);

    if (!task) {
      this.logger.error(`Task with ID: ${id} not found`);
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    await this.taskRepository.updateCompletedById(id, completed);

    this.logger.log(
      `Task with ID: ${id} successfully updated to completed: ${completed}`,
    );
  }
}
