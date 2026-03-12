import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { orderService } from '@/services/orders/order.tsx';
import type { Order } from '@/services/orders/order.interface';
import Sidebar from '@/components/layouts/Sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle,
  Package,
  Truck,
  User,
  Phone,
} from 'lucide-react';

const OrderTracking = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
    // Poll for updates every 10 seconds
    const interval = setInterval(loadOrder, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  const loadOrder = async () => {
    if (!orderId) return;

    try {
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTrackingSteps = () => {
    const steps = [
      {
        label: 'Order Placed',
        icon: Package,
        completed: !!order?.ordered_at,
        time: formatDate(order?.ordered_at),
      },
      {
        label: 'Order Confirmed',
        icon: CheckCircle,
        completed: !!order?.confirmed_at,
        time: formatDate(order?.confirmed_at),
      },
      {
        label: 'Preparing',
        icon: Package,
        completed: ['PREPARING', 'READY', 'DELIVERING', 'DELIVERED'].includes(
          order?.status || '',
        ),
        time: null,
      },
      {
        label: 'Out for Delivery',
        icon: Truck,
        completed: ['DELIVERING', 'DELIVERED'].includes(order?.status || ''),
        time: null,
      },
      {
        label: 'Delivered',
        icon: CheckCircle,
        completed: order?.status === 'DELIVERED',
        time: formatDate(order?.delivered_at),
      },
    ];
    return steps;
  };

  if (loading) {
    return (
      <div className='flex min-h-screen bg-gray-50'>
        <Sidebar />
        <main className='ml-64 flex-1'>
          <div className='container mx-auto max-w-4xl px-4 py-6 text-left'>
            <div className='animate-pulse space-y-4'>
              <div className='h-8 w-1/3 rounded bg-gray-200' />
              <div className='h-64 rounded-lg bg-gray-200' />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className='flex min-h-screen bg-gray-50'>
        <Sidebar />
        <main className='ml-64 flex-1'>
          <div className='container mx-auto max-w-4xl px-4 py-6 text-left'>
            <div>
              <p className='text-gray-500'>Order not found</p>
              <Button onClick={() => navigate('/orders')} className='mt-4'>
                Back to Orders
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const steps = getTrackingSteps();
  const currentStepIndex = steps.findIndex((step) => !step.completed);
  const activeStepIndex =
    currentStepIndex === -1
      ? steps.length - 1
      : Math.max(0, currentStepIndex - 1);

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />

      <main className='ml-64 flex-1 pb-8'>
        <div className='container mx-auto max-w-4xl px-4 py-6 text-left'>
          {/* Header */}
          <div className='mb-6'>
            <Button
              variant='ghost'
              onClick={() => navigate('/orders')}
              className='mb-4'
            >
              <ArrowLeft size={20} className='mr-2' />
              Back to Orders
            </Button>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Track Order</h1>
              <p className='text-gray-600'>
                Order #{order.order_id.slice(-8)} •{' '}
                {order.restaurant_name || 'Restaurant'}
              </p>
            </div>
          </div>

          <div className='space-y-6'>
            {/* Map Placeholder */}
            <Card className='overflow-hidden'>
              <div className='relative h-64 bg-gray-100'>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='text-center'>
                    <MapPin className='mx-auto mb-2 text-gray-400' size={48} />
                    <p className='text-sm text-gray-500'>
                      Live tracking map coming soon
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tracking Timeline */}
            <Card className='p-6'>
              <h2 className='mb-6 text-xl font-bold text-gray-900'>
                Order Status
              </h2>
              <div className='relative space-y-8'>
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === activeStepIndex;
                  const isCompleted = step.completed;

                  return (
                    <div key={index} className='relative flex gap-4'>
                      {/* Timeline line */}
                      {index < steps.length - 1 && (
                        <div
                          className={`absolute top-12 left-5 h-full w-0.5 ${
                            isCompleted ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        />
                      )}

                      {/* Icon */}
                      <div
                        className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isActive
                              ? 'animate-pulse bg-orange-500 text-white'
                              : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        <Icon size={20} />
                      </div>

                      {/* Content */}
                      <div className='flex-1 pb-8'>
                        <div className='flex items-center justify-between'>
                          <h3
                            className={`font-semibold ${
                              isCompleted || isActive
                                ? 'text-gray-900'
                                : 'text-gray-500'
                            }`}
                          >
                            {step.label}
                          </h3>
                          {step.time && (
                            <span className='text-sm text-gray-500'>
                              {step.time}
                            </span>
                          )}
                        </div>
                        {isActive && (
                          <p className='mt-1 text-sm text-orange-600'>
                            In progress...
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Delivery Info */}
            {order.status === 'DELIVERING' && (
              <Card className='p-6'>
                <h2 className='mb-4 text-xl font-bold text-gray-900'>
                  Driver Information
                </h2>
                <div className='space-y-3'>
                  <div className='flex items-center gap-3'>
                    <User className='flex-shrink-0 text-gray-600' size={20} />
                    <div>
                      <p className='text-sm font-medium text-gray-500'>Name</p>
                      <p className='text-sm text-gray-900'>
                        Driver information will appear here
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Phone className='flex-shrink-0 text-gray-600' size={20} />
                    <div>
                      <p className='text-sm font-medium text-gray-500'>Phone</p>
                      <p className='text-sm text-gray-900'>---</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Delivery Address */}
            <Card className='p-6'>
              <h2 className='mb-4 text-xl font-bold text-gray-900'>
                Delivery Address
              </h2>
              <div className='flex items-start gap-3'>
                <MapPin
                  className='mt-0.5 flex-shrink-0 text-gray-600'
                  size={20}
                />
                <div>
                  <p className='text-sm text-gray-900'>
                    {order.delivery_address || 'N/A'}
                  </p>
                  {order.recipient_name && (
                    <p className='mt-2 text-sm text-gray-500'>
                      {order.recipient_name} • {order.recipient_phone || 'N/A'}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className='flex gap-3'>
              <Button
                variant='outline'
                onClick={() => navigate(`/orders/${orderId}`)}
                className='flex-1'
              >
                View Details
              </Button>
              <Button
                onClick={() => loadOrder()}
                className='flex-1 bg-orange-500 hover:bg-orange-600'
              >
                <Clock size={20} className='mr-2' />
                Refresh Status
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderTracking;
