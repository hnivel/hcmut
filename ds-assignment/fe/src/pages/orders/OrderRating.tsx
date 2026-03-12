import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { orderService } from '@/services/orders/order.tsx';
import type { Order } from '@/services/orders/order.interface';
import Sidebar from '@/components/layouts/Sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Star } from 'lucide-react';

const OrderRating = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Rating states
  const [foodRating, setFoodRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [overallRating, setOverallRating] = useState(0);
  const [comment, setComment] = useState('');

  // Hover states for interactive star ratings
  const [foodHover, setFoodHover] = useState(0);
  const [deliveryHover, setDeliveryHover] = useState(0);
  const [overallHover, setOverallHover] = useState(0);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Failed to load order:', error);
      alert('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async () => {
    if (overallRating === 0) {
      alert('Please provide an overall rating');
      return;
    }

    if (!orderId) return;

    try {
      setSubmitting(true);

      // Mock API call - implement actual rating submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In production, call: await orderService.rateOrder(orderId, { foodRating, deliveryRating, overallRating, comment });

      alert('Thank you for your feedback!');
      navigate('/orders');
    } catch (error) {
      console.error('Failed to submit rating:', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (
    rating: number,
    setRating: (value: number) => void,
    hoverValue: number,
    setHover: (value: number) => void,
  ) => {
    return (
      <div className='flex gap-1'>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type='button'
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className='transition-transform hover:scale-110'
          >
            <Star
              size={32}
              className={`$ star <= (hoverValue || rating) ? 'fill-orange-500 text-orange-500' : 'text-gray-300' }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className='flex min-h-screen bg-gray-50'>
        <Sidebar />
        <main className='ml-64 flex-1'>
          <div className='container mx-auto max-w-3xl px-4 py-6 text-left'>
            <div className='animate-pulse space-y-4'>
              <div className='h-8 w-1/3 rounded bg-gray-200' />
              <div className='h-64 rounded-lg bg-gray-200' />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!order || order.status !== 'DELIVERED') {
    return (
      <div className='flex min-h-screen bg-gray-50'>
        <Sidebar />
        <main className='ml-64 flex-1'>
          <div className='container mx-auto max-w-3xl px-4 py-6 text-left'>
            <div>
              <p className='text-gray-500'>
                {!order
                  ? 'Order not found'
                  : 'You can only rate delivered orders'}
              </p>
              <Button onClick={() => navigate('/orders')} className='mt-4'>
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
        <div className='container mx-auto max-w-3xl px-4 py-6 text-left'>
          {/* Error Message */}
          {errorMessage && (
            <div className='mb-4 rounded border border-red-300 bg-red-100 px-4 py-3 text-red-700'>
              <strong>Error:</strong> {errorMessage}
            </div>
          )}
          {/* Header */}
          <div className='mb-6'>
            <Button
              variant='outline'
              onClick={() => navigate('/orders')}
              className='mb-4'
            >
              <ArrowLeft size={20} className='mr-2' />
              Back to Orders
            </Button>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                Rate Your Order
              </h1>
              <p className='mt-2 text-stone-900'>
                Order #{order.order_id.slice(-8)} •{' '}
                {order.restaurant_name || 'Restaurant'}
              </p>
            </div>
          </div>

          <div className='space-y-6'>
            {/* Overall Rating */}
            <Card className='p-6'>
              <div className='text-center'>
                <h2 className='mb-2 text-xl font-bold text-gray-900'>
                  How was your overall experience?
                </h2>
                <p className='mb-6 text-sm text-gray-600'>
                  Your feedback helps us improve
                </p>
                <div className='flex justify-center'>
                  {renderStars(
                    overallRating,
                    setOverallRating,
                    overallHover,
                    setOverallHover,
                  )}
                </div>
                {overallRating > 0 && (
                  <p className='mt-3 text-sm text-gray-600'>
                    {overallRating === 5
                      ? '⭐ Excellent!'
                      : overallRating === 4
                        ? '😊 Great!'
                        : overallRating === 3
                          ? '🙂 Good'
                          : overallRating === 2
                            ? '😐 Fair'
                            : '😞 Poor'}
                  </p>
                )}
              </div>
            </Card>

            {/* Food Quality Rating */}
            <Card className='p-6'>
              <h3 className='mb-4 font-semibold text-gray-900'>
                How was the food quality?
              </h3>
              <div className='flex items-center gap-4'>
                {renderStars(
                  foodRating,
                  setFoodRating,
                  foodHover,
                  setFoodHover,
                )}
                {foodRating > 0 && (
                  <span className='text-sm text-gray-600'>
                    {foodRating} / 5
                  </span>
                )}
              </div>
            </Card>

            {/* Delivery Rating */}
            <Card className='p-6'>
              <h3 className='mb-4 font-semibold text-gray-900'>
                How was the delivery service?
              </h3>
              <div className='flex items-center gap-4'>
                {renderStars(
                  deliveryRating,
                  setDeliveryRating,
                  deliveryHover,
                  setDeliveryHover,
                )}
                {deliveryRating > 0 && (
                  <span className='text-sm text-gray-600'>
                    {deliveryRating} / 5
                  </span>
                )}
              </div>
            </Card>

            {/* Comment */}
            <Card className='p-6'>
              <h3 className='mb-4 font-semibold text-gray-900'>
                Additional Comments (Optional)
              </h3>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder='Tell us more about your experience...'
                rows={5}
                className='w-full rounded-lg border border-gray-300 p-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none'
              />
              <p className='mt-2 text-xs text-gray-500'>
                Your feedback is valuable and helps us improve our service
              </p>
            </Card>

            {/* Submit Button */}
            <div className='flex gap-3'>
              <Button
                variant='outline'
                onClick={() => navigate('/orders')}
                className='flex-1'
                disabled={submitting}
              >
                Skip for Now
              </Button>
              <Button
                onClick={handleSubmitRating}
                className='flex-1 bg-orange-500 hover:bg-orange-600'
                disabled={submitting || overallRating === 0}
              >
                {submitting ? 'Submitting...' : 'Submit Rating'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderRating;
