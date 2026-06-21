import { KitchenTicket } from '../../domain/entities/kitchen-ticket.entity';
import { TicketItem } from '../../domain/entities/ticket-item.entity';
import { KitchenTicketOrmEntity, TicketItemOrmEntity } from './kitchen-ticket.orm-entity';

export class KitchenTicketMapper {
  static toDomain(orm: KitchenTicketOrmEntity): KitchenTicket {
    const items = (orm.items ?? []).map((itemOrm) =>
      TicketItem.reconstitute(
        itemOrm.ticketItemID,
        itemOrm.menuItemID,
        itemOrm.name,
        itemOrm.quantity,
        itemOrm.notes,
        itemOrm.category,
      ),
    );

    return KitchenTicket.reconstitute(
      orm.ticketID,
      orm.orderID,
      orm.tableNumber,
      items,
      orm.status,
      orm.station,
      orm.allergyNotes,
      orm.createdAt,
      orm.startedAt,
      orm.readyAt,
    );
  }

  static toOrm(domain: KitchenTicket): KitchenTicketOrmEntity {
    const orm = new KitchenTicketOrmEntity();
    orm.ticketID = domain.ticketID;
    orm.orderID = domain.orderID;
    orm.tableNumber = domain.tableNumber;
    orm.status = domain.status;
    orm.station = domain.station;
    orm.allergyNotes = domain.allergyNotes;
    orm.createdAt = domain.createdAt;
    orm.startedAt = domain.startedAt;
    orm.readyAt = domain.readyAt;

    orm.items = domain.items.map((item) => {
      const itemOrm = new TicketItemOrmEntity();
      itemOrm.ticketItemID = item.ticketItemID;
      itemOrm.menuItemID = item.menuItemID;
      itemOrm.name = item.name;
      itemOrm.quantity = item.quantity;
      itemOrm.notes = item.notes;
      itemOrm.category = item.category;
      itemOrm.ticket = orm;
      return itemOrm;
    });

    return orm;
  }
}
