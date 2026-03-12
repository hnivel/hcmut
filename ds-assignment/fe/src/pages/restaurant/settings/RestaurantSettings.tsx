import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layouts/Sidebar';
import { Card } from '@/components/ui/card';
import {
  Plus,
  Settings,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { restaurantService } from '@/services/restaurants/restaurant.tsx';
import { useRestaurantContext } from '@/hooks/restaurant/useRestaurantContext';
import { useAuth } from '@/hooks/auth/useAuth';
import type { Restaurant } from '@/services/restaurants/restaurant.interface';

const RestaurantSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    restaurants,
    setRestaurants,
    setSelectedRestaurant,
    selectedRestaurant,
  } = useRestaurantContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.userId) {
      fetchRestaurants();
    }
  }, [user?.userId]);

  const fetchRestaurants = async () => {
    if (!user?.userId) {
      setError('User not authenticated');
      toast.error('User not authenticated');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await restaurantService.getMyRestaurants(user.userId);
      setRestaurants(response.data);
    } catch (err: any) {
      console.error('Failed to fetch restaurants:', err);
      let errorMessage = 'Failed to load restaurants';
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    navigate(`/restaurant/edit/${restaurant.restaurant_id}`);
  };

  const handleCreateRestaurant = () => {
    // Example validator before navigation
    // You can add more fields as needed
    if (restaurants.length >= 5) {
      toast.error('You can only create up to 5 restaurants.');
      return;
    }
    navigate('/restaurant/create');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-100 text-green-700';
      case 'CLOSED':
        return 'bg-red-100 text-red-700';
      case 'TEMPORARILY_CLOSED':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'Open';
      case 'CLOSED':
        return 'Closed';
      case 'TEMPORARILY_CLOSED':
        return 'Temporarily Closed';
      default:
        return status;
    }
  };

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />

      <main className='ml-64 flex-1'>
        <div className='container mx-auto max-w-6xl px-6 py-6 text-left'>
          {/* Header */}
          <div className='mb-6 flex items-center justify-between'>
            <div>
              <h1 className='mb-2 text-3xl font-bold text-gray-900'>
                My Restaurants
              </h1>
              <p className='text-gray-600'>
                Select a restaurant to manage or create a new one
              </p>
            </div>
            <button
              onClick={handleCreateRestaurant}
              className='flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600'
            >
              <Plus size={20} />
              Create Restaurant
            </button>
          </div>

          {/* Error State */}
          {error && (
            <Card className='mb-6 border-red-200 bg-red-50 p-4'>
              <p className='text-red-700'>{error}</p>
            </Card>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className='flex items-center justify-center py-12'>
              <div className='text-center'>
                <div className='mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent'></div>
                <p className='text-gray-600'>Loading restaurants...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && restaurants.length === 0 && (
            <Card className='p-12 text-center'>
              <div className='mb-4 flex justify-center'>
                <Settings size={64} className='text-gray-400' />
              </div>
              <h3 className='mb-2 text-xl font-bold text-gray-900'>
                No Restaurants Yet
              </h3>
              <p className='mb-6 text-gray-600'>
                Get started by creating your first restaurant
              </p>
              <button
                onClick={handleCreateRestaurant}
                className='inline-flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 font-medium text-white hover:bg-blue-600'
              >
                <Plus size={20} />
                Create Your First Restaurant
              </button>
            </Card>
          )}

          {/* Restaurants Grid */}
          {!isLoading && restaurants.length > 0 && (
            <>
              {selectedRestaurant && (
                <Card className='mb-6 border-blue-200 bg-blue-50 p-4'>
                  <div className='flex items-center gap-2'>
                    <Settings size={20} className='text-blue-600' />
                    <p className='text-sm font-medium text-blue-900'>
                      Currently managing:{' '}
                      <span className='font-bold'>
                        {selectedRestaurant.name}
                      </span>
                    </p>
                  </div>
                </Card>
              )}

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                {restaurants.map((restaurant) => (
                  <Card
                    key={restaurant.restaurant_id}
                    className={`cursor-pointer overflow-hidden transition hover:shadow-lg ${
                      selectedRestaurant?.restaurant_id ===
                      restaurant.restaurant_id
                        ? 'ring-2 ring-blue-500'
                        : ''
                    }`}
                    onClick={() => handleSelectRestaurant(restaurant)}
                  >
                    {restaurant.image_url && (
                      <img
                        src={restaurant.image_url}
                        alt={restaurant.name}
                        className='h-40 w-full object-cover'
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    <div className='p-6'>
                      <div className='mb-3 flex items-start justify-between'>
                        <div className='flex-1'>
                          <h3 className='mb-1 text-xl font-bold text-gray-900'>
                            {restaurant.name}
                          </h3>
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(restaurant.status)}`}
                          >
                            {getStatusText(restaurant.status)}
                          </span>
                        </div>
                        <ChevronRight className='text-gray-400' size={24} />
                      </div>

                      {restaurant.description && (
                        <p className='mb-3 line-clamp-2 text-sm text-gray-600'>
                          {restaurant.description}
                        </p>
                      )}

                      <div className='space-y-2 text-sm text-gray-600'>
                        {restaurant.address_details && (
                          <div className='flex items-center gap-2'>
                            <MapPin size={16} className='text-gray-400' />
                            <span className='line-clamp-1'>
                              {restaurant.address_details}
                            </span>
                          </div>
                        )}
                        {restaurant.phone && (
                          <div className='flex items-center gap-2'>
                            <Phone size={16} className='text-gray-400' />
                            <span>{restaurant.phone}</span>
                          </div>
                        )}
                        {restaurant.email && (
                          <div className='flex items-center gap-2'>
                            <Mail size={16} className='text-gray-400' />
                            <span>{restaurant.email}</span>
                          </div>
                        )}
                      </div>

                      {restaurant.average_rating && (
                        <div className='mt-3 flex items-center gap-2 border-t pt-3'>
                          <span className='font-semibold text-gray-900'>
                            {restaurant.average_rating.toFixed(1)}
                          </span>
                          <span className='text-gray-600'>
                            ({restaurant.total_reviews || 0} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default RestaurantSettings;
