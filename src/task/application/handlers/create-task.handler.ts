import { Task } from '../../domain/entities/task.entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTaskCommand } from '../commands/create-task.command';
import { TaskRepository } from '../../infrastructure/persistence/task-repository';
import { Logger, InternalServerErrorException } from '@nestjs/common'; // Importar Logger y excepciones

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  private readonly logger = new Logger(CreateTaskHandler.name); // Instancia de Logger

  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(command: CreateTaskCommand): Promise<Task> {
    const { description, author } = command;
    this.logger.log(`Creating task: ${description} by ${author}`); // Logging antes de la operación

    try {
      const newTask = await this.taskRepository.create({ description, author });
      this.logger.log(`Task created successfully with ID: ${newTask.id}`); // Logging de éxito
      return newTask;
    } catch (error) {
      this.logger.error(
        `Failed to create task: ${description} by ${author}`,
        error.stack,
      ); // Logging de error
      throw new InternalServerErrorException(
        'Failed to create task due to an unexpected error',
      );
    }
  }
}
