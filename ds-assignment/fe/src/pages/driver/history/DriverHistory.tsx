import { useState } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import { Card } from '@/components/ui/card';
import {
  Package,
  Calendar,
  DollarSign,
  Star,
  MapPin,
  Clock,
} from 'lucide-react';

interface DeliveryHistoryItem {
  order_id: string;
  order_number: string;
  date: string;
  restaurant_name: string;
  customer_name: string;
  delivery_address: string;
  delivery_fee: number;
  tip: number;
  rating: number;
  distance: string;
  duration: string;
}

const DriverHistory = () => {
  const [history] = useState<DeliveryHistoryItem[]>([
    {
      order_id: '1',
      order_number: '#1000',
      date: '2024-12-03',
      restaurant_name: 'Golden Spoon',
      customer_name: 'Nguyen Van A',
      delivery_address: '456 Le Loi St, District 1',
      delivery_fee: 25000,
      tip: 10000,
      rating: 5,
      distance: '2.3 km',
      duration: '18 mins',
    },
    {
      order_id: '2',
      order_number: '#999',
      date: '2024-12-03',
      restaurant_name: 'Pho Heaven',
      customer_name: 'Tran Thi B',
      delivery_address: '789 Pasteur St, District 3',
      delivery_fee: 30000,
      tip: 15000,
      rating: 5,
      distance: '3.1 km',
      duration: '22 mins',
    },
    {
      order_id: '3',
      order_number: '#998',
      date: '2024-12-03',
      restaurant_name: 'Sushi Master',
      customer_name: 'Le Van C',
      delivery_address: '321 Dong Khoi St, District 1',
      delivery_fee: 20000,
      tip: 5000,
      rating: 4,
      distance: '1.8 km',
      duration: '15 mins',
    },
    {
      order_id: '4',
      order_number: '#997',
      date: '2024-12-02',
      restaurant_name: 'Pizza Paradise',
      customer_name: 'Pham Thi D',
      delivery_address: '654 Tran Hung Dao St, District 5',
      delivery_fee: 35000,
      tip: 20000,
      rating: 5,
      distance: '4.5 km',
      duration: '28 mins',
    },
    {
      order_id: '5',
      order_number: '#996',
      date: '2024-12-02',
      restaurant_name: 'Burger Brothers',
      customer_name: 'Hoang Van E',
      delivery_address: '567 Hai Ba Trung St, District 3',
      delivery_fee: 28000,
      tip: 12000,
      rating: 4,
      distance: '2.9 km',
      duration: '20 mins',
    },
    {
      order_id: '6',
      order_number: '#995',
      date: '2024-12-02',
      restaurant_name: 'Thai Spice',
      customer_name: 'Nguyen Thi F',
      delivery_address: '890 Vo Van Tan St, District 3',
      delivery_fee: 22000,
      tip: 8000,
      rating: 5,
      distance: '2.1 km',
      duration: '16 mins',
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const filteredHistory = history.filter((item) => {
    if (filter === 'today') {
      return item.date === '2024-12-03';
    } else if (filter === 'week') {
      return true; // All items are within a week for demo
    }
    return true;
  });

  const totalEarnings = filteredHistory.reduce(
    (sum, item) => sum + item.delivery_fee + item.tip,
    0,
  );

  const totalDeliveries = filteredHistory.length;
  const avgRating =
    filteredHistory.reduce((sum, item) => sum + item.rating, 0) /
    filteredHistory.length;

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />

      <main className='ml-64 flex-1'>
        <div className='container mx-auto max-w-7xl px-6 py-6 text-left'>
          {/* Header */}
          <div className='mb-6'>
            <h1 className='mb-2 text-3xl font-bold text-gray-900'>
              Delivery History
            </h1>
            <p className='text-gray-600'>
              View your past deliveries and earnings
            </p>
          </div>

          {/* Filter */}
          <div className='mb-6 flex gap-2'>
            <button
              onClick={() => setFilter('all')}
              className={`rounded-lg px-4 py-2 font-medium transition ${
                filter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setFilter('today')}
              className={`rounded-lg px-4 py-2 font-medium transition ${
                filter === 'today'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setFilter('week')}
              className={`rounded-lg px-4 py-2 font-medium transition ${
                filter === 'week'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              This Week
            </button>
          </div>

          {/* Stats Summary */}
          <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-3'>
            <Card className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-full bg-green-100 p-2'>
                  <DollarSign className='text-green-600' size={24} />
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Total Earnings</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {formatCurrency(totalEarnings)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-full bg-blue-100 p-2'>
                  <Package className='text-blue-600' size={24} />
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Total Deliveries</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {totalDeliveries}
                  </p>
                </div>
              </div>
            </Card>

            <Card className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-full bg-orange-100 p-2'>
                  <Star className='fill-orange-600 text-orange-600' size={24} />
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Average Rating</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {avgRating.toFixed(1)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* History List */}
          <div className='space-y-4'>
            {filteredHistory.map((item) => (
              <Card key={item.order_id} className='p-6'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='mb-3 flex items-center gap-3'>
                      <h3 className='text-lg font-bold text-gray-900'>
                        {item.order_number}
                      </h3>
                      <span className='rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700'>
                        Completed
                      </span>
                      <div className='flex items-center gap-1'>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < item.rating
                                ? 'fill-orange-500 text-orange-500'
                                : 'text-gray-300'
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <div className='flex items-center gap-2 text-gray-600'>
                          <Calendar size={18} />
                          <span className='text-sm'>
                            {formatDate(item.date)}
                          </span>
                        </div>
                        <div className='flex items-center gap-2 text-gray-600'>
                          <Package size={18} />
                          <span className='text-sm'>
                            {item.restaurant_name}
                          </span>
                        </div>
                        <div className='flex items-center gap-2 text-gray-600'>
                          <MapPin size={18} />
                          <span className='text-sm'>{item.customer_name}</span>
                        </div>
                        <div className='flex items-start gap-2 text-gray-600'>
                          <MapPin size={18} className='mt-0.5' />
                          <span className='text-sm'>
                            {item.delivery_address}
                          </span>
                        </div>
                      </div>

                      <div className='space-y-2'>
                        <div className='flex items-center gap-2 text-gray-600'>
                          <Clock size={18} />
                          <span className='text-sm'>
                            {item.distance} • {item.duration}
                          </span>
                        </div>
                        <div className='mt-3 rounded-lg bg-gray-50 p-3'>
                          <div className='flex justify-between text-sm'>
                            <span className='text-gray-600'>Delivery Fee:</span>
                            <span className='font-medium text-gray-900'>
                              {formatCurrency(item.delivery_fee)}
                            </span>
                          </div>
                          <div className='flex justify-between text-sm'>
                            <span className='text-gray-600'>Tip:</span>
                            <span className='font-medium text-green-600'>
                              {formatCurrency(item.tip)}
                            </span>
                          </div>
                          <div className='mt-2 border-t pt-2'>
                            <div className='flex justify-between'>
                              <span className='font-semibold text-gray-700'>
                                Total:
                              </span>
                              <span className='text-lg font-bold text-green-600'>
                                {formatCurrency(item.delivery_fee + item.tip)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DriverHistory;
