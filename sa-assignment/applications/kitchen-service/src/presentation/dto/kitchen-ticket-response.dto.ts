import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { KitchenTicket } from '../../domain/entities/kitchen-ticket.entity';
import { TicketItem } from '../../domain/entities/ticket-item.entity';
import { TicketStatus } from '@shared-kernel/constants/ticket-status.enum';
import { StationCategory } from '@shared-kernel/constants/station-category.enum';

export class TicketItemResponseDto {
  @ApiProperty()
  ticketItemID!: string;

  @ApiProperty()
  menuItemID!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  quantity!: number;

  @ApiPropertyOptional()
  notes?: string;

  @ApiProperty()
  category!: string;

  static from(item: TicketItem): TicketItemResponseDto {
    const dto = new TicketItemResponseDto();
    dto.ticketItemID = item.ticketItemID;
    dto.menuItemID = item.menuItemID;
    dto.name = item.name;
    dto.quantity = item.quantity;
    dto.notes = item.notes;
    dto.category = item.category;
    return dto;
  }
}

export class KitchenTicketResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  ticketID!: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  orderID!: string;

  @ApiProperty({ example: 'T05' })
  tableNumber!: string;

  @ApiProperty({ enum: TicketStatus, example: TicketStatus.PENDING })
  status!: TicketStatus;

  @ApiProperty({ enum: StationCategory, example: StationCategory.GRILL })
  station!: StationCategory;

  @ApiProperty({ type: [TicketItemResponseDto] })
  items!: TicketItemResponseDto[];

  @ApiPropertyOptional({ example: 'Khách dị ứng đậu phộng' })
  allergyNotes?: string;

  @ApiProperty()
  createdAt!: string;

  @ApiPropertyOptional()
  startedAt?: string;

  @ApiPropertyOptional()
  readyAt?: string;

  static from(ticket: KitchenTicket): KitchenTicketResponseDto {
    const dto = new KitchenTicketResponseDto();
    dto.ticketID = ticket.ticketID;
    dto.orderID = ticket.orderID;
    dto.tableNumber = ticket.tableNumber;
    dto.status = ticket.status;
    dto.station = ticket.station;
    dto.items = ticket.items.map(TicketItemResponseDto.from);
    dto.allergyNotes = ticket.allergyNotes;
    dto.createdAt = ticket.createdAt.toISOString();
    dto.startedAt = ticket.startedAt?.toISOString();
    dto.readyAt = ticket.readyAt?.toISOString();
    return dto;
  }
}
