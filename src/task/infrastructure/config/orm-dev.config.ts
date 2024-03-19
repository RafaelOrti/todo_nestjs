import { DataSource } from 'typeorm';
import { Task } from '../../domain/entities/task.entity';
import { join } from 'path';

const AppDataSource = new DataSource({
  type: 'sqlite',

  database: 'database.sqlite',
  logging: true,

  entities: [Task],
  synchronize: true,
  migrations: [join(__dirname, '/../../', 'database/migrations/**/*{.ts,.js}')],
  migrationsTableName: 'task',
  migrationsRun: true,
});

export default AppDataSource;
