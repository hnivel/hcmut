import { useState } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import { Card } from '@/components/ui/card';
import {
  DollarSign,
  Package,
  TrendingUp,
  MapPin,
  Clock,
  Star,
} from 'lucide-react';

interface DriverStats {
  todayEarnings: number;
  todayDeliveries: number;
  activeDeliveries: number;
  totalDeliveries: number;
  averageRating: number;
  completionRate: number;
}

interface EarningsChart {
  date: string;
  earnings: number;
  deliveries: number;
}

const DriverDashboard = () => {
  const [stats] = useState<DriverStats>({
    todayEarnings: 450000,
    todayDeliveries: 12,
    activeDeliveries: 2,
    totalDeliveries: 387,
    averageRating: 4.8,
    completionRate: 98.5,
  });

  const [chartData] = useState<EarningsChart[]>([
    { date: 'Mon', earnings: 380000, deliveries: 10 },
    { date: 'Tue', earnings: 420000, deliveries: 11 },
    { date: 'Wed', earnings: 510000, deliveries: 14 },
    { date: 'Thu', earnings: 390000, deliveries: 10 },
    { date: 'Fri', earnings: 580000, deliveries: 16 },
    { date: 'Sat', earnings: 620000, deliveries: 18 },
    { date: 'Sun', earnings: 540000, deliveries: 15 },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const maxEarnings = Math.max(...chartData.map((d) => d.earnings));

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />

      <main className='ml-64 flex-1'>
        <div className='container mx-auto max-w-7xl px-6 py-6 text-left'>
          {/* Header */}
          <div className='mb-6'>
            <h1 className='mb-2 text-3xl font-bold text-gray-900'>
              Driver Dashboard
            </h1>
            <p className='text-gray-600'>
              Overview of your delivery performance
            </p>
          </div>

          {/* Stats Grid */}
          <div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {/* Today's Earnings */}
            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Today's Earnings
                  </p>
                  <p className='mt-2 text-3xl font-bold text-gray-900'>
                    {formatCurrency(stats.todayEarnings)}
                  </p>
                  <p className='mt-1 text-sm text-green-600'>
                    +15% from yesterday
                  </p>
                </div>
                <div className='rounded-full bg-green-100 p-3'>
                  <DollarSign className='text-green-600' size={28} />
                </div>
              </div>
            </Card>

            {/* Today's Deliveries */}
            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Today's Deliveries
                  </p>
                  <p className='mt-2 text-3xl font-bold text-gray-900'>
                    {stats.todayDeliveries}
                  </p>
                  <p className='mt-1 text-sm text-blue-600'>
                    {stats.activeDeliveries} active
                  </p>
                </div>
                <div className='rounded-full bg-blue-100 p-3'>
                  <Package className='text-blue-600' size={28} />
                </div>
              </div>
            </Card>

            {/* Average Rating */}
            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Average Rating
                  </p>
                  <p className='mt-2 text-3xl font-bold text-gray-900'>
                    {stats.averageRating}
                  </p>
                  <p className='mt-1 text-sm text-orange-600'>
                    Based on {stats.totalDeliveries} deliveries
                  </p>
                </div>
                <div className='rounded-full bg-orange-100 p-3'>
                  <Star className='fill-orange-600 text-orange-600' size={28} />
                </div>
              </div>
            </Card>

            {/* Total Deliveries */}
            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Total Deliveries
                  </p>
                  <p className='mt-2 text-3xl font-bold text-gray-900'>
                    {stats.totalDeliveries}
                  </p>
                  <p className='mt-1 text-sm text-gray-600'>All time</p>
                </div>
                <div className='rounded-full bg-purple-100 p-3'>
                  <TrendingUp className='text-purple-600' size={28} />
                </div>
              </div>
            </Card>

            {/* Active Deliveries */}
            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Active Deliveries
                  </p>
                  <p className='mt-2 text-3xl font-bold text-gray-900'>
                    {stats.activeDeliveries}
                  </p>
                  <p className='mt-1 text-sm text-blue-600'>In progress</p>
                </div>
                <div className='rounded-full bg-blue-100 p-3'>
                  <MapPin className='text-blue-600' size={28} />
                </div>
              </div>
            </Card>

            {/* Completion Rate */}
            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Completion Rate
                  </p>
                  <p className='mt-2 text-3xl font-bold text-gray-900'>
                    {stats.completionRate}%
                  </p>
                  <p className='mt-1 text-sm text-green-600'>
                    Excellent performance
                  </p>
                </div>
                <div className='rounded-full bg-green-100 p-3'>
                  <Clock className='text-green-600' size={28} />
                </div>
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* Earnings Chart */}
            <Card className='p-6'>
              <h3 className='mb-6 text-lg font-semibold text-gray-900'>
                Earnings This Week
              </h3>
              <div className='space-y-4'>
                {chartData.map((day) => (
                  <div key={day.date}>
                    <div className='mb-2 flex items-center justify-between text-sm'>
                      <span className='font-medium text-gray-700'>
                        {day.date}
                      </span>
                      <span className='font-semibold text-gray-900'>
                        {formatCurrency(day.earnings)}
                      </span>
                    </div>
                    <div className='h-2 w-full rounded-full bg-gray-200'>
                      <div
                        className='h-2 rounded-full bg-green-500'
                        style={{
                          width: `${(day.earnings / maxEarnings) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Deliveries Chart */}
            <Card className='p-6'>
              <h3 className='mb-6 text-lg font-semibold text-gray-900'>
                Deliveries This Week
              </h3>
              <div className='space-y-4'>
                {chartData.map((day) => (
                  <div key={day.date}>
                    <div className='mb-2 flex items-center justify-between text-sm'>
                      <span className='font-medium text-gray-700'>
                        {day.date}
                      </span>
                      <span className='font-semibold text-gray-900'>
                        {day.deliveries} deliveries
                      </span>
                    </div>
                    <div className='h-2 w-full rounded-full bg-gray-200'>
                      <div
                        className='h-2 rounded-full bg-blue-500'
                        style={{
                          width: `${(day.deliveries / 18) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DriverDashboard;
