import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { IUseCase } from '@shared-kernel/interfaces/use-case.interface';
import { TicketStatus } from '@shared-kernel/constants/ticket-status.enum';
import { KitchenTicket } from '../../domain/entities/kitchen-ticket.entity';
import {
  IKitchenTicketRepository,
  KITCHEN_TICKET_REPOSITORY,
} from '../../domain/repositories/kitchen-ticket.repository.interface';
import { KitchenDomainService } from '../../domain/services/kitchen-domain.service';

export interface UpdateTicketStatusInput {
  ticketID: string;
  newStatus: TicketStatus;
}

const ALLOWED_TRANSITIONS: Record<string, TicketStatus[]> = {
  [TicketStatus.PENDING]: [TicketStatus.IN_PROGRESS],
  [TicketStatus.IN_PROGRESS]: [TicketStatus.READY],
  [TicketStatus.READY]: [],
};

@Injectable()
export class UpdateTicketStatusUseCase
  implements IUseCase<UpdateTicketStatusInput, KitchenTicket>
{
  constructor(
    @Inject(KITCHEN_TICKET_REPOSITORY)
    private readonly kitchenTicketRepository: IKitchenTicketRepository,
    private readonly kitchenDomainService: KitchenDomainService,
  ) {}

  async execute(input: UpdateTicketStatusInput): Promise<KitchenTicket> {
    const ticket = await this.kitchenTicketRepository.getByID(input.ticketID);

    try {
      this.kitchenDomainService.assertTicketExists(ticket, input.ticketID);
    } catch (err: unknown) {
      throw new NotFoundException((err as Error).message);
    }

    const allowedNext = ALLOWED_TRANSITIONS[ticket!.status] ?? [];
    if (!allowedNext.includes(input.newStatus)) {
      throw new BadRequestException(
        `Cannot transition ticket from "${ticket!.status}" to "${input.newStatus}". ` +
          `Allowed next statuses: ${allowedNext.join(', ') || 'none'}`,
      );
    }

    try {
      if (input.newStatus === TicketStatus.IN_PROGRESS) {
        ticket!.start();
      } else if (input.newStatus === TicketStatus.READY) {
        ticket!.markReady();
      }
    } catch (err: unknown) {
      throw new BadRequestException((err as Error).message);
    }

    return this.kitchenTicketRepository.put(ticket!);
  }
}
