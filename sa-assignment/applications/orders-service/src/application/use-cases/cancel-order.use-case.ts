import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { IUseCase } from '@shared-kernel/interfaces/use-case.interface';
import { IEventPublisher } from '@shared-kernel/interfaces/event-publisher.interface';
import { OrderCancelledEvent } from '@shared-kernel/events/order-cancelled.event';
import { Order } from '../../domain/entities/order.entity';
import {
  IOrderRepository,
  ORDER_REPOSITORY,
} from '../../domain/repositories/order.repository.interface';
import { OrderDomainService } from '../../domain/services/order-domain.service';
import { KAFKA_TOPICS } from '../../injection-tokens';
import { EVENT_PUBLISHER } from './create-order.use-case';

@Injectable()
export class CancelOrderUseCase implements IUseCase<string, Order> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    private readonly orderDomainService: OrderDomainService,
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(orderID: string): Promise<Order> {
    const order = await this.orderRepository.getByID(orderID);

    try {
      this.orderDomainService.assertOrderExists(order, orderID);
    } catch (err: unknown) {
      throw new NotFoundException((err as Error).message);
    }

    try {
      order!.cancel();
    } catch (err: unknown) {
      throw new BadRequestException((err as Error).message);
    }

    const savedOrder = await this.orderRepository.put(order!);

    const event: OrderCancelledEvent = {
      orderID: savedOrder.orderID,
      tableNumber: savedOrder.tableNumber,
      cancelledAt: savedOrder.updatedAt.toISOString(),
    };

    this.eventPublisher.publish(KAFKA_TOPICS.ORDER_CANCELLED, event);

    return savedOrder;
  }
}
