import { v4 as uuidv4 } from 'uuid';

export interface CreateOrderItemProps {
  menuItemID: string;
  name: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
  category?: string;
}

export class OrderItem {
  private constructor(
    public readonly orderItemID: string,
    public readonly menuItemID: string,
    public readonly name: string,
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly notes: string | undefined,
    public readonly category: string,
  ) {}

  static create(props: CreateOrderItemProps): OrderItem {
    if (props.quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }
    if (props.unitPrice < 0) {
      throw new Error('Unit price cannot be negative');
    }

    return new OrderItem(
      uuidv4(),
      props.menuItemID,
      props.name,
      props.quantity,
      props.unitPrice,
      props.notes,
      props.category ?? 'GENERAL',
    );
  }

    static reconstitute(
    orderItemID: string,
    menuItemID: string,
    name: string,
    quantity: number,
    unitPrice: number,
    notes: string | undefined,
    category: string,
  ): OrderItem {
    return new OrderItem(orderItemID, menuItemID, name, quantity, unitPrice, notes, category);
  }

  get subtotal(): number {
    return this.quantity * this.unitPrice;
  }
}
