import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from '@shared-kernel/interfaces/use-case.interface';
import { KitchenTicket } from '../../domain/entities/kitchen-ticket.entity';
import {
  IKitchenTicketRepository,
  KITCHEN_TICKET_REPOSITORY,
} from '../../domain/repositories/kitchen-ticket.repository.interface';
import { KitchenDomainService } from '../../domain/services/kitchen-domain.service';

@Injectable()
export class GetTicketUseCase implements IUseCase<string, KitchenTicket> {
  constructor(
    @Inject(KITCHEN_TICKET_REPOSITORY)
    private readonly kitchenTicketRepository: IKitchenTicketRepository,
    private readonly kitchenDomainService: KitchenDomainService,
  ) {}

  async execute(ticketID: string): Promise<KitchenTicket> {
    const ticket = await this.kitchenTicketRepository.getByID(ticketID);

    try {
      this.kitchenDomainService.assertTicketExists(ticket, ticketID);
    } catch (err: unknown) {
      throw new NotFoundException((err as Error).message);
    }

    return ticket!;
  }
}
