import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTaskCommand } from '../../application/commands/create-task.command';
import { UpdateByCompletedCommand } from '../../application/commands/update-by-completed.command';
import { DeleteTaskCommand } from '../../application/commands/delete-task.command';
import { ListTaskQuery } from '../../application/queries/list-task.query';
import { ListByIdTaskQuery } from '../../application/queries/list-by-id-task.query';
import { CreateTaskDto } from '../../application/dto/create-task-dto';
import { UpdateTaskDto } from '../../application/dto/update-task-dto';

describe('TaskController', () => {
  let taskController: TaskController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [CommandBus, QueryBus],
    }).compile();

    taskController = module.get<TaskController>(TaskController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  describe('create', () => {
    it('should call commandBus with CreateTaskCommand including author', async () => {
      const createTaskDto: CreateTaskDto = {
        description: 'Nueva tarea',
        author: 'Nombre del autor',
      };
      jest.spyOn(commandBus, 'execute').mockResolvedValueOnce({});

      await taskController.create(createTaskDto);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new CreateTaskCommand(createTaskDto.description, createTaskDto.author),
      );
    });
  });

  describe('find', () => {
    it('should call queryBus with ListTaskQuery', async () => {
      jest.spyOn(queryBus, 'execute').mockResolvedValueOnce([]);

      await taskController.find();

      expect(queryBus.execute).toHaveBeenCalledWith(new ListTaskQuery());
    });
  });

  describe('findById', () => {
    it('should call queryBus with ListByIdTaskQuery', async () => {
      const taskId = 1;
      jest.spyOn(queryBus, 'execute').mockResolvedValueOnce({});

      await taskController.findById(taskId);

      expect(queryBus.execute).toHaveBeenCalledWith(
        new ListByIdTaskQuery(taskId),
      );
    });
  });

  describe('updateByCompleted', () => {
    it('should call commandBus with UpdateByCompletedCommand', async () => {
      const taskId = 1;
      const updateTaskDto: UpdateTaskDto = { completed: true };
      jest.spyOn(commandBus, 'execute').mockResolvedValueOnce({});

      await taskController.updateByCompleted(taskId, updateTaskDto);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new UpdateByCompletedCommand(taskId, updateTaskDto.completed),
      );
    });
  });

  describe('delete', () => {
    it('should call commandBus with DeleteTaskCommand', async () => {
      const taskId = 1;
      jest.spyOn(commandBus, 'execute').mockResolvedValueOnce({});

      await taskController.delete(taskId);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new DeleteTaskCommand(taskId),
      );
    });
  });
});
