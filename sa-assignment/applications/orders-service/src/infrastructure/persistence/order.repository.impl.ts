import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../domain/entities/order.entity';
import {
  IOrderRepository,
  OrderFilter,
} from '../../domain/repositories/order.repository.interface';
import { OrderStatus } from '@shared-kernel/constants/order-status.enum';
import { OrderOrmEntity } from './order.orm-entity';
import { OrderMapper } from './order.mapper';

@Injectable()
export class OrderRepositoryImpl implements IOrderRepository {
  constructor(
    @InjectRepository(OrderOrmEntity)
    private readonly ormRepository: Repository<OrderOrmEntity>,
  ) {}

  async getByID(orderID: string): Promise<Order | null> {
    const orm = await this.ormRepository.findOne({ where: { orderID } });
    return orm ? OrderMapper.toDomain(orm) : null;
  }

  async get(filter?: OrderFilter): Promise<Order[]> {
    const where: Partial<OrderOrmEntity> = {};
    if (filter?.status) where.status = filter.status;
    if (filter?.tableNumber) where.tableNumber = filter.tableNumber;

    const orms = await this.ormRepository.find({ where });
    return orms.map(OrderMapper.toDomain);
  }

  async put(order: Order): Promise<Order> {
    const orm = OrderMapper.toOrm(order);
    const saved = await this.ormRepository.save(orm);
    return OrderMapper.toDomain(saved);
  }

  async delete(orderID: string): Promise<void> {
    await this.ormRepository.delete({ orderID });
  }

  async getByStatus(status: OrderStatus): Promise<Order[]> {
    return this.get({ status });
  }

  async getByTableNumber(tableNumber: string): Promise<Order[]> {
    return this.get({ tableNumber });
  }
}
