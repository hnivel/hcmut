export interface CreateTicketItemProps {
  menuItemID: string;
  name: string;
  quantity: number;
  notes?: string;
  category: string;
}

export class TicketItem {
  private constructor(
    public readonly ticketItemID: string,
    public readonly menuItemID: string,
    public readonly name: string,
    public readonly quantity: number,
    public readonly notes: string | undefined,
    public readonly category: string,
  ) {}

  static create(id: string, props: CreateTicketItemProps): TicketItem {
    return new TicketItem(id, props.menuItemID, props.name, props.quantity, props.notes, props.category);
  }

  static reconstitute(
    ticketItemID: string,
    menuItemID: string,
    name: string,
    quantity: number,
    notes: string | undefined,
    category: string,
  ): TicketItem {
    return new TicketItem(ticketItemID, menuItemID, name, quantity, notes, category);
  }
}
