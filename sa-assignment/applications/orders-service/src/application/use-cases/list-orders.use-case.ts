import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from '@shared-kernel/interfaces/use-case.interface';
import { Order } from '../../domain/entities/order.entity';
import {
  IOrderRepository,
  ORDER_REPOSITORY,
  OrderFilter,
} from '../../domain/repositories/order.repository.interface';

@Injectable()
export class ListOrdersUseCase implements IUseCase<OrderFilter | undefined, Order[]> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(filter?: OrderFilter): Promise<Order[]> {
    return this.orderRepository.get(filter);
  }
}
