import { Plus, Minus, Heart } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import type { MenuItem } from '@/services/menu/menu.interface';
import { useState } from 'react';

interface MenuItemCardProps {
  menuItem: MenuItem;
  onAddToCart?: (item: MenuItem, quantity: number) => void;
  cartQuantity?: number;
  isFavorite?: boolean;
  onFavoriteToggle?: (menuItemId: string, restaurantId: string) => void;
  onClick?: () => void;
}

export const MenuItemCard = ({
  menuItem,
  onAddToCart,
  cartQuantity = 0,
  isFavorite = false,
  onFavoriteToggle,
  onClick,
}: MenuItemCardProps) => {
  const [quantity, setQuantity] = useState(cartQuantity || 1);
  const isAvailable = menuItem.status === 'AVAILABLE';

  const getFallbackImage = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    }

    const images = [
      'https://images.pexels.com/photos/1435907/pexels-photo-1435907.jpeg',
      'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
      'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg',
      'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg',
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
      'https://images.pexels.com/photos/2232/vegetables-italian-pizza-restaurant.jpg',
      'https://images.pexels.com/photos/461303/pexels-photo-461303.jpeg',
      'https://images.pexels.com/photos/1600711/pexels-photo-1600711.jpeg',
      'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg',
      'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg',
    ];

    return images[hash % images.length];
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (onAddToCart && isAvailable) {
      onAddToCart(menuItem, quantity);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(menuItem.food_id, menuItem.restaurant_id);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-md ${!isAvailable ? 'opacity-60' : ''} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className='p-3'>
        {/* Top section: Image and Info side by side */}
        <div className='mb-3 flex gap-3'>
          {/* Image */}
          <div className='relative flex-shrink-0'>
            <div className='h-24 w-24 overflow-hidden rounded-lg bg-gray-200'>
              {menuItem.image_url ? (
                <img
                  src={menuItem.image_url}
                  alt={menuItem.name}
                  className='h-full w-full object-cover'
                />
              ) : (
                <img
                  src={getFallbackImage(menuItem.food_id)}
                  alt={menuItem.name}
                  className='h-full w-full object-cover'
                />
              )}
            </div>
            {!isAvailable && (
              <div className='absolute inset-0 flex items-center justify-center rounded-lg bg-black/50'>
                <span className='text-xs font-medium text-white'>
                  Unavailable
                </span>
              </div>
            )}
          </div>

          {/* Name, Description, Categories next to image */}
          <div className='relative flex-1'>
            {/* Favorite Button */}
            {onFavoriteToggle && (
              <Button
                size='icon'
                variant='ghost'
                className='absolute -top-1 -right-1 h-7 w-7'
                onClick={handleFavoriteClick}
              >
                <Heart
                  size={16}
                  className={
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                  }
                />
              </Button>
            )}
            <h3 className='line-clamp-1 pr-8 text-base font-semibold text-gray-900'>
              {menuItem.name}
            </h3>
            {menuItem.description && (
              <p className='mt-1 line-clamp-2 text-xs text-gray-600'>
                {menuItem.description}
              </p>
            )}
            {Array.isArray(menuItem.categories) &&
              menuItem.categories.length > 0 && (
                <div className='mt-1 flex flex-wrap gap-1'>
                  {menuItem.categories.map((cat) => (
                    <span
                      key={cat}
                      className='inline-block rounded-full bg-orange-50 px-2 py-0.5 text-xs text-orange-600'
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}
          </div>
        </div>

        {/* Bottom section: Price and Add button */}
        <div className='flex items-center justify-between'>
          <div className='text-lg font-bold text-orange-600'>
            {formatPrice(menuItem.price)}
          </div>

          {onAddToCart && isAvailable && (
            <div className='flex items-center gap-2'>
              {cartQuantity > 0 ? (
                <>
                  <Button
                    size='icon'
                    variant='outline'
                    className='h-7 w-7'
                    onClick={() => handleQuantityChange(-1)}
                  >
                    <Minus size={14} />
                  </Button>
                  <span className='min-w-[20px] text-center text-sm font-medium'>
                    {quantity}
                  </span>
                  <Button
                    size='icon'
                    variant='outline'
                    className='h-7 w-7'
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus size={14} />
                  </Button>
                </>
              ) : (
                <Button
                  size='sm'
                  className='h-8 bg-orange-500 hover:bg-orange-600'
                  onClick={handleAddToCart}
                >
                  <Plus size={14} className='mr-1' />
                  Add
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
