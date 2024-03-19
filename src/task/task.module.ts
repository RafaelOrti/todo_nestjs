import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './domain/entities/task.entity';
import { TaskController } from './infrastructure/api/task.controller';

import { CreateTaskHandler } from './application/handlers/create-task.handler';
import { ListTaskHandler } from './application/handlers/list-task.handler';
import { ListByIdTaskHandler } from './application/handlers/list-by-id-task.handler';
import { DeleteTaskHandler } from './application/handlers/delete-task.handler';
import { UpdateByCompletedHandler } from './application/handlers/update-by-completed.handler';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { TasksEventsConsumer } from './infrastructure/messaging/tasks-events-consumer.service';
import { rabbitMQConfig } from './infrastructure/config/rabbitmq.config';
import { TaskRepository } from './infrastructure/persistence/task-repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    CqrsModule,
    RabbitMQModule.forRoot(RabbitMQModule, rabbitMQConfig),
  ],
  controllers: [TaskController],
  providers: [
    CreateTaskHandler,
    ListTaskHandler,
    ListByIdTaskHandler,
    DeleteTaskHandler,
    UpdateByCompletedHandler,
    TasksEventsConsumer,
    TaskRepository,
  ],
})
export class TaskModule {}
