import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';
import { OrderCreatedEvent } from '@shared-kernel/events/order-created.event';
import { OrderCancelledEvent } from '@shared-kernel/events/order-cancelled.event';
import { KitchenApplicationService } from '../../application/kitchen-application.service';

@Controller()
export class OrderEventSubscriber {
  private readonly logger = new Logger(OrderEventSubscriber.name);

  constructor(private readonly kitchenApplicationService: KitchenApplicationService) { }

  @EventPattern('orders.created')
  async handleOrderCreated(
    @Payload() event: OrderCreatedEvent,
    @Ctx() context: KafkaContext,
  ): Promise<void> {
    const message = context.getMessage();
    this.logger.log(
      `[orders.created] Received event for orderID=${event.orderID}, ` +
      `table=${event.tableNumber}, offset=${message.offset}`,
    );

    try {
      const ticket = await this.kitchenApplicationService.processOrderEvent(event);
      this.logger.log(
        `[orders.created] Created KitchenTicket ticketID=${ticket.ticketID} ` +
        `station=${ticket.station}`,
      );
    } catch (err: unknown) {
      this.logger.error(
        `[orders.created] Failed to process event for orderID=${event.orderID}`,
        (err as Error).stack,
      );
      throw err;
    }
  }

  @EventPattern('orders.cancelled')
  async handleOrderCancelled(
    @Payload() event: OrderCancelledEvent,
    @Ctx() context: KafkaContext,
  ): Promise<void> {
    const message = context.getMessage();
    this.logger.log(
      `[orders.cancelled] Order cancelled: orderID=${event.orderID}, ` +
      `offset=${message.offset}`,
    );
  }
}
