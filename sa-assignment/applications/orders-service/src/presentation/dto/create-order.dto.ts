import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Menu item UUID' })
  @IsUUID()
  menuItemID!: string;

  @ApiProperty({ example: 'Phở bò tái', description: 'Item name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 2, description: 'Quantity (must be ≥ 1)' })
  @IsNumber()
  @IsPositive()
  quantity!: number;

  @ApiProperty({ example: 85000, description: 'Unit price in VND' })
  @IsNumber()
  @Min(0)
  unitPrice!: number;

  @ApiPropertyOptional({ example: 'Không hành', description: 'Special instructions for this item' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    example: 'GRILL',
    description: 'Kitchen station category',
    enum: ['GRILL', 'FRYING', 'COLD', 'BEVERAGE', 'GENERAL'],
  })
  @IsString()
  @IsOptional()
  category?: string;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'T05', description: 'Table number' })
  @IsString()
  @IsNotEmpty()
  tableNumber!: string;

  @ApiProperty({ type: [CreateOrderItemDto], description: 'List of ordered items' })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];

  @ApiPropertyOptional({
    example: 'Khách dị ứng đậu phộng',
    description: 'Allergy or special dietary notes for the entire order',
  })
  @IsString()
  @IsOptional()
  allergyNotes?: string;
}
