import { IRepository } from '@shared-kernel/interfaces/repository.interface';
import { OrderStatus } from '@shared-kernel/constants/order-status.enum';
import { Order } from '../entities/order.entity';

export interface OrderFilter {
  status?: OrderStatus;
  tableNumber?: string;
}

export interface IOrderRepository extends IRepository<Order> {
  get(filter?: OrderFilter): Promise<Order[]>;
  getByStatus(status: OrderStatus): Promise<Order[]>;
  getByTableNumber(tableNumber: string): Promise<Order[]>;
}

export const ORDER_REPOSITORY = Symbol('IOrderRepository');
