import { DataSource } from 'typeorm';
import { Task } from '../../domain/entities/task.entity';
import { join } from 'path';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'mysql_task',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'db_task',
  logging: true,
  entities: [Task],
  synchronize: false,
  migrations: [join(__dirname, '/../../', 'database/migrations/**/*{.ts,.js}')],
  migrationsTableName: 'task',
  migrationsRun: true,
});

export default AppDataSource;
