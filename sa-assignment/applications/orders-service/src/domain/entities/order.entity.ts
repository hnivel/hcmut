import { v4 as uuidv4 } from 'uuid';
import { OrderStatus } from '@shared-kernel/constants/order-status.enum';
import { OrderItem, CreateOrderItemProps } from './order-item.entity';

export interface CreateOrderProps {
  tableNumber: string;
  items: CreateOrderItemProps[];
  allergyNotes?: string;
}

export class Order {
  private constructor(
    public readonly orderID: string,
    public tableNumber: string,
    private _items: OrderItem[],
    private _status: OrderStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public allergyNotes: string | undefined,
  ) {}

  // ──────────────────────────────────────────────
  // Factory methods
  // ──────────────────────────────────────────────

  static create(props: CreateOrderProps): Order {
    if (!props.tableNumber?.trim()) {
      throw new Error('Table number is required');
    }
    if (!props.items || props.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    const now = new Date();
    const items = props.items.map((item) => OrderItem.create(item));

    return new Order(
      uuidv4(),
      props.tableNumber.trim(),
      items,
      OrderStatus.PENDING,
      now,
      now,
      props.allergyNotes,
    );
  }

    static reconstitute(
    orderID: string,
    tableNumber: string,
    items: OrderItem[],
    status: OrderStatus,
    createdAt: Date,
    updatedAt: Date,
    allergyNotes: string | undefined,
  ): Order {
    return new Order(orderID, tableNumber, items, status, createdAt, updatedAt, allergyNotes);
  }

  // ──────────────────────────────────────────────
  // Read-only accessors
  // ──────────────────────────────────────────────

  get items(): ReadonlyArray<OrderItem> {
    return this._items;
  }

  get status(): OrderStatus {
    return this._status;
  }

  get totalPrice(): number {
    return this._items.reduce((sum, item) => sum + item.subtotal, 0);
  }

  // ──────────────────────────────────────────────
  // State transitions
  // ──────────────────────────────────────────────

  confirm(): void {
    this.assertStatus([OrderStatus.PENDING], 'confirm');
    this._status = OrderStatus.CONFIRMED;
    this.updatedAt = new Date();
  }

  markInProgress(): void {
    this.assertStatus([OrderStatus.CONFIRMED], 'mark in-progress');
    this._status = OrderStatus.IN_PROGRESS;
    this.updatedAt = new Date();
  }

  complete(): void {
    this.assertStatus([OrderStatus.IN_PROGRESS, OrderStatus.CONFIRMED], 'complete');
    this._status = OrderStatus.COMPLETED;
    this.updatedAt = new Date();
  }

  cancel(): void {
    if (this._status === OrderStatus.COMPLETED) {
      throw new Error('Cannot cancel a completed order');
    }
    if (this._status === OrderStatus.CANCELLED) {
      throw new Error('Order is already cancelled');
    }
    this._status = OrderStatus.CANCELLED;
    this.updatedAt = new Date();
  }

  // ──────────────────────────────────────────────
  // Item mutations (only allowed when PENDING)
  // ──────────────────────────────────────────────

  addItem(itemProps: CreateOrderItemProps): void {
    this.assertStatus([OrderStatus.PENDING], 'add items to');
    this._items.push(OrderItem.create(itemProps));
    this.updatedAt = new Date();
  }

  removeItem(orderItemID: string): void {
    this.assertStatus([OrderStatus.PENDING], 'remove items from');
    const index = this._items.findIndex((i) => i.orderItemID === orderItemID);
    if (index === -1) {
      throw new Error(`Item with ID "${orderItemID}" not found in this order`);
    }
    this._items.splice(index, 1);
    this.updatedAt = new Date();
  }

  updateAllergyNotes(notes: string): void {
    this.assertStatus([OrderStatus.PENDING], 'update allergy notes on');
    this.allergyNotes = notes;
    this.updatedAt = new Date();
  }

  // ──────────────────────────────────────────────
  // Private helpers
  // ──────────────────────────────────────────────

  private assertStatus(allowed: OrderStatus[], action: string): void {
    if (!allowed.includes(this._status)) {
      throw new Error(
        `Cannot ${action} an order with status "${this._status}". ` +
          `Allowed statuses: ${allowed.join(', ')}`,
      );
    }
  }
}
