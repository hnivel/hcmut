import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrderStatus } from '@shared-kernel/constants/order-status.enum';
import { OrderApplicationService } from '../application/order-application.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderApplicationService: OrderApplicationService) {}

  // ──────────────────────────────────────────────
  // POST /orders
  // ──────────────────────────────────────────────

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, type: OrderResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async post(@Body() dto: CreateOrderDto): Promise<OrderResponseDto> {
    const order = await this.orderApplicationService.createOrder({
      tableNumber: dto.tableNumber,
      items: dto.items.map((item) => ({
        menuItemID: item.menuItemID,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        notes: item.notes,
        category: item.category,
      })),
      allergyNotes: dto.allergyNotes,
    });

    return OrderResponseDto.from(order);
  }

  // ──────────────────────────────────────────────
  // GET /orders
  // ──────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'List all orders with optional filters' })
  @ApiQuery({ name: 'status', enum: OrderStatus, required: false })
  @ApiQuery({ name: 'tableNumber', type: String, required: false })
  @ApiResponse({ status: 200, type: [OrderResponseDto] })
  async get(
    @Query('status') status?: OrderStatus,
    @Query('tableNumber') tableNumber?: string,
  ): Promise<OrderResponseDto[]> {
    const orders = await this.orderApplicationService.listOrders({
      status,
      tableNumber,
    });
    return orders.map(OrderResponseDto.from);
  }

  // ──────────────────────────────────────────────
  // GET /orders/:orderID
  // ──────────────────────────────────────────────

  @Get(':orderID')
  @ApiOperation({ summary: 'Get a single order by ID' })
  @ApiParam({ name: 'orderID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getByID(
    @Param('orderID', ParseUUIDPipe) orderID: string,
  ): Promise<OrderResponseDto> {
    const order = await this.orderApplicationService.getOrder(orderID);
    return OrderResponseDto.from(order);
  }

  // ──────────────────────────────────────────────
  // PATCH /orders/:orderID
  // ──────────────────────────────────────────────

  @Patch(':orderID')
  @ApiOperation({ summary: 'Update order: allergy notes and item mutations (PENDING only)' })
  @ApiParam({ name: 'orderID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  @ApiResponse({ status: 400, description: 'Order cannot be updated in current status' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async patch(
    @Param('orderID', ParseUUIDPipe) orderID: string,
    @Body() dto: UpdateOrderDto,
  ): Promise<OrderResponseDto> {
    const order = await this.orderApplicationService.updateOrder({
      orderID,
      allergyNotes: dto.allergyNotes,
      addItems: dto.addItems?.map((item) => ({
        menuItemID: item.menuItemID ?? '',
        name: item.name ?? '',
        quantity: item.quantity ?? 1,
        unitPrice: item.unitPrice ?? 0,
        notes: item.notes,
        category: item.category,
      })),
      removeItemIDs: dto.removeItemIDs,
    });

    return OrderResponseDto.from(order);
  }

  // ──────────────────────────────────────────────
  // DELETE /orders/:orderID
  // ──────────────────────────────────────────────

  @Delete(':orderID')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel an order (soft-cancel via status change)' })
  @ApiParam({ name: 'orderID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  @ApiResponse({ status: 400, description: 'Order cannot be cancelled in current status' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async delete(
    @Param('orderID', ParseUUIDPipe) orderID: string,
  ): Promise<OrderResponseDto> {
    const order = await this.orderApplicationService.cancelOrder(orderID);
    return OrderResponseDto.from(order);
  }
}
