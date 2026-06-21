import { Injectable } from '@nestjs/common';
import { OrderCreatedEvent } from '@shared-kernel/events/order-created.event';
import { KitchenTicket } from '../domain/entities/kitchen-ticket.entity';
import { UpdateTicketStatusInput } from './use-cases/update-ticket-status.use-case';
import { ProcessOrderEventUseCase } from './use-cases/process-order-event.use-case';
import { UpdateTicketStatusUseCase } from './use-cases/update-ticket-status.use-case';
import { GetKitchenQueueUseCase } from './use-cases/get-kitchen-queue.use-case';
import { GetTicketUseCase } from './use-cases/get-ticket.use-case';

@Injectable()
export class KitchenApplicationService {
  constructor(
    private readonly processOrderEventUseCase: ProcessOrderEventUseCase,
    private readonly updateTicketStatusUseCase: UpdateTicketStatusUseCase,
    private readonly getKitchenQueueUseCase: GetKitchenQueueUseCase,
    private readonly getTicketUseCase: GetTicketUseCase,
  ) { }

  processOrderEvent(event: OrderCreatedEvent): Promise<KitchenTicket> {
    return this.processOrderEventUseCase.execute(event);
  }

  updateTicketStatus(input: UpdateTicketStatusInput): Promise<KitchenTicket> {
    return this.updateTicketStatusUseCase.execute(input);
  }

  getQueue(): Promise<KitchenTicket[]> {
    return this.getKitchenQueueUseCase.execute();
  }

  getTicket(ticketID: string): Promise<KitchenTicket> {
    return this.getTicketUseCase.execute(ticketID);
  }
}
