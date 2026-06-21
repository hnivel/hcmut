import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { IEventPublisher } from '@shared-kernel/interfaces/event-publisher.interface';

export const EVENT_PUBLISHER = Symbol('IEventPublisher');
export const KAFKA_CLIENT = 'KAFKA_CLIENT';

@Injectable()
export class KafkaEventPublisher implements IEventPublisher, OnModuleInit {
  constructor(
    @Inject(KAFKA_CLIENT)
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.kafkaClient.connect();
  }

  publish<T>(topic: string, payload: T): void {
    this.kafkaClient.emit(topic, payload);
  }
}
