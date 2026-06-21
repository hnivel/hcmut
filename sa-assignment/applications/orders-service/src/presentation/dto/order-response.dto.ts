import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Order } from '../../domain/entities/order.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';
import { OrderStatus } from '@shared-kernel/constants/order-status.enum';

export class OrderItemResponseDto {
  @ApiProperty()
  orderItemID!: string;

  @ApiProperty()
  menuItemID!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  quantity!: number;

  @ApiProperty()
  unitPrice!: number;

  @ApiProperty()
  subtotal!: number;

  @ApiPropertyOptional()
  notes?: string;

  @ApiProperty()
  category!: string;

  static from(item: OrderItem): OrderItemResponseDto {
    const dto = new OrderItemResponseDto();
    dto.orderItemID = item.orderItemID;
    dto.menuItemID = item.menuItemID;
    dto.name = item.name;
    dto.quantity = item.quantity;
    dto.unitPrice = item.unitPrice;
    dto.subtotal = item.subtotal;
    dto.notes = item.notes;
    dto.category = item.category;
    return dto;
  }
}

export class OrderResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  orderID!: string;

  @ApiProperty({ example: 'T05' })
  tableNumber!: string;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PENDING })
  status!: OrderStatus;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items!: OrderItemResponseDto[];

  @ApiProperty({ example: 170000 })
  totalPrice!: number;

  @ApiPropertyOptional({ example: 'Khách dị ứng đậu phộng' })
  allergyNotes?: string;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;

  static from(order: Order): OrderResponseDto {
    const dto = new OrderResponseDto();
    dto.orderID = order.orderID;
    dto.tableNumber = order.tableNumber;
    dto.status = order.status;
    dto.items = order.items.map(OrderItemResponseDto.from);
    dto.totalPrice = order.totalPrice;
    dto.allergyNotes = order.allergyNotes;
    dto.createdAt = order.createdAt.toISOString();
    dto.updatedAt = order.updatedAt.toISOString();
    return dto;
  }
}
