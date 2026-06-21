import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from '@shared-kernel/interfaces/use-case.interface';
import { OrderCreatedEvent } from '@shared-kernel/events/order-created.event';
import { KitchenTicket } from '../../domain/entities/kitchen-ticket.entity';
import {
  IKitchenTicketRepository,
  KITCHEN_TICKET_REPOSITORY,
} from '../../domain/repositories/kitchen-ticket.repository.interface';
import { KitchenDomainService } from '../../domain/services/kitchen-domain.service';
import { TicketItem } from '../../domain/entities/ticket-item.entity';
import { StationCategory } from '@shared-kernel/constants/station-category.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProcessOrderEventUseCase implements IUseCase<OrderCreatedEvent, KitchenTicket> {
  constructor(
    @Inject(KITCHEN_TICKET_REPOSITORY)
    private readonly kitchenTicketRepository: IKitchenTicketRepository,
    private readonly kitchenDomainService: KitchenDomainService,
  ) {}

  async execute(event: OrderCreatedEvent): Promise<KitchenTicket> {
    const ticketItems: TicketItem[] = event.items.map((item) =>
      TicketItem.create(uuidv4(), {
        menuItemID: item.menuItemID,
        name: item.name,
        quantity: item.quantity,
        notes: item.notes,
        category: item.category,
      }),
    );

    const station = this.kitchenDomainService.resolveStation(ticketItems);

    const ticket = KitchenTicket.create({
      orderID: event.orderID,
      tableNumber: event.tableNumber,
      items: event.items.map((item) => ({
        menuItemID: item.menuItemID,
        name: item.name,
        quantity: item.quantity,
        notes: item.notes,
        category: item.category as StationCategory,
      })),
      station,
      allergyNotes: event.allergyNotes,
    });

    return this.kitchenTicketRepository.put(ticket);
  }
}
