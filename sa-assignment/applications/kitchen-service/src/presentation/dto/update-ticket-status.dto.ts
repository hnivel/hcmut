import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TicketStatus } from '@shared-kernel/constants/ticket-status.enum';

export class UpdateTicketStatusDto {
  @ApiProperty({
    enum: TicketStatus,
    example: TicketStatus.IN_PROGRESS,
    description: 'New status. Allowed transitions: PENDING → IN_PROGRESS → READY',
  })
  @IsEnum(TicketStatus)
  @IsNotEmpty()
  status!: TicketStatus;
}
