import { Injectable } from '@nestjs/common';
import { Order, CreateOrderProps } from '../entities/order.entity';

@Injectable()
export class OrderDomainService {
    createOrder(props: CreateOrderProps): Order {
    return Order.create(props);
  }

    assertOrderExists(order: Order | null, orderID: string): asserts order is Order {
    if (!order) {
      throw new Error(`Order with ID "${orderID}" not found`);
    }
  }
}
