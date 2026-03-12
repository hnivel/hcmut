export interface Order {
  order_id: string;
  customer_id: string;
  driver_id?: string;
  restaurant_id: string;
  delivery_id: string;
  status:
    | 'IN_CART'
    | 'PLACED'
    | 'CONFIRMED'
    | 'PREPARING'
    | 'READY'
    | 'DELIVERING'
    | 'DELIVERED'
    | 'CANCELLED';
  customer_note?: string;
  delivery_fee?: number;
  ordered_at?: string;
  delivered_at?: string;
  restaurant_name?: string;
  delivery_address?: string;
  subtotal?: number;
  total?: number;
}

export interface OrderItem {
  order_id: string;
  restaurant_id: string;
  item_id: string;
  quantity: number;
  price?: number;
  note?: string;
  item_name?: string;
  item_image?: string;
}

export interface OrderPayment {
  order_payment_id: string;
  order_id: string;
  payment_method_id: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paid_at?: string;
  created_at: string;
}

export interface CreateOrderDto {
  restaurant_id: string;
  delivery_id: string;
  customer_note?: string;
  items: {
    item_id: string;
    quantity: number;
    note?: string;
  }[];
}

export interface UpdateOrderDto {
  status?: string;
  customer_note?: string;
  delivery_id?: string;
}

export interface AddOrderItemDto {
  item_id: string;
  restaurant_id: string;
  quantity: number;
  note?: string;
}

export interface UpdateOrderItemDto {
  quantity?: number;
  note?: string;
}

export interface OrderWithDetails extends Order {
  items?: OrderItem[];
  payment?: OrderPayment;
}

export interface OrderSearchParams {
  status?: string;
  customer_id?: string;
  restaurant_id?: string;
  driver_id?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
}
