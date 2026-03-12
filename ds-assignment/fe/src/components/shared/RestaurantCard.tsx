import { Star, MapPin } from 'lucide-react';
import { Card } from '../ui/card';
import type { Restaurant } from '@/services/restaurants/restaurant.interface';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick?: (restaurantId: string) => void;
}

export const RestaurantCard = ({
  restaurant,
  onClick,
}: RestaurantCardProps) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick(restaurant.restaurant_id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'text-green-600 bg-green-50';
      case 'CLOSED':
        return 'text-red-600 bg-red-50';
      case 'BUSY':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getFallbackImage = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    }
    const images = [
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
      'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg',
      'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg',
      'https://images.pexels.com/photos/247685/pexels-photo-247685.jpeg',
      'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg',
    ];
    const index = hash % images.length;
    return images[index];
  };

  return (
    <Card
      className='group cursor-pointer overflow-hidden transition-all hover:shadow-lg'
      onClick={handleCardClick}
    >
      <div className='relative'>
        <div className='aspect-video w-full overflow-hidden bg-gray-200'>
          <img
            src={
              restaurant.image_url || getFallbackImage(restaurant.restaurant_id)
            }
            alt={restaurant.name}
            className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
          />
        </div>

        {/* Status Badge */}
        <div
          className={`absolute top-2 left-2 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(restaurant.status)}`}
        >
          {restaurant.status}
        </div>
      </div>

      <div className='p-4'>
        <h3 className='mb-1 line-clamp-1 text-lg font-semibold text-gray-900'>
          {restaurant.name}
        </h3>

        {restaurant.description && (
          <p className='mb-3 line-clamp-2 text-sm text-gray-600'>
            {restaurant.description}
          </p>
        )}

        <div className='mb-3 flex items-center gap-4 text-sm text-gray-600'>
          <div className='flex items-center gap-1'>
            {restaurant.review_count === 0 ||
            restaurant.average_rating == null ? (
              <span className='text-gray-400'>No reviews</span>
            ) : (
              <>
                <Star size={16} className='fill-yellow-400 text-yellow-400' />
                <span className='font-medium'>
                  {restaurant.average_rating.toFixed(1)}
                </span>
                <span className='text-gray-400'>
                  ({restaurant.review_count})
                </span>
              </>
            )}
          </div>
        </div>

        {restaurant.address_details && (
          <div className='flex items-start gap-2 text-sm text-gray-500'>
            <MapPin size={16} className='mt-0.5 flex-shrink-0' />
            <span className='line-clamp-1'>{restaurant.address_details}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
