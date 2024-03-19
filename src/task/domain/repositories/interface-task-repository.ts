import { Task } from '../entities/task.entity';

export interface ITaskRepository {
  findAll(): Promise<Task[]>;
  findById(id: number): Promise<Task | undefined>;
  create(task: { description: string; author: string }): Promise<Task>;
  updateCompletedById(
    id: number,
    completed: boolean,
  ): Promise<Task | undefined>;
  delete(id: number): Promise<boolean>;
}
