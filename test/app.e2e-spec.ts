import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Task } from '../src/task/domain/entities/task.entity';

describe('TaskController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /task (Create Task)', () => {
    return request(app.getHttpServer())
      .post('/task')
      .send({ description: 'Test Task' })
      .expect(201);
  });

  it('GET /task (List Tasks)', () => {
    return request(app.getHttpServer())
      .get('/task')
      .expect(200)
      .expect((response) => {
        expect(Array.isArray(response.body)).toBeTruthy();

        response.body.forEach((task: Task) => {
          expect(task.id).toBeDefined();
          expect(task.description).toBeDefined();
          expect(typeof task.completed).toBe('boolean');
          expect(task.createdAt).toBeDefined();
          expect(task.updatedAt).toBeDefined();
        });
      });
  });

  it('GET /task/:id (Get Task by ID)', async () => {
    const listTasksResponse = await request(app.getHttpServer())
      .get('/task')
      .expect(200);

    expect(Array.isArray(listTasksResponse.body)).toBeTruthy();
    expect(listTasksResponse.body.length).toBeGreaterThanOrEqual(1);

    const taskId = listTasksResponse.body[0].id;

    const getTaskResponse = await request(app.getHttpServer())
      .get(`/task/${taskId}`)
      .expect(200);
    const task: Task = getTaskResponse.body;
    expect(task.id).toBeDefined();
    expect(task.description).toBeDefined();
    expect(typeof task.completed).toBe('boolean');
    expect(task.createdAt).toBeDefined();
    expect(task.updatedAt).toBeDefined();
  });

  it('PATCH /task/:id/completed (Update Task by Completed)', () => {
    const taskId = 1;
    return request(app.getHttpServer())
      .patch(`/task/${taskId}/completed`)
      .send({ completed: true })
      .expect(200);
  });

  it('DELETE /task/:id (Delete Task)', () => {
    const taskId = 1;
    return request(app.getHttpServer()).delete(`/task/${taskId}`).expect(200);
  });
});
