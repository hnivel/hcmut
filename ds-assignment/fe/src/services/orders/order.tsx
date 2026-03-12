import api from '../api';
import { mockOrderDetails } from '@/lib/mockData';
import type {
  Order,
  OrderItem,
  OrderWithDetails,
  CreateOrderDto,
  UpdateOrderDto,
  AddOrderItemDto,
  UpdateOrderItemDto,
  OrderSearchParams,
} from './order.interface';

// Mock cart storage
const CART_STORAGE_KEY = 'mockCart';

const getMockCart = (): OrderWithDetails | null => {
  const cartData = localStorage.getItem(CART_STORAGE_KEY);
  return cartData ? JSON.parse(cartData) : null;
};

const saveMockCart = (cart: OrderWithDetails) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

const clearMockCart = () => {
  localStorage.removeItem(CART_STORAGE_KEY);
};

export const orderService = {
  // Update order status (owner action)
  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await api.put(`/orders/${orderId}`, { status });
    return response.data;
  },
  // Get orders for a restaurant (owner only)
  getOrdersForRestaurant: async (restaurantId: string) => {
    const response = await api.get(`/orders/restaurant/${restaurantId}`);
    return response.data;
  },
  // Get all orders with filters
  getOrders: async (params?: OrderSearchParams) => {
    const response = await api.get('/orders', { params });
    // Extract paginated data array
    return response.data?.data || [];
  },

  // Get order by ID with full details
  getOrderById: async (orderId: string) => {
    try {
      const response = await api.get<OrderWithDetails>(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      // Return mock data if API fails
      console.log('API not available, using mock order data');
      const mockOrder = mockOrderDetails.find(
        (order) => order.order_id === orderId,
      );
      if (mockOrder) {
        return mockOrder;
      }
      throw new Error('Order not found');
    }
  },

  // Get current user's orders
  getMyOrders: async (status?: string) => {
    const response = await api.get<Order[]>('/orders/my-orders', {
      params: { status },
    });
    return response.data;
  },

  // Get current cart (order with IN_CART status)
  getCart: async () => {
    try {
      const response = await api.get<OrderWithDetails>('/orders/cart');
      return response.data;
    } catch (error) {
      // Return mock cart if API fails
      console.log('API not available, using mock cart');
      return getMockCart();
    }
  },

  // Create a new order
  createOrder: async (data: CreateOrderDto) => {
    const response = await api.post<Order>('/orders', data);
    return response.data;
  },

  // Update order
  updateOrder: async (orderId: string, data: UpdateOrderDto) => {
    const response = await api.put<Order>(`/orders/${orderId}`, data);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId: string, reason?: string) => {
    const response = await api.post(`/orders/${orderId}/cancel`, { reason });
    return response.data;
  },

  // Add item to cart
  addToCart: async (
    data: AddOrderItemDto & {
      item_name?: string;
      item_price?: number;
      item_image?: string;
    },
  ) => {
    try {
      const response = await api.post<OrderItem>('/orders/cart/items', data);
      return response.data;
    } catch (error) {
      // Use mock cart if API fails
      console.log('API not available, using mock cart');
      let cart = getMockCart();

      if (!cart) {
        cart = {
          order_id: 'mock-order-' + Date.now(),
          customer_id: 'mock-user',
          restaurant_id: data.restaurant_id,
          delivery_id: '',
          status: 'IN_CART' as const,
          restaurant_name: 'Restaurant',
          delivery_address: '',
          subtotal: 0,
          total: 0,
          delivery_fee: 15000,
          items: [],
        };
      }

      // Check if item already exists in cart
      const existingItemIndex = (cart.items || []).findIndex(
        (item) => item.item_id === data.item_id,
      );

      if (existingItemIndex >= 0 && cart.items) {
        // Update quantity
        cart.items[existingItemIndex].quantity += data.quantity;
      } else {
        // Add new item
        const newItem: OrderItem = {
          item_id: data.item_id,
          order_id: cart.order_id,
          restaurant_id: data.restaurant_id,
          item_name: data.item_name || 'Menu Item',
          quantity: data.quantity,
          price: data.item_price || 0,
          note: data.note,
          item_image: data.item_image,
        };
        if (!cart.items) cart.items = [];
        cart.items.push(newItem);
      }

      // Recalculate total
      cart.subtotal = (cart.items || []).reduce(
        (sum, item) => sum + (item.price || 0) * item.quantity,
        0,
      );
      cart.total = cart.subtotal + (cart.delivery_fee || 0);

      saveMockCart(cart);
      return cart.items[cart.items.length - 1];
    }
  },

  // Update cart item
  updateCartItem: async (itemId: string, data: UpdateOrderItemDto) => {
    try {
      const response = await api.put<OrderItem>(
        `/orders/cart/items/${itemId}`,
        data,
      );
      return response.data;
    } catch (error) {
      console.log('API not available, using mock cart');
      const cart = getMockCart();
      if (cart && cart.items) {
        const itemIndex = cart.items.findIndex(
          (item) => item.item_id === itemId,
        );
        if (itemIndex >= 0) {
          if (data.quantity !== undefined) {
            cart.items[itemIndex].quantity = data.quantity;
          }
          if (data.note !== undefined) {
            cart.items[itemIndex].note = data.note;
          }

          // Recalculate total
          cart.subtotal = cart.items.reduce(
            (sum, item) => sum + (item.price || 0) * item.quantity,
            0,
          );
          cart.total = cart.subtotal + (cart.delivery_fee || 0);

          saveMockCart(cart);
          return cart.items[itemIndex];
        }
      }
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (itemId: string) => {
    try {
      const response = await api.delete(`/orders/cart/items/${itemId}`);
      return response.data;
    } catch (error) {
      console.log('API not available, using mock cart');
      const cart = getMockCart();
      if (cart && cart.items) {
        cart.items = cart.items.filter((item) => item.item_id !== itemId);

        // Recalculate total
        cart.subtotal = cart.items.reduce(
          (sum, item) => sum + (item.price || 0) * item.quantity,
          0,
        );
        cart.total = cart.subtotal + (cart.delivery_fee || 0);

        saveMockCart(cart);
      }
      return { success: true };
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      const response = await api.delete('/orders/cart');
      return response.data;
    } catch (error) {
      console.log('API not available, clearing mock cart');
      clearMockCart();
      return { success: true };
    }
  },

  // Checkout (convert cart to pending order)
  checkout: async (deliveryId: string, paymentMethodId: string) => {
    const response = await api.post<Order>('/orders/checkout', {
      delivery_id: deliveryId,
      payment_method_id: paymentMethodId,
    });
    return response.data;
  },

  // Get order items
  getOrderItems: async (orderId: string) => {
    const response = await api.get<OrderItem[]>(`/orders/${orderId}/items`);
    return response.data;
  },

  // Track order status
  trackOrder: async (orderId: string) => {
    const response = await api.get<OrderWithDetails>(
      `/orders/${orderId}/track`,
    );
    return response.data;
  },

  // Rate order (restaurant review)
  rateRestaurant: async (orderId: string, rating: number, comment?: string) => {
    const response = await api.post(`/orders/${orderId}/rate-restaurant`, {
      rating_point: rating,
      comment,
    });
    return response.data;
  },

  // Rate driver
  rateDriver: async (orderId: string, rating: number, comment?: string) => {
    const response = await api.post(`/orders/${orderId}/rate-driver`, {
      rating_point: rating,
      comment,
    });
    return response.data;
  },

  // Get order history statistics
  getOrderStatistics: async () => {
    const response = await api.get('/orders/statistics');
    return response.data;
  },
};
