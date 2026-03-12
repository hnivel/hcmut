import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '@/services/orders/order.tsx';
import type { Order } from '@/services/orders/order.interface';
import { OrderCard } from '@/components/shared/OrderCard';
import Sidebar from '@/components/layouts/Sidebar';
import { Package, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockOrders } from '@/lib/mockData';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const statusFilters = [
    { label: 'All', value: 'ALL' },
    { label: 'Placed', value: 'PLACED' },
    { label: 'Preparing', value: 'PREPARING' },
    { label: 'Delivering', value: 'DELIVERING' },
    { label: 'Delivered', value: 'DELIVERED' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [selectedStatus, orders]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      try {
        const data = await orderService.getMyOrders();
        // Filter out IN_CART status orders
        const validOrders = data.filter((order) => order.status !== 'IN_CART');
        setOrders(validOrders);
      } catch (apiError) {
        // Use mock data if API fails
        console.log('API not available, using mock data for orders');
        setOrders(mockOrders);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (selectedStatus === 'ALL') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((order) => order.status === selectedStatus),
      );
    }
  };

  const handleViewDetails = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  const handleTrackOrder = (orderId: string) => {
    navigate(`/orders/${orderId}/track`);
  };

  const handleCancelOrder = async (orderId: string) => {
    if (confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderService.cancelOrder(orderId);
        await loadOrders();
      } catch (error) {
        console.error('Failed to cancel order:', error);
        alert('Failed to cancel order. Please try again.');
      }
    }
  };

  const handleRateOrder = (orderId: string) => {
    navigate(`/orders/${orderId}/rate`);
  };

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />

      <main className='mt-4 ml-64 flex-1 pr-8'>
        <div className='container mx-auto max-w-7xl px-4 py-6 text-left'>
          {/* Header */}
          <div className='mb-6'>
            <div className='mb-4 flex items-center gap-3'>
              <h1 className='text-3xl font-bold text-orange-950'>
                My Food Orders
              </h1>
            </div>
            <p className='text-stone-600'>Track and manage your food orders</p>
          </div>

          {/* Status Filter */}
          <div className='mb-6 flex gap-2 overflow-x-auto pb-2'>
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedStatus(filter.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition ${
                  selectedStatus === filter.value
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Orders List */}
          {loading ? (
            <div className='space-y-4 md:grid md:grid-cols-2 md:gap-4'>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className='h-48 animate-pulse rounded-lg bg-gray-200'
                />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className='flex flex-col items-center py-20 text-center'>
              <Package
                className='mb-4 text-gray-300'
                size={64}
                strokeWidth={1}
              />
              <h3 className='mb-2 text-xl font-semibold text-gray-700'>
                {selectedStatus === 'ALL'
                  ? 'No Orders Yet'
                  : `No ${selectedStatus.toLowerCase()} Orders`}
              </h3>
              <p className='mb-6 text-gray-500'>
                {selectedStatus === 'ALL'
                  ? 'Start ordering delicious food from your favorite restaurants!'
                  : 'Try selecting a different status filter'}
              </p>
              {selectedStatus === 'ALL' && (
                <Button
                  onClick={() => navigate('/')}
                  className='bg-orange-500 hover:bg-orange-600'
                >
                  Explore Restaurants
                </Button>
              )}
            </div>
          ) : (
            <div className='space-y-4 md:grid md:grid-cols-2 md:gap-4'>
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.order_id}
                  order={order}
                  onViewDetails={handleViewDetails}
                  onTrack={handleTrackOrder}
                  onCancel={handleCancelOrder}
                  onRate={handleRateOrder}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Orders;
