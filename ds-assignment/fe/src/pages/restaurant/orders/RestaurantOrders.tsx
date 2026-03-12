import { useState, useEffect } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import { RequireRestaurant } from '@/components/layouts/RequireRestaurant';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Clock,
  CheckCircle,
  XCircle,
  Package,
  ChefHat,
  User,
  MapPin,
  // Phone icon removed (unused)
} from 'lucide-react';
import { useRestaurantContext } from '@/hooks/restaurant/useRestaurantContext';

import type { OrderWithDetails } from '@/services/orders/order.interface';
import { orderService } from '@/services/orders/order';

const RestaurantOrders = () => {
  const { selectedRestaurant } = useRestaurantContext();
  const [activeTab, setActiveTab] = useState<'incoming' | 'finished'>(
    'incoming',
  );
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    const fetchOrders = async () => {
      if (selectedRestaurant) {
        try {
          const response = await orderService.getOrdersForRestaurant(
            selectedRestaurant.restaurant_id,
          );
          setOrders(response);
          setErrorMessage(null);
        } catch (error: any) {
          let message = 'Failed to fetch restaurant orders.';
          if (error?.response?.data?.message) {
            message += ' ' + error.response.data.message;
          } else if (error?.message) {
            message += ' ' + error.message;
          }
          setErrorMessage(message);
          setOrders([]);
        }
      } else {
        setOrders([]);
        setErrorMessage(null);
      }
    };
    fetchOrders();
    intervalId = setInterval(fetchOrders, 5000);
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [selectedRestaurant]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-800';
      case 'PREPARING':
        return 'bg-blue-100 text-blue-800';
      case 'READY':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERING':
        return 'bg-indigo-100 text-indigo-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock size={18} />;
      case 'PREPARING':
        return <ChefHat size={18} />;
      case 'READY':
        return <Package size={18} />;
      case 'DELIVERED':
        return <CheckCircle size={18} />;
      case 'CANCELLED':
        return <XCircle size={18} />;
      default:
        return <Clock size={18} />;
    }
  };

  const handleStatusUpdate = (
    orderId: string,
    newStatus:
      | 'PENDING'
      | 'PREPARING'
      | 'READY'
      | 'IN_CART'
      | 'CONFIRMED'
      | 'DELIVERING'
      | 'DELIVERED'
      | 'CANCELLED',
  ) => {
    // Call backend to update order status
    orderService
      .updateOrderStatus(orderId, newStatus)
      .then(() => {
        setErrorMessage(null);
        fetchOrders();
      })
      .catch((err: any) => {
        let message = 'Failed to update order status.';
        if (err?.response?.data?.message) {
          message += ' ' + err.response.data.message;
        } else if (err?.message) {
          message += ' ' + err.message;
        }
        setErrorMessage(message);
      });
  };

  const incomingOrders = orders.filter((order) =>
    ['PENDING', 'PREPARING', 'READY'].includes(order.status),
  );

  const finishedOrders = orders.filter((order) =>
    ['DELIVERED', 'CANCELLED'].includes(order.status),
  );

  const displayOrders =
    activeTab === 'incoming' ? incomingOrders : finishedOrders;

  return (
    <RequireRestaurant>
      <div className='flex min-h-screen bg-gray-50'>
        <Sidebar />

        <main className='ml-64 flex-1'>
          <div className='container mx-auto max-w-7xl px-6 py-6 text-left'>
            {/* Header */}
            <div className='mb-6'>
              <h1 className='mb-2 text-3xl font-bold text-gray-900'>
                {selectedRestaurant?.name} - Order Management
              </h1>
              <p className='text-gray-600'>
                Manage incoming and finished orders
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className='mb-4 rounded border border-red-300 bg-red-100 px-4 py-3 text-red-700'>
                <strong>Error:</strong> {errorMessage}
              </div>
            )}

            {/* Tabs */}
            <div className='mb-6 flex gap-2 border-b'>
              <button
                onClick={() => setActiveTab('incoming')}
                className={`border-b-2 px-4 py-3 font-medium transition ${
                  activeTab === 'incoming'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Incoming Orders ({incomingOrders.length})
              </button>
              <button
                onClick={() => setActiveTab('finished')}
                className={`border-b-2 px-4 py-3 font-medium transition ${
                  activeTab === 'finished'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Finished Orders ({finishedOrders.length})
              </button>
            </div>

            {/* Orders List */}
            <div className='space-y-4'>
              {displayOrders.length === 0 ? (
                <Card className='p-12 text-center'>
                  <Package className='mx-auto mb-4 text-gray-400' size={48} />
                  <p className='text-lg font-medium text-gray-600'>
                    No {activeTab} orders
                  </p>
                  <p className='text-sm text-gray-500'>
                    {activeTab === 'incoming'
                      ? 'New orders will appear here'
                      : 'Completed orders will appear here'}
                  </p>
                </Card>
              ) : (
                displayOrders.map((order) => (
                  <Card key={order.order_id} className='p-6'>
                    <div className='flex items-start justify-between'>
                      {/* Order Info */}
                      <div className='flex-1'>
                        <div className='mb-4 flex items-center gap-3'>
                          <h3 className='text-xl font-bold text-gray-900'>
                            {order.order_id}
                          </h3>
                          <span
                            className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(order.status)}`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                          <span className='text-sm text-gray-500'>
                            {order.ordered_at
                              ? formatTime(order.ordered_at)
                              : ''}
                          </span>
                        </div>

                        <div className='mb-4 grid grid-cols-2 gap-4'>
                          {/* Customer Info */}
                          <div>
                            <div className='mb-2 flex items-center gap-2 text-gray-700'>
                              <User size={18} />
                              <span className='font-medium'>
                                {/* No customer_name, show customer_id or blank */}
                                {order.customer_id}
                              </span>
                            </div>
                            {/* No customer_phone, so skip */}
                            <div className='flex items-start gap-2 text-gray-600'>
                              <MapPin size={18} className='mt-0.5' />
                              <span className='text-sm'>
                                {order.delivery_address}
                              </span>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div>
                            <p className='mb-2 font-medium text-gray-700'>
                              Items:
                            </p>
                            <ul className='space-y-1'>
                              {(order.items || []).map((item, idx) => (
                                <li key={idx} className='text-sm text-gray-600'>
                                  {item.quantity}x {item.item_name} -{' '}
                                  {formatCurrency(item.price || 0)}
                                </li>
                              ))}
                            </ul>
                            {order.customer_note && (
                              <p className='mt-2 text-sm text-orange-600 italic'>
                                Note: {order.customer_note}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Total */}
                        <div className='border-t pt-3'>
                          <div className='flex items-center justify-between'>
                            <span className='font-semibold text-gray-700'>
                              Total Amount:
                            </span>
                            <span className='text-xl font-bold text-orange-600'>
                              {formatCurrency(order.total || 0)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      {activeTab === 'incoming' && (
                        <div className='ml-6 flex flex-col gap-2'>
                          {order.status === 'PENDING' && (
                            <>
                              <Button
                                onClick={() =>
                                  handleStatusUpdate(
                                    order.order_id,
                                    'PREPARING',
                                  )
                                }
                                className='bg-blue-500 hover:bg-blue-600'
                              >
                                Accept Order
                              </Button>
                              <Button
                                onClick={() =>
                                  handleStatusUpdate(
                                    order.order_id,
                                    'CANCELLED',
                                  )
                                }
                                variant='outline'
                                className='border-red-300 text-red-600 hover:bg-red-50'
                              >
                                Decline
                              </Button>
                            </>
                          )}
                          {order.status === 'PREPARING' && (
                            <Button
                              onClick={() =>
                                handleStatusUpdate(order.order_id, 'READY')
                              }
                              className='bg-purple-500 hover:bg-purple-600'
                            >
                              Mark as Ready
                            </Button>
                          )}
                          {order.status === 'READY' && (
                            <div className='rounded-lg bg-purple-50 p-3 text-center'>
                              <p className='text-sm font-medium text-purple-700'>
                                Waiting for driver
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </RequireRestaurant>
  );
};

export default RestaurantOrders;
