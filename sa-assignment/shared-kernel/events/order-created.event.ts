export interface OrderItemPayload {
  menuItemID: string;
  name: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
  category: string;
}

export interface OrderCreatedEvent {
  orderID: string;
  tableNumber: string;
  items: OrderItemPayload[];
  allergyNotes?: string;
  createdAt: string;
}
