import { Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { IUseCase } from '@shared-kernel/interfaces/use-case.interface';
import { Order } from '../../domain/entities/order.entity';
import { CreateOrderItemProps } from '../../domain/entities/order-item.entity';
import {
  IOrderRepository,
  ORDER_REPOSITORY,
} from '../../domain/repositories/order.repository.interface';
import { OrderDomainService } from '../../domain/services/order-domain.service';

export interface UpdateOrderInput {
  orderID: string;
  tableNumber?: string;
  allergyNotes?: string;
  addItems?: CreateOrderItemProps[];
  removeItemIDs?: string[];
}

@Injectable()
export class UpdateOrderUseCase implements IUseCase<UpdateOrderInput, Order> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    private readonly orderDomainService: OrderDomainService,
  ) {}

  async execute(input: UpdateOrderInput): Promise<Order> {
    const order = await this.orderRepository.getByID(input.orderID);

    try {
      this.orderDomainService.assertOrderExists(order, input.orderID);
    } catch (err: unknown) {
      throw new NotFoundException((err as Error).message);
    }

    try {
      if (input.allergyNotes !== undefined) {
        order!.updateAllergyNotes(input.allergyNotes);
      }
      if (input.addItems?.length) {
        input.addItems.forEach((item) => order!.addItem(item));
      }
      if (input.removeItemIDs?.length) {
        input.removeItemIDs.forEach((id) => order!.removeItem(id));
      }
    } catch (err: unknown) {
      throw new BadRequestException((err as Error).message);
    }

    return this.orderRepository.put(order!);
  }
}
