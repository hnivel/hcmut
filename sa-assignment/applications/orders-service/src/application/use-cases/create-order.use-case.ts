import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { IUseCase } from '@shared-kernel/interfaces/use-case.interface';
import { IEventPublisher } from '@shared-kernel/interfaces/event-publisher.interface';
import { OrderCreatedEvent } from '@shared-kernel/events/order-created.event';
import { Order, CreateOrderProps } from '../../domain/entities/order.entity';
import {
  IOrderRepository,
  ORDER_REPOSITORY,
} from '../../domain/repositories/order.repository.interface';
import { OrderDomainService } from '../../domain/services/order-domain.service';
import { KAFKA_TOPICS } from '../../injection-tokens';

export const EVENT_PUBLISHER = Symbol('IEventPublisher');

@Injectable()
export class CreateOrderUseCase implements IUseCase<CreateOrderProps, Order> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    private readonly orderDomainService: OrderDomainService,
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(input: CreateOrderProps): Promise<Order> {
    let order: Order;

    try {
      order = this.orderDomainService.createOrder(input);
    } catch (err: unknown) {
      throw new BadRequestException((err as Error).message);
    }

    const savedOrder = await this.orderRepository.put(order);

    const event: OrderCreatedEvent = {
      orderID: savedOrder.orderID,
      tableNumber: savedOrder.tableNumber,
      items: savedOrder.items.map((item) => ({
        menuItemID: item.menuItemID,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        notes: item.notes,
        category: item.category,
      })),
      allergyNotes: savedOrder.allergyNotes,
      createdAt: savedOrder.createdAt.toISOString(),
    };

    this.eventPublisher.publish(KAFKA_TOPICS.ORDER_CREATED, event);

    return savedOrder;
  }
}
