import { Task } from '../../domain/entities/task.entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTaskCommand } from '../commands/create-task.command';
import { TaskRepository } from '../../infrastructure/persistence/task-repository';
import { Logger, InternalServerErrorException } from '@nestjs/common'; 

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  private readonly logger = new Logger(CreateTaskHandler.name); 

  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(command: CreateTaskCommand): Promise<Task> {
    const { description, author } = command;
    this.logger.log(`Creating task: ${description} by ${author}`); 

    try {
      const newTask = await this.taskRepository.create({ description, author });
      this.logger.log(`Task created successfully with ID: ${newTask.id}`); 
      return newTask;
    } catch (error) {
      this.logger.error(
        `Failed to create task: ${description} by ${author}`,
        error.stack,
      ); 
      throw new InternalServerErrorException(
        'Failed to create task due to an unexpected error',
      );
    }
  }
}
