import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { DatabaseModule } from './task/infrastructure/config/database.module';

@Module({
  imports: [DatabaseModule, TaskModule],
})
export class AppModule {}
