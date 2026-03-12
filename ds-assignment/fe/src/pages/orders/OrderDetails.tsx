import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { orderService } from '@/services/orders/order.tsx';
import type { OrderWithDetails } from '@/services/orders/order.interface';
import Sidebar from '@/components/layouts/Sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  MapPin,
  Clock,
  User,
  Phone,
  Package,
  CreditCard,
  CheckCircle,
  XCircle,
  Wallet,
} from 'lucide-react';

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Failed to load order details:', error);
      alert('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'text-green-900 bg-green-100';
      case 'DELIVERING':
        return 'text-blue-900 bg-blue-100';
      case 'PREPARING':
      case 'CONFIRMED':
        return 'text-amber-900 bg-amber-100';
      case 'CANCELLED':
        return 'text-red-900 bg-red-100';
      case 'PLACED':
        return 'text-orange-900 bg-orange-100';
      default:
        return 'text-gray-900 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle size={24} className='text-green-900' />;
      case 'CANCELLED':
        return <XCircle size={24} className='text-red-900' />;
      default:
        return <Package size={24} className='text-gray-900' />;
    }
  };

  const getPaymentIcon = (type?: string) => {
    switch (type) {
      case 'CASH':
        return <Wallet className='text-green-600' size={20} />;
      case 'E_WALLET':
        return <Wallet className='text-blue-600' size={20} />;
      default:
        return <CreditCard className='text-purple-600' size={20} />;
    }
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
              <Button
                onClick={() => navigate('/orders')}
                className='mt-4 text-left'
              >
                Back to Orders
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />

      <main className='ml-64 flex-1 pb-8'>
        <div className='container mx-auto max-w-4xl px-4 py-6 text-left'>
          {/* Header */}
          <div className='mb-6'>
            <Button
              variant='outline'
              onClick={() => navigate('/orders')}
              className='mb-4 text-left'
            >
              <ArrowLeft size={20} className='mr-2' />
              Back to Orders
            </Button>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>
                  Order Details
                </h1>
                <p className='mt-2 text-left text-gray-600'>
                  Order #{order.order_id.slice(-8)}
                </p>
              </div>
              <div
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold uppercase ${getStatusColor(order.status)}`}
              >
                {getStatusIcon(order.status)}
                {order.status}
              </div>
            </div>
          </div>

          <div className='space-y-6'>
            {/* Restaurant & Timeline Grid */}
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              {/* Restaurant Info */}
              <Card className='p-6'>
                <h2 className='mb-4 text-xl font-bold text-gray-900'>
                  Restaurant
                </h2>
                <div className='flex items-center gap-3'>
                  <Package className='text-orange-500' size={24} />
                  <div>
                    <p className='text-left font-semibold text-gray-900'>
                      {order.restaurant_name || 'Restaurant'}
                    </p>
                    <p className='text-sm text-gray-500'>
                      {order.restaurant_address || 'N/A'}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Order Timeline */}
              <Card className='p-6'>
                <h2 className='mb-4 text-xl font-bold text-gray-900'>
                  Timeline
                </h2>
                <div className='space-y-3'>
                  {order.ordered_at && (
                    <div className='flex items-center gap-3'>
                      <Clock
                        className='flex-shrink-0 text-gray-600'
                        size={20}
                      />
                      <div>
                        <p className='text-left text-sm font-medium text-gray-900'>
                          Order Placed
                        </p>
                        <p className='text-sm text-gray-500'>
                          {formatDate(order.ordered_at)}
                        </p>
                      </div>
                    </div>
                  )}
                  {order.confirmed_at && (
                    <div className='flex items-center gap-3'>
                      <CheckCircle
                        className='flex-shrink-0 text-green-600'
                        size={20}
                      />
                      <div>
                        <p className='text-left text-sm font-medium text-gray-900'>
                          Order Confirmed
                        </p>
                        <p className='text-sm text-gray-500'>
                          {formatDate(order.confirmed_at)}
                        </p>
                      </div>
                    </div>
                  )}
                  {order.delivered_at && (
                    <div className='flex items-center gap-3'>
                      <CheckCircle
                        className='flex-shrink-0 text-green-600'
                        size={20}
                      />
                      <div>
                        <p className='text-left text-sm font-medium text-gray-900'>
                          Delivered
                        </p>
                        <p className='text-sm text-gray-500'>
                          {formatDate(order.delivered_at)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Delivery Information */}
            <Card className='p-6'>
              <h2 className='mb-4 text-xl font-bold text-gray-900'>
                Delivery Information
              </h2>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div className='flex items-start gap-3'>
                  <MapPin
                    className='mt-0.5 flex-shrink-0 text-gray-600'
                    size={20}
                  />
                  <div className='flex-1'>
                    <p className='text-left text-sm font-medium text-stone-900'>
                      Address
                    </p>
                    <p className='text-left text-sm text-gray-900'>
                      {order.delivery_address || 'N/A'}
                    </p>
                  </div>
                </div>
                {order.recipient_name && (
                  <div className='flex items-start gap-3'>
                    <User className='flex-shrink-0 text-gray-600' size={20} />
                    <div className='flex-1'>
                      <p className='text-left text-sm font-medium text-stone-900'>
                        Recipient
                      </p>
                      <p className='text-left text-sm text-gray-900'>
                        {order.recipient_name}
                      </p>
                    </div>
                  </div>
                )}
                {order.recipient_phone && (
                  <div className='flex items-start gap-3'>
                    <Phone className='flex-shrink-0 text-gray-600' size={20} />
                    <div className='flex-1'>
                      <p className='text-left text-sm font-medium text-stone-900'>
                        Phone
                      </p>
                      <p className='text-left text-sm text-gray-900'>
                        {order.recipient_phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Order Items */}
            <Card className='p-6'>
              <h2 className='mb-4 text-xl font-bold text-gray-900'>
                Order Items
              </h2>
              <div className='space-y-3'>
                {order.items?.map((item) => (
                  <div
                    key={item.item_id}
                    className='flex items-center justify-between border-b pb-3 last:border-b-0'
                  >
                    <div className='flex-1'>
                      <p className='text-left font-medium text-gray-900'>
                        {item.item_name}
                      </p>
                      <p className='text-left text-sm text-gray-500'>
                        {formatPrice(item.price || 0)} × {item.quantity}
                      </p>
                    </div>
                    <p className='text-left font-semibold text-gray-900'>
                      {formatPrice((item.price || 0) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Payment Information */}
            <Card className='p-6'>
              <h2 className='mb-4 text-xl font-bold text-gray-900'>
                Payment Summary
              </h2>
              <div className='space-y-3'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-600'>Subtotal</span>
                  <span className='text-gray-900'>
                    {formatPrice(order.subtotal || 0)}
                  </span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-600'>Delivery Fee</span>
                  <span className='text-gray-900'>
                    {formatPrice(order.delivery_fee || 0)}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className='flex items-center justify-between text-sm text-green-600'>
                    <span>Discount</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className='flex items-center justify-between border-t pt-3'>
                  <span className='text-lg font-bold text-gray-900'>Total</span>
                  <span className='text-2xl font-bold text-orange-800'>
                    {formatPrice(order.total || order.subtotal || 0)}
                  </span>
                </div>
                <div className='mt-4 flex items-center gap-3 border-t pt-4'>
                  {getPaymentIcon(order.payment_type)}
                  <div>
                    <p className='text-left text-sm font-medium text-gray-900'>
                      Payment Method
                    </p>
                    <p className='text-left text-sm text-gray-500'>
                      {order.payment_type === 'CASH'
                        ? 'Cash on Delivery'
                        : order.payment_type === 'E_WALLET'
                          ? 'E-Wallet'
                          : 'Bank Card'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className='flex gap-3'>
              {['CONFIRMED', 'PREPARING', 'READY', 'DELIVERING'].includes(
                order.status,
              ) && (
                <Button
                  onClick={() => navigate(`/orders/${orderId}/track`)}
                  className='bg-orange-500 hover:bg-orange-600'
                >
                  Track Order
                </Button>
              )}
              {order.status === 'DELIVERED' && (
                <Button
                  onClick={() => navigate(`/orders/${orderId}/rate`)}
                  className='bg-orange-500 hover:bg-orange-600'
                >
                  Rate Order
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetails;
