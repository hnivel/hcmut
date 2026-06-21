import { Order } from '../../domain/entities/order.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';
import { OrderOrmEntity, OrderItemOrmEntity } from './order.orm-entity';

export class OrderMapper {
  static toDomain(orm: OrderOrmEntity): Order {
    const items = (orm.items ?? []).map((itemOrm) =>
      OrderItem.reconstitute(
        itemOrm.orderItemID,
        itemOrm.menuItemID,
        itemOrm.name,
        itemOrm.quantity,
        Number(itemOrm.unitPrice),
        itemOrm.notes,
        itemOrm.category,
      ),
    );

    return Order.reconstitute(
      orm.orderID,
      orm.tableNumber,
      items,
      orm.status,
      orm.createdAt,
      orm.updatedAt,
      orm.allergyNotes,
    );
  }

  static toOrm(domain: Order): OrderOrmEntity {
    const orm = new OrderOrmEntity();
    orm.orderID = domain.orderID;
    orm.tableNumber = domain.tableNumber;
    orm.status = domain.status;
    orm.allergyNotes = domain.allergyNotes;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;

    orm.items = domain.items.map((item) => {
      const itemOrm = new OrderItemOrmEntity();
      itemOrm.orderItemID = item.orderItemID;
      itemOrm.menuItemID = item.menuItemID;
      itemOrm.name = item.name;
      itemOrm.quantity = item.quantity;
      itemOrm.unitPrice = item.unitPrice;
      itemOrm.notes = item.notes;
      itemOrm.category = item.category;
      itemOrm.order = orm;
      return itemOrm;
    });

    return orm;
  }
}
