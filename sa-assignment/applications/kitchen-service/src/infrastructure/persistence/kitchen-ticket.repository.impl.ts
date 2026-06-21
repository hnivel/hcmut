import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { KitchenTicket } from '../../domain/entities/kitchen-ticket.entity';
import {
  IKitchenTicketRepository,
  KitchenTicketFilter,
} from '../../domain/repositories/kitchen-ticket.repository.interface';
import { TicketStatus } from '@shared-kernel/constants/ticket-status.enum';
import { KitchenTicketOrmEntity } from './kitchen-ticket.orm-entity';
import { KitchenTicketMapper } from './kitchen-ticket.mapper';

@Injectable()
export class KitchenTicketRepositoryImpl implements IKitchenTicketRepository {
  constructor(
    @InjectRepository(KitchenTicketOrmEntity)
    private readonly ormRepository: Repository<KitchenTicketOrmEntity>,
  ) {}

  async getByID(ticketID: string): Promise<KitchenTicket | null> {
    const orm = await this.ormRepository.findOne({ where: { ticketID } });
    return orm ? KitchenTicketMapper.toDomain(orm) : null;
  }

  async get(filter?: KitchenTicketFilter): Promise<KitchenTicket[]> {
    const where: Partial<KitchenTicketOrmEntity> = {};
    if (filter?.status) where.status = filter.status;
    if (filter?.orderID) where.orderID = filter.orderID;

    const orms = await this.ormRepository.find({
      where,
      order: { createdAt: 'ASC' },
    });

    return orms.map(KitchenTicketMapper.toDomain);
  }

  async put(ticket: KitchenTicket): Promise<KitchenTicket> {
    const orm = KitchenTicketMapper.toOrm(ticket);
    const saved = await this.ormRepository.save(orm);
    return KitchenTicketMapper.toDomain(saved);
  }

  async delete(ticketID: string): Promise<void> {
    await this.ormRepository.delete({ ticketID });
  }

  async getByOrderID(orderID: string): Promise<KitchenTicket | null> {
    const orm = await this.ormRepository.findOne({ where: { orderID } });
    return orm ? KitchenTicketMapper.toDomain(orm) : null;
  }

    async getQueue(): Promise<KitchenTicket[]> {
    const orms = await this.ormRepository.find({
      where: { status: In([TicketStatus.PENDING, TicketStatus.IN_PROGRESS]) },
      order: { createdAt: 'ASC' },
    });
    return orms.map(KitchenTicketMapper.toDomain);
  }
}
