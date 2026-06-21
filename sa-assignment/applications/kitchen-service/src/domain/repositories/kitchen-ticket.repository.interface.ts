import { IRepository } from '@shared-kernel/interfaces/repository.interface';
import { TicketStatus } from '@shared-kernel/constants/ticket-status.enum';
import { KitchenTicket } from '../entities/kitchen-ticket.entity';

export interface KitchenTicketFilter {
  status?: TicketStatus;
  orderID?: string;
}

export interface IKitchenTicketRepository extends IRepository<KitchenTicket> {
  get(filter?: KitchenTicketFilter): Promise<KitchenTicket[]>;
  getByOrderID(orderID: string): Promise<KitchenTicket | null>;
  getQueue(): Promise<KitchenTicket[]>;
}

export const KITCHEN_TICKET_REPOSITORY = Symbol('IKitchenTicketRepository');
