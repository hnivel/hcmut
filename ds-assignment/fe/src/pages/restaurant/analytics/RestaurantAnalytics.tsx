import { useState, useEffect } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import { RequireRestaurant } from '@/components/layouts/RequireRestaurant';
import { Card } from '@/components/ui/card';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Star,
  Users,
  Clock,
} from 'lucide-react';
import { useRestaurantContext } from '@/hooks/restaurant/useRestaurantContext';

interface RevenueData {
  period: string;
  revenue: number;
  orders: number;
}

interface PopularItem {
  name: string;
  orders: number;
  revenue: number;
}

interface PeakHour {
  hour: string;
  orders: number;
}

const RestaurantAnalytics = () => {
  const { selectedRestaurant } = useRestaurantContext();
  const [revenueData] = useState<RevenueData[]>([
    { period: 'Jan', revenue: 42000000, orders: 850 },
    { period: 'Feb', revenue: 38000000, orders: 780 },
    { period: 'Mar', revenue: 45000000, orders: 920 },
    { period: 'Apr', revenue: 51000000, orders: 1050 },
    { period: 'May', revenue: 48000000, orders: 980 },
    { period: 'Jun', revenue: 54000000, orders: 1120 },
  ]);

  const [popularItems] = useState<PopularItem[]>([
    { name: 'Pho Bo', orders: 245, revenue: 15925000 },
    { name: 'Com Tam', orders: 198, revenue: 10890000 },
    { name: 'Bun Cha', orders: 176, revenue: 10560000 },
    { name: 'Banh Mi', orders: 142, revenue: 4970000 },
    { name: 'Goi Cuon', orders: 128, revenue: 5760000 },
  ]);

  const [peakHours] = useState<PeakHour[]>([
    { hour: '6:00', orders: 12 },
    { hour: '7:00', orders: 28 },
    { hour: '8:00', orders: 35 },
    { hour: '9:00', orders: 24 },
    { hour: '10:00', orders: 18 },
    { hour: '11:00', orders: 45 },
    { hour: '12:00', orders: 68 },
    { hour: '13:00', orders: 52 },
    { hour: '14:00', orders: 32 },
    { hour: '15:00', orders: 22 },
    { hour: '16:00', orders: 28 },
    { hour: '17:00', orders: 42 },
    { hour: '18:00', orders: 65 },
    { hour: '19:00', orders: 58 },
    { hour: '20:00', orders: 38 },
    { hour: '21:00', orders: 25 },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = revenueData.reduce((sum, item) => sum + item.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;
  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));
  const maxOrders = Math.max(...peakHours.map((h) => h.orders));

  return (
    <RequireRestaurant>
      <div className='flex min-h-screen bg-gray-50'>
        <Sidebar />

        <main className='ml-64 flex-1'>
          <div className='container mx-auto max-w-7xl px-6 py-6 text-left'>
            {/* Header */}
            <div className='mb-6'>
              <h1 className='mb-2 text-3xl font-bold text-gray-900'>
                {selectedRestaurant?.name} - Analytics
              </h1>
              <p className='text-gray-600'>
                Detailed insights into your restaurant performance
              </p>
            </div>

            {/* Key Metrics */}
            <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <Card className='p-4'>
                <div className='mb-2 flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>Total Revenue</span>
                  <div className='rounded-full bg-green-100 p-2'>
                    <DollarSign className='text-green-600' size={18} />
                  </div>
                </div>
                <p className='text-2xl font-bold text-gray-900'>
                  {formatCurrency(totalRevenue)}
                </p>
                <p className='mt-1 flex items-center text-sm text-green-600'>
                  <TrendingUp size={14} className='mr-1' />
                  +12.5% from last period
                </p>
              </Card>

              <Card className='p-4'>
                <div className='mb-2 flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>Total Orders</span>
                  <div className='rounded-full bg-blue-100 p-2'>
                    <ShoppingBag className='text-blue-600' size={18} />
                  </div>
                </div>
                <p className='text-2xl font-bold text-gray-900'>
                  {totalOrders}
                </p>
                <p className='mt-1 flex items-center text-sm text-green-600'>
                  <TrendingUp size={14} className='mr-1' />
                  +8.3% from last period
                </p>
              </Card>

              <Card className='p-4'>
                <div className='mb-2 flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>Avg Order Value</span>
                  <div className='rounded-full bg-purple-100 p-2'>
                    <Users className='text-purple-600' size={18} />
                  </div>
                </div>
                <p className='text-2xl font-bold text-gray-900'>
                  {formatCurrency(avgOrderValue)}
                </p>
                <p className='mt-1 flex items-center text-sm text-green-600'>
                  <TrendingUp size={14} className='mr-1' />
                  +3.8% from last period
                </p>
              </Card>

              <Card className='p-4'>
                <div className='mb-2 flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>Customer Rating</span>
                  <div className='rounded-full bg-orange-100 p-2'>
                    <Star
                      className='fill-orange-600 text-orange-600'
                      size={18}
                    />
                  </div>
                </div>
                <p className='text-2xl font-bold text-gray-900'>4.7</p>
                <p className='mt-1 text-sm text-gray-600'>
                  Based on 1,234 reviews
                </p>
              </Card>
            </div>

            {/* Revenue & Orders Chart */}
            <Card className='mb-6 p-6'>
              <h2 className='mb-4 text-lg font-bold text-gray-900'>
                Revenue & Orders Trend
              </h2>
              <div className='space-y-4'>
                {revenueData.map((data) => (
                  <div key={data.period}>
                    <div className='mb-1 flex items-center justify-between text-sm'>
                      <span className='font-medium text-gray-700'>
                        {data.period}
                      </span>
                      <div className='flex gap-4'>
                        <span className='text-green-600'>
                          {formatCurrency(data.revenue)}
                        </span>
                        <span className='text-blue-600'>
                          {data.orders} orders
                        </span>
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <div className='flex-1'>
                        <div className='h-3 w-full overflow-hidden rounded-full bg-gray-200'>
                          <div
                            className='h-full rounded-full bg-green-500'
                            style={{
                              width: `${(data.revenue / maxRevenue) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              {/* Popular Items */}
              <Card className='p-6'>
                <h2 className='mb-4 text-lg font-bold text-gray-900'>
                  Top Selling Items
                </h2>
                <div className='space-y-4'>
                  {popularItems.map((item, index) => (
                    <div
                      key={item.name}
                      className='flex items-center justify-between'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600'>
                          {index + 1}
                        </div>
                        <div>
                          <p className='font-medium text-gray-900'>
                            {item.name}
                          </p>
                          <p className='text-sm text-gray-600'>
                            {item.orders} orders
                          </p>
                        </div>
                      </div>
                      <span className='font-medium text-green-600'>
                        {formatCurrency(item.revenue)}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Peak Hours */}
              <Card className='p-6'>
                <h2 className='mb-4 flex items-center gap-2 text-lg font-bold text-gray-900'>
                  <Clock size={20} />
                  Peak Hours Analysis
                </h2>
                <div className='space-y-2'>
                  {peakHours.map((hour) => (
                    <div key={hour.hour} className='flex items-center gap-3'>
                      <span className='w-16 text-sm font-medium text-gray-700'>
                        {hour.hour}
                      </span>
                      <div className='flex-1'>
                        <div className='h-6 overflow-hidden rounded-full bg-gray-200'>
                          <div
                            className='flex h-full items-center justify-end rounded-full bg-blue-500 px-2 text-xs font-medium text-white'
                            style={{
                              width: `${(hour.orders / maxOrders) * 100}%`,
                            }}
                          >
                            {hour.orders > 30 && `${hour.orders}`}
                          </div>
                        </div>
                      </div>
                      <span className='w-12 text-right text-sm text-gray-600'>
                        {hour.orders}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Customer Insights */}
            <Card className='mt-6 p-6'>
              <h2 className='mb-4 text-lg font-bold text-gray-900'>
                Customer Insights
              </h2>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                <div className='rounded-lg bg-blue-50 p-4'>
                  <div className='mb-2 flex items-center gap-2'>
                    <Users className='text-blue-600' size={20} />
                    <span className='font-medium text-gray-900'>
                      New Customers
                    </span>
                  </div>
                  <p className='text-2xl font-bold text-blue-600'>342</p>
                  <p className='text-sm text-gray-600'>This month</p>
                </div>

                <div className='rounded-lg bg-green-50 p-4'>
                  <div className='mb-2 flex items-center gap-2'>
                    <Users className='text-green-600' size={20} />
                    <span className='font-medium text-gray-900'>
                      Returning Customers
                    </span>
                  </div>
                  <p className='text-2xl font-bold text-green-600'>892</p>
                  <p className='text-sm text-gray-600'>This month</p>
                </div>

                <div className='rounded-lg bg-orange-50 p-4'>
                  <div className='mb-2 flex items-center gap-2'>
                    <Star
                      className='fill-orange-600 text-orange-600'
                      size={20}
                    />
                    <span className='font-medium text-gray-900'>
                      Customer Retention
                    </span>
                  </div>
                  <p className='text-2xl font-bold text-orange-600'>72.3%</p>
                  <p className='text-sm text-gray-600'>Average rate</p>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </RequireRestaurant>
  );
};

export default RestaurantAnalytics;
