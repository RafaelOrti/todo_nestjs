import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { CommandBus } from '@nestjs/cqrs';
import { CreateTaskCommand } from '../../application/commands/create-task.command';

@Injectable()
export class TasksEventsConsumer implements OnModuleInit {
  private readonly logger = new Logger(TasksEventsConsumer.name);

  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly commandBus: CommandBus,
  ) {}

  async onModuleInit() {
    await this.waitForConnectionReady(5000);
    this.subscribeToQueue();
  }

  private async waitForConnectionReady(delay: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  private subscribeToQueue() {
    try {
      this.amqpConnection.channel.consume(
        process.env.RABBITMQ_QUEUE_NAME || 'user_creation_queue',
        async (msg) => {
          if (msg !== null) {
            const message = JSON.parse(msg.content.toString());
            await this.handleUserCreated(message.email);
            this.amqpConnection.channel.ack(msg);
          }
        },
      );
      this.logger.log('Subscription to user_creation_queue started.');
    } catch (error) {
      this.logger.error('Error initializing queue consumption', error);
    }
  }

  private async handleUserCreated(email: string) {
    try {
      const description = `Welcome task for user ${email}`;
      await this.commandBus.execute(new CreateTaskCommand(description, email));
      this.logger.log(`Task created for user: ${email}`);
    } catch (error) {
      this.logger.error(`Error creating task for user ${email}: ${error}`);
    }
  }
}
