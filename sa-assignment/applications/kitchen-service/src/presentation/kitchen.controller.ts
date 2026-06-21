import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TicketStatus } from '@shared-kernel/constants/ticket-status.enum';
import { KitchenApplicationService } from '../application/kitchen-application.service';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { KitchenTicketResponseDto } from './dto/kitchen-ticket-response.dto';

@ApiTags('kitchen')
@Controller('kitchen')
export class KitchenController {
  constructor(private readonly kitchenApplicationService: KitchenApplicationService) { }

  @Get('queue')
  @ApiOperation({
    summary: 'Get the active KDS queue (PENDING + IN_PROGRESS tickets, sorted oldest first)',
  })
  @ApiResponse({ status: 200, type: [KitchenTicketResponseDto] })
  async getQueue(): Promise<KitchenTicketResponseDto[]> {
    const tickets = await this.kitchenApplicationService.getQueue();
    return tickets.map(KitchenTicketResponseDto.from);
  }

  @Get('tickets')
  @ApiOperation({ summary: 'List kitchen tickets with optional status filter' })
  @ApiQuery({ name: 'status', enum: TicketStatus, required: false })
  @ApiResponse({ status: 200, type: [KitchenTicketResponseDto] })
  async get(
    @Query('status') status?: TicketStatus,
  ): Promise<KitchenTicketResponseDto[]> {
    const tickets = await this.kitchenApplicationService.getQueue();
    const filtered = status ? tickets.filter((t) => t.status === status) : tickets;
    return filtered.map(KitchenTicketResponseDto.from);
  }

  @Get('tickets/:ticketID')
  @ApiOperation({ summary: 'Get a single kitchen ticket by ID' })
  @ApiParam({ name: 'ticketID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: KitchenTicketResponseDto })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async getByID(
    @Param('ticketID', ParseUUIDPipe) ticketID: string,
  ): Promise<KitchenTicketResponseDto> {
    const ticket = await this.kitchenApplicationService.getTicket(ticketID);
    return KitchenTicketResponseDto.from(ticket);
  }

  @Patch('tickets/:ticketID/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update kitchen ticket status - PENDING -> IN_PROGRESS -> READY',
  })
  @ApiParam({ name: 'ticketID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: KitchenTicketResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async patch(
    @Param('ticketID', ParseUUIDPipe) ticketID: string,
    @Body() dto: UpdateTicketStatusDto,
  ): Promise<KitchenTicketResponseDto> {
    const ticket = await this.kitchenApplicationService.updateTicketStatus({
      ticketID,
      newStatus: dto.status,
    });
    return KitchenTicketResponseDto.from(ticket);
  }
}
