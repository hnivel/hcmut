import { Injectable } from '@nestjs/common';
import { Order } from '../domain/entities/order.entity';
import { CreateOrderProps } from '../domain/entities/order.entity';
import { OrderFilter } from '../domain/repositories/order.repository.interface';
import { CreateOrderUseCase } from './use-cases/create-order.use-case';
import { UpdateOrderUseCase, UpdateOrderInput } from './use-cases/update-order.use-case';
import { CancelOrderUseCase } from './use-cases/cancel-order.use-case';
import { GetOrderUseCase } from './use-cases/get-order.use-case';
import { ListOrdersUseCase } from './use-cases/list-orders.use-case';

@Injectable()
export class OrderApplicationService {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly updateOrderUseCase: UpdateOrderUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
    private readonly getOrderUseCase: GetOrderUseCase,
    private readonly listOrdersUseCase: ListOrdersUseCase,
  ) {}

  createOrder(props: CreateOrderProps): Promise<Order> {
    return this.createOrderUseCase.execute(props);
  }

  updateOrder(input: UpdateOrderInput): Promise<Order> {
    return this.updateOrderUseCase.execute(input);
  }

  cancelOrder(orderID: string): Promise<Order> {
    return this.cancelOrderUseCase.execute(orderID);
  }

  getOrder(orderID: string): Promise<Order> {
    return this.getOrderUseCase.execute(orderID);
  }

  listOrders(filter?: OrderFilter): Promise<Order[]> {
    return this.listOrdersUseCase.execute(filter);
  }
}
