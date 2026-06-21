import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Infrastructure
import { KitchenTicketOrmEntity, TicketItemOrmEntity } from './infrastructure/persistence/kitchen-ticket.orm-entity';
import { KitchenTicketRepositoryImpl } from './infrastructure/persistence/kitchen-ticket.repository.impl';
import { OrderEventSubscriber } from './infrastructure/messaging/order-event.subscriber';

// Application
import { ProcessOrderEventUseCase } from './application/use-cases/process-order-event.use-case';
import { UpdateTicketStatusUseCase } from './application/use-cases/update-ticket-status.use-case';
import { GetKitchenQueueUseCase } from './application/use-cases/get-kitchen-queue.use-case';
import { GetTicketUseCase } from './application/use-cases/get-ticket.use-case';
import { KitchenApplicationService } from './application/kitchen-application.service';

// Domain
import { KitchenDomainService } from './domain/services/kitchen-domain.service';
import { KITCHEN_TICKET_REPOSITORY } from './domain/repositories/kitchen-ticket.repository.interface';

// Presentation
import { KitchenController } from './presentation/kitchen.controller';

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
        entities: [KitchenTicketOrmEntity, TicketItemOrmEntity],
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV === 'development',
      }),
    }),

    TypeOrmModule.forFeature([KitchenTicketOrmEntity, TicketItemOrmEntity]),
  ],

  controllers: [
    KitchenController,
    OrderEventSubscriber, // Kafka @EventPattern handlers
  ],

  providers: [
    // Domain
    KitchenDomainService,

    // Repositories
    { provide: KITCHEN_TICKET_REPOSITORY, useClass: KitchenTicketRepositoryImpl },

    // Use cases
    ProcessOrderEventUseCase,
    UpdateTicketStatusUseCase,
    GetKitchenQueueUseCase,
    GetTicketUseCase,

    // Application service
    KitchenApplicationService,
  ],
})
export class KitchenModule {}
