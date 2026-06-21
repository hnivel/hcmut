import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from '@shared-kernel/interfaces/use-case.interface';
import { Order } from '../../domain/entities/order.entity';
import {
  IOrderRepository,
  ORDER_REPOSITORY,
} from '../../domain/repositories/order.repository.interface';
import { OrderDomainService } from '../../domain/services/order-domain.service';

@Injectable()
export class GetOrderUseCase implements IUseCase<string, Order> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    private readonly orderDomainService: OrderDomainService,
  ) {}

  async execute(orderID: string): Promise<Order> {
    const order = await this.orderRepository.getByID(orderID);

    try {
      this.orderDomainService.assertOrderExists(order, orderID);
    } catch (err: unknown) {
      throw new NotFoundException((err as Error).message);
    }

    return order!;
  }
}
