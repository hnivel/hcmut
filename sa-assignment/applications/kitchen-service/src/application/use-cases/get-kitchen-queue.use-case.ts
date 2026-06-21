import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from '@shared-kernel/interfaces/use-case.interface';
import { KitchenTicket } from '../../domain/entities/kitchen-ticket.entity';
import {
  IKitchenTicketRepository,
  KITCHEN_TICKET_REPOSITORY,
} from '../../domain/repositories/kitchen-ticket.repository.interface';
import { TicketStatus } from '@shared-kernel/constants/ticket-status.enum';

@Injectable()
export class GetKitchenQueueUseCase implements IUseCase<void, KitchenTicket[]> {
  constructor(
    @Inject(KITCHEN_TICKET_REPOSITORY)
    private readonly kitchenTicketRepository: IKitchenTicketRepository,
  ) {}

  async execute(): Promise<KitchenTicket[]> {
    const [pending, inProgress] = await Promise.all([
      this.kitchenTicketRepository.get({ status: TicketStatus.PENDING }),
      this.kitchenTicketRepository.get({ status: TicketStatus.IN_PROGRESS }),
    ]);

    return [...pending, ...inProgress].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );
  }
}
