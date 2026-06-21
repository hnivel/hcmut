import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';

// Infrastructure
import { OrderOrmEntity, OrderItemOrmEntity } from './infrastructure/persistence/order.orm-entity';
import { OrderRepositoryImpl } from './infrastructure/persistence/order.repository.impl';
import {
  KafkaEventPublisher,
  KAFKA_CLIENT,
} from './infrastructure/messaging/kafka-event-publisher';

// Application
import { CreateOrderUseCase, EVENT_PUBLISHER } from './application/use-cases/create-order.use-case';
import { UpdateOrderUseCase } from './application/use-cases/update-order.use-case';
import { CancelOrderUseCase } from './application/use-cases/cancel-order.use-case';
import { GetOrderUseCase } from './application/use-cases/get-order.use-case';
import { ListOrdersUseCase } from './application/use-cases/list-orders.use-case';
import { OrderApplicationService } from './application/order-application.service';

// Domain
import { OrderDomainService } from './domain/services/order-domain.service';
import { ORDER_REPOSITORY } from './domain/repositories/order.repository.interface';

// Presentation
import { OrderController } from './presentation/order.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST ?? 'localhost',
        port: parseInt(process.env.DB_PORT ?? '5432', 10),
        username: process.env.DB_USER ?? 'postgres',
        password: process.env.DB_PASSWORD ?? 'password',
        database: process.env.DB_NAME ?? 'restaurant_db',
        entities: [OrderOrmEntity, OrderItemOrmEntity],
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV === 'development',
      }),
    }),

    TypeOrmModule.forFeature([OrderOrmEntity, OrderItemOrmEntity]),

    ClientsModule.registerAsync([
      {
        name: KAFKA_CLIENT,
        useFactory: () => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'orders-service',
              brokers: [(process.env.KAFKA_BROKER ?? 'localhost:9092')],
            },
            producer: {
              allowAutoTopicCreation: true,
            },
          },
        }),
      },
    ]),
  ],

  controllers: [OrderController],

  providers: [
    // Domain
    OrderDomainService,

    // Repositories
    { provide: ORDER_REPOSITORY, useClass: OrderRepositoryImpl },

    // Event Publisher
    KafkaEventPublisher,
    { provide: EVENT_PUBLISHER, useClass: KafkaEventPublisher },

    // Use cases
    CreateOrderUseCase,
    UpdateOrderUseCase,
    CancelOrderUseCase,
    GetOrderUseCase,
    ListOrdersUseCase,

    // Application service
    OrderApplicationService,
  ],
})
export class OrdersModule {}
