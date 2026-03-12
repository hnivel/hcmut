import { useState } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Phone,
  Package,
  Clock,
  Navigation,
  CheckCircle,
} from 'lucide-react';

interface DeliveryOrder {
  order_id: string;
  order_number: string;
  restaurant_name: string;
  restaurant_address: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  total_amount: number;
  delivery_fee: number;
  status: 'READY' | 'PICKED_UP' | 'DELIVERING';
  estimated_time: string;
  distance: string;
}

const DriverActiveOrders = () => {
  const [orders, setOrders] = useState<DeliveryOrder[]>([
    {
      order_id: '1',
      order_number: '#1001',
      restaurant_name: 'Golden Spoon',
      restaurant_address: '123 Nguyen Hue St, District 1',
      customer_name: 'Nguyen Van A',
      customer_phone: '0901234567',
      delivery_address: '456 Le Loi St, District 1',
      total_amount: 17.5,
      delivery_fee: 2.5,
      status: 'READY',
      estimated_time: '20 mins',
      distance: '2.3 km',
    },
    {
      order_id: '2',
      order_number: '#1002',
      restaurant_name: 'Pho Heaven',
      restaurant_address: '456 Le Loi St, District 1',
      customer_name: 'Tran Thi B',
      customer_phone: '0912345678',
      delivery_address: '789 Pasteur St, District 3',
      total_amount: 12.0,
      delivery_fee: 3.0,
      status: 'PICKED_UP',
      estimated_time: '15 mins',
      distance: '3.1 km',
    },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: DeliveryOrder['status']) => {
    switch (status) {
      case 'READY':
        return 'bg-blue-100 text-blue-700';
      case 'PICKED_UP':
        return 'bg-purple-100 text-purple-700';
      case 'DELIVERING':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handlePickup = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.order_id === orderId ? { ...order, status: 'PICKED_UP' } : order,
      ),
    );
  };

  const handleStartDelivery = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.order_id === orderId ? { ...order, status: 'DELIVERING' } : order,
      ),
    );
  };

  const handleCompleteDelivery = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.order_id !== orderId));
  };

  const readyOrders = orders.filter((order) => order.status === 'READY');
  const activeOrders = orders.filter((order) =>
    ['PICKED_UP', 'DELIVERING'].includes(order.status),
  );

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />

      <main className='ml-64 flex-1'>
        <div className='container mx-auto max-w-7xl px-6 py-6 text-left'>
          {/* Header */}
          <div className='mb-6'>
            <h1 className='mb-2 text-3xl font-bold text-gray-900'>
              Active Deliveries
            </h1>
            <p className='text-gray-600'>
              Manage your current delivery assignments
            </p>
          </div>

          {/* Stats */}
          <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-3'>
            <Card className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-full bg-blue-100 p-2'>
                  <Package className='text-blue-600' size={24} />
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Ready to Pickup</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {readyOrders.length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-full bg-purple-100 p-2'>
                  <Navigation className='text-purple-600' size={24} />
                </div>
                <div>
                  <p className='text-sm text-gray-600'>In Delivery</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {activeOrders.length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-full bg-green-100 p-2'>
                  <CheckCircle className='text-green-600' size={24} />
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Today's Earnings</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {formatCurrency(5.5)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Active Deliveries Section */}
          {activeOrders.length > 0 && (
            <div className='mb-8'>
              <h2 className='mb-4 text-xl font-bold text-gray-900'>
                In Progress ({activeOrders.length})
              </h2>
              <div className='space-y-4'>
                {activeOrders.map((order) => (
                  <Card key={order.order_id} className='p-6'>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <div className='mb-4 flex items-center gap-3'>
                          <h3 className='text-xl font-bold text-gray-900'>
                            {order.order_number}
                          </h3>
                          <span
                            className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                              order.status,
                            )}`}
                          >
                            <Navigation size={16} />
                            {order.status === 'PICKED_UP'
                              ? 'Ready to Deliver'
                              : 'Delivering'}
                          </span>
                        </div>

                        <div className='mb-4 grid grid-cols-2 gap-6'>
                          {/* Customer Info */}
                          <div>
                            <p className='mb-3 font-semibold text-gray-700'>
                              Delivery To:
                            </p>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2 text-gray-700'>
                                <MapPin size={18} className='text-orange-500' />
                                <span className='font-medium'>
                                  {order.customer_name}
                                </span>
                              </div>
                              <div className='flex items-center gap-2 text-gray-600'>
                                <Phone size={18} />
                                <span className='text-sm'>
                                  {order.customer_phone}
                                </span>
                              </div>
                              <div className='flex items-start gap-2 text-gray-600'>
                                <MapPin size={18} className='mt-0.5' />
                                <span className='text-sm'>
                                  {order.delivery_address}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Delivery Info */}
                          <div>
                            <p className='mb-3 font-semibold text-gray-700'>
                              Delivery Details:
                            </p>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2 text-gray-600'>
                                <Clock size={18} />
                                <span className='text-sm'>
                                  Est. {order.estimated_time}
                                </span>
                              </div>
                              <div className='flex items-center gap-2 text-gray-600'>
                                <Navigation size={18} />
                                <span className='text-sm'>
                                  {order.distance}
                                </span>
                              </div>
                              <div className='mt-3 rounded-lg bg-green-50 p-3'>
                                <p className='text-sm text-gray-600'>
                                  Delivery Fee:
                                </p>
                                <p className='text-xl font-bold text-green-600'>
                                  {formatCurrency(order.delivery_fee)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className='ml-6 flex flex-col gap-2'>
                        {order.status === 'PICKED_UP' && (
                          <Button
                            onClick={() => handleStartDelivery(order.order_id)}
                            className='bg-purple-500 hover:bg-purple-600'
                          >
                            <Navigation size={18} className='mr-2' />
                            Start Delivery
                          </Button>
                        )}
                        {order.status === 'DELIVERING' && (
                          <Button
                            onClick={() =>
                              handleCompleteDelivery(order.order_id)
                            }
                            className='bg-green-500 hover:bg-green-600'
                          >
                            <CheckCircle size={18} className='mr-2' />
                            Complete Delivery
                          </Button>
                        )}
                        <Button
                          variant='outline'
                          onClick={() =>
                            window.open(
                              `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                order.delivery_address,
                              )}`,
                              '_blank',
                            )
                          }
                        >
                          Open in Maps
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Ready for Pickup Section */}
          {readyOrders.length > 0 && (
            <div>
              <h2 className='mb-4 text-xl font-bold text-gray-900'>
                Ready for Pickup ({readyOrders.length})
              </h2>
              <div className='space-y-4'>
                {readyOrders.map((order) => (
                  <Card key={order.order_id} className='p-6'>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <div className='mb-4 flex items-center gap-3'>
                          <h3 className='text-xl font-bold text-gray-900'>
                            {order.order_number}
                          </h3>
                          <span
                            className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                              order.status,
                            )}`}
                          >
                            <Package size={16} />
                            Ready for Pickup
                          </span>
                        </div>

                        <div className='mb-4 grid grid-cols-2 gap-6'>
                          {/* Restaurant Info */}
                          <div>
                            <p className='mb-3 font-semibold text-gray-700'>
                              Pickup From:
                            </p>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2 text-gray-700'>
                                <Package size={18} className='text-blue-500' />
                                <span className='font-medium'>
                                  {order.restaurant_name}
                                </span>
                              </div>
                              <div className='flex items-start gap-2 text-gray-600'>
                                <MapPin size={18} className='mt-0.5' />
                                <span className='text-sm'>
                                  {order.restaurant_address}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Delivery Preview */}
                          <div>
                            <p className='mb-3 font-semibold text-gray-700'>
                              Deliver To:
                            </p>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2 text-gray-700'>
                                <MapPin size={18} className='text-orange-500' />
                                <span className='font-medium'>
                                  {order.customer_name}
                                </span>
                              </div>
                              <div className='flex items-start gap-2 text-gray-600'>
                                <MapPin size={18} className='mt-0.5' />
                                <span className='text-sm'>
                                  {order.delivery_address}
                                </span>
                              </div>
                              <div className='mt-3 rounded-lg bg-blue-50 p-3'>
                                <p className='text-sm text-gray-600'>
                                  Delivery Fee:
                                </p>
                                <p className='text-xl font-bold text-blue-600'>
                                  {formatCurrency(order.delivery_fee)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className='ml-6 flex flex-col gap-2'>
                        <Button
                          onClick={() => handlePickup(order.order_id)}
                          className='bg-blue-500 hover:bg-blue-600'
                        >
                          <Package size={18} className='mr-2' />
                          Confirm Pickup
                        </Button>
                        <Button
                          variant='outline'
                          onClick={() =>
                            window.open(
                              `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                order.restaurant_address,
                              )}`,
                              '_blank',
                            )
                          }
                        >
                          Navigate to Restaurant
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {orders.length === 0 && (
            <Card className='p-12 text-center'>
              <Package className='mx-auto mb-4 text-gray-400' size={48} />
              <p className='text-lg font-medium text-gray-600'>
                No active deliveries
              </p>
              <p className='text-sm text-gray-500'>
                New delivery assignments will appear here
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default DriverActiveOrders;
