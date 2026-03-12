import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layouts/Sidebar';
import { Card } from '@/components/ui/card';
import {
  DollarSign,
  Package,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useRestaurantContext } from '@/hooks/restaurant/useRestaurantContext';

interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  averageRating: number;
  totalOrders: number;
  pendingOrders: number;
  completedToday: number;
}

interface OrderChart {
  date: string;
  orders: number;
  revenue: number;
}

const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const { selectedRestaurant } = useRestaurantContext();

  const [stats] = useState<DashboardStats>({
    todayOrders: 24,
    todayRevenue: 1840000,
    averageRating: 4.7,
    totalOrders: 1256,
    pendingOrders: 5,
    completedToday: 19,
  });

  const [chartData] = useState<OrderChart[]>([
    { date: 'Mon', orders: 32, revenue: 2400000 },
    { date: 'Tue', orders: 28, revenue: 2100000 },
    { date: 'Wed', orders: 35, revenue: 2650000 },
    { date: 'Thu', orders: 30, revenue: 2300000 },
    { date: 'Fri', orders: 42, revenue: 3200000 },
    { date: 'Sat', orders: 48, revenue: 3600000 },
    { date: 'Sun', orders: 38, revenue: 2900000 },
  ]);

  useEffect(() => {
    // TODO: Fetch dashboard stats for selectedRestaurant
    if (selectedRestaurant) {
      const fetchDashboardStats = async () => {
        try {
          // Example: await dashboardService.getStats(selectedRestaurant.restaurant_id);
          // Simulate fetch
        } catch (error: any) {
          let errorMessage = 'Failed to fetch dashboard stats.';
          if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error?.message) {
            errorMessage = error.message;
          }
          toast.error(errorMessage);
        }
      };
      fetchDashboardStats();
    }
  }, [selectedRestaurant]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const maxOrders = Math.max(...chartData.map((d) => d.orders));

  if (!selectedRestaurant) {
    return (
      <div className='flex min-h-screen bg-gray-50'>
        <Sidebar />
        <main className='ml-64 flex flex-1 items-center justify-center'>
          <Card className='max-w-md p-8 text-center'>
            <AlertCircle size={48} className='mx-auto mb-4 text-orange-500' />
            <h3 className='mb-2 text-xl font-bold text-gray-900'>
              No Restaurant Selected
            </h3>
            <p className='mb-6 text-gray-600'>
              Please select a restaurant to view the dashboard
            </p>
            <button
              onClick={() => navigate('/restaurant/settings')}
              className='rounded-lg bg-blue-500 px-6 py-2 font-medium text-white hover:bg-blue-600'
            >
              Select Restaurant
            </button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />

      <main className='mt-4 ml-64 flex-1 pr-8'>
        <div className='container mx-auto max-w-7xl px-6 py-6 text-left'>
          {/* Header */}
          <div className='mb-6'>
            <h1 className='mb-2 text-3xl font-bold text-gray-900'>
              {selectedRestaurant.name} - Dashboard
            </h1>
            <p className='mt-4 text-gray-600'>
              Overview of your restaurant performance
            </p>
          </div>

          {/* Stats Grid */}
          <div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {/* Today's Revenue */}
            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Today's Revenue
                  </p>
                  <p className='mt-2 text-3xl font-bold text-gray-900'>
                    {formatCurrency(stats.todayRevenue)}
                  </p>
                  <p className='mt-1 text-sm text-green-600'>
                    +12.5% from yesterday
                  </p>
                </div>
                <div className='rounded-full bg-green-100 p-3'>
                  <DollarSign className='text-green-600' size={28} />
                </div>
              </div>
            </Card>

            {/* Today's Orders */}
            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Today's Orders
                  </p>
                  <p className='mt-2 text-3xl font-bold text-gray-900'>
                    {stats.todayOrders}
                  </p>
                  <p className='mt-1 text-sm text-blue-600'>
                    {stats.pendingOrders} pending
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
                    Based on 1,256 reviews
                  </p>
                </div>
                <div className='rounded-full bg-orange-100 p-3'>
                  <Star className='fill-orange-600 text-orange-600' size={28} />
                </div>
              </div>
            </Card>

            {/* Total Orders */}
            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Total Orders
                  </p>
                  <p className='mt-2 text-3xl font-bold text-gray-900'>
                    {stats.totalOrders.toLocaleString()}
                  </p>
                  <p className='mt-1 text-sm text-gray-600'>All time</p>
                </div>
                <div className='rounded-full bg-purple-100 p-3'>
                  <TrendingUp className='text-purple-600' size={28} />
                </div>
              </div>
            </Card>

            {/* Pending Orders */}
            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Pending Orders
                  </p>
                  <p className='mt-2 text-3xl font-bold text-gray-900'>
                    {stats.pendingOrders}
                  </p>
                  <p className='mt-1 text-sm text-red-600'>Needs attention</p>
                </div>
                <div className='rounded-full bg-red-100 p-3'>
                  <Clock className='text-red-600' size={28} />
                </div>
              </div>
            </Card>

            {/* Completed Today */}
            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Completed Today
                  </p>
                  <p className='mt-2 text-3xl font-bold text-gray-900'>
                    {stats.completedToday}
                  </p>
                  <p className='mt-1 text-sm text-green-600'>
                    {((stats.completedToday / stats.todayOrders) * 100).toFixed(
                      0,
                    )}
                    % completion rate
                  </p>
                </div>
                <div className='rounded-full bg-green-100 p-3'>
                  <CheckCircle className='text-green-600' size={28} />
                </div>
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* Orders Chart */}
            <Card className='p-6'>
              <h3 className='mb-6 text-lg font-semibold text-gray-900'>
                Orders This Week
              </h3>
              <div className='space-y-4'>
                {chartData.map((day) => (
                  <div key={day.date}>
                    <div className='mb-2 flex items-center justify-between text-sm'>
                      <span className='font-medium text-gray-700'>
                        {day.date}
                      </span>
                      <span className='font-semibold text-gray-900'>
                        {day.orders} orders
                      </span>
                    </div>
                    <div className='h-2 w-full rounded-full bg-gray-200'>
                      <div
                        className='h-2 rounded-full bg-orange-500'
                        style={{
                          width: `${(day.orders / maxOrders) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Revenue Chart */}
            <Card className='p-6'>
              <h3 className='mb-6 text-lg font-semibold text-gray-900'>
                Revenue This Week
              </h3>
              <div className='space-y-4'>
                {chartData.map((day) => (
                  <div key={day.date}>
                    <div className='mb-2 flex items-center justify-between text-sm'>
                      <span className='font-medium text-gray-700'>
                        {day.date}
                      </span>
                      <span className='font-semibold text-gray-900'>
                        {formatCurrency(day.revenue)}
                      </span>
                    </div>
                    <div className='h-2 w-full rounded-full bg-gray-200'>
                      <div
                        className='h-2 rounded-full bg-green-500'
                        style={{
                          width: `${(day.revenue / 3600000) * 100}%`,
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

export default RestaurantDashboard;
