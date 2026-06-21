import { Injectable } from '@nestjs/common';
import { StationCategory } from '@shared-kernel/constants/station-category.enum';
import { KitchenTicket } from '../entities/kitchen-ticket.entity';
import { TicketItem } from '../entities/ticket-item.entity';

@Injectable()
export class KitchenDomainService {
    resolveStation(items: TicketItem[]): StationCategory {
    const priorityMap: Record<string, number> = {
      [StationCategory.GRILL]: 5,
      [StationCategory.FRYING]: 4,
      [StationCategory.COLD]: 3,
      [StationCategory.BEVERAGE]: 2,
      [StationCategory.GENERAL]: 1,
    };

    return items.reduce<StationCategory>((dominant, item) => {
      const itemCategory = item.category as StationCategory;
      const currentPriority = priorityMap[dominant] ?? 0;
      const itemPriority = priorityMap[itemCategory] ?? 0;
      return itemPriority > currentPriority ? itemCategory : dominant;
    }, StationCategory.GENERAL);
  }

    assertTicketExists(
    ticket: KitchenTicket | null,
    ticketID: string,
  ): asserts ticket is KitchenTicket {
    if (!ticket) {
      throw new Error(`Kitchen ticket with ID "${ticketID}" not found`);
    }
  }
}
