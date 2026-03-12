import {
  Clock,
  MapPin,
  Package,
  CheckCircle,
  XCircle,
  Store,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import type { Order } from '@/services/orders/order.interface';

interface OrderCardProps {
  order: Order;
  onViewDetails?: (orderId: string) => void;
  onTrack?: (orderId: string) => void;
  onCancel?: (orderId: string) => void;
  onRate?: (orderId: string) => void;
}

export const OrderCard = ({
  order,
  onViewDetails,
  onTrack,
  onCancel,
  onRate,
}: OrderCardProps) => {
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
        return <CheckCircle size={18} className='text-green-600' />;
      case 'CANCELLED':
        return <XCircle size={18} className='text-red-600' />;
      default:
        return <Package size={18} className='text-gray-600' />;
    }
  };

  const canCancel = ['PLACED', 'CONFIRMED'].includes(order.status);
  const canRate = order.status === 'DELIVERED';
  const canTrack = ['CONFIRMED', 'PREPARING', 'READY', 'DELIVERING'].includes(
    order.status,
  );

  return (
    <Card className='overflow-hidden transition-all hover:shadow-md'>
      <div className='flex h-full flex-col justify-between p-4'>
        {/* Header */}
        <div className='mb-4 flex items-start justify-between'>
          <div className='flex-1'>
            <div className='mb-2 flex items-center justify-between'>
              <h3 className='text-lg font-bold text-gray-900'>
                {order.restaurant_name || 'Restaurant'}
              </h3>
              <div
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase ${getStatusColor(order.status)}`}
              >
                {order.status}
              </div>
            </div>
            <p className='text-left text-sm text-gray-500'>
              Order #{order.order_id.slice(-8)}
            </p>
          </div>
        </div>

        {/* Order Info */}
        <div className='mb-4 space-y-2'>
          {order.ordered_at && (
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <Clock className='flex-shrink-0' size={16} />
              <span className='font-medium text-gray-500'>Ordered:</span>
              <span>{formatDate(order.ordered_at)}</span>
            </div>
          )}

          {order.delivery_address && (
            <div className='flex items-start gap-2 text-sm text-gray-600'>
              <MapPin className='mt-0.5 flex-shrink-0' size={16} />
              <span className='font-medium text-gray-500'>Address:</span>
              <span className='flex-1 text-left'>{order.delivery_address}</span>
            </div>
          )}

          {order.delivered_at && order.status === 'DELIVERED' && (
            <div className='flex items-center gap-2 text-sm text-green-600'>
              <CheckCircle className='flex-shrink-0' size={16} />
              <span className='font-medium'>Delivered:</span>
              <span>{formatDate(order.delivered_at)}</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className='flex items-center justify-between border-t pt-3'>
          <span className='text-sm font-medium text-gray-600'>
            Total Amount:
          </span>
          <span className='text-lg font-bold text-orange-800'>
            {formatPrice(order.total || order.subtotal || 0)}
          </span>
        </div>

        {/* Actions */}
        <div className='mt-3 flex gap-2'>
          {onViewDetails && (
            <Button
              variant='outline'
              size='sm'
              className='flex-1 border-orange-300 bg-orange-50 text-orange-800 hover:border-orange-400 hover:bg-orange-100'
              onClick={() => onViewDetails(order.order_id)}
            >
              View Details
            </Button>
          )}

          {canTrack && onTrack && (
            <Button
              variant='outline'
              size='sm'
              className='flex-1 border-stone-300'
              onClick={() => onTrack(order.order_id)}
            >
              Track Order
            </Button>
          )}

          {canCancel && onCancel && (
            <Button
              variant='outline'
              size='sm'
              className='border-orange-600 text-orange-600 hover:border-orange-700 hover:bg-orange-100 hover:text-orange-700'
              onClick={() => onCancel(order.order_id)}
            >
              Cancel
            </Button>
          )}

          {canRate && onRate && (
            <Button
              size='sm'
              className='bg-orange-500 hover:bg-orange-600'
              onClick={() => onRate(order.order_id)}
            >
              Rate Order
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
