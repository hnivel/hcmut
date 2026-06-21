import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
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

export class UpdateOrderItemDto {
  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsOptional()
  menuItemID?: string;

  @ApiPropertyOptional({ example: 'Bún bò Huế' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional({ example: 75000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  unitPrice?: number;

  @ApiPropertyOptional({ example: 'Ít cay' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ example: 'COLD' })
  @IsString()
  @IsOptional()
  category?: string;
}

export class UpdateOrderDto {
  @ApiPropertyOptional({ example: 'T12', description: 'Reassign table number' })
  @IsString()
  @IsOptional()
  allergyNotes?: string;

  @ApiPropertyOptional({
    description: 'New items to add to the order (only allowed when status is PENDING)',
    type: [UpdateOrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  @IsOptional()
  addItems?: UpdateOrderItemDto[];

  @ApiPropertyOptional({
    description: 'OrderItem IDs to remove from the order',
    example: ['uuid-1', 'uuid-2'],
  })
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  removeItemIDs?: string[];
}
