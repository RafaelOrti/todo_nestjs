import { Injectable } from '@nestjs/common';
import { Task } from '../../domain/entities/task.entity';
import { ITaskRepository } from '../../domain/repositories/interface-task-repository';

@Injectable()
export class TaskRepository implements ITaskRepository {
  private tasks: Task[] = [];

  async findAll(): Promise<Task[]> {
    return this.tasks;
  }

  async findById(id: number): Promise<Task | undefined> {
    return this.tasks.find((task) => task.id === id);
  }

  async create(task: { description: string; author: string }): Promise<Task> {
    const newTask: Task = {
      id: this.tasks.length + 1,
      description: task.description,
      author: task.author,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.push(newTask);
    return newTask;
  }

  async updateCompletedById(
    id: number,
    completed: boolean,
  ): Promise<Task | undefined> {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = {
        ...this.tasks[taskIndex],
        completed: completed,
        updatedAt: new Date(),
      };
      return this.tasks[taskIndex];
    }
    return undefined;
  }

  async delete(id: number): Promise<boolean> {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter((task) => task.id !== id);
    return this.tasks.length !== initialLength;
  }
}
