import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  useFavoriteMenuItems,
  useToggleFavoriteMenuItem,
} from '@/hooks/menu/useMenuItems';
import { MenuItemCard } from '@/components/shared/MenuItemCard';
import { SortableHeader } from '@/components/shared/SortableHeader';
import Sidebar from '@/components/layouts/Sidebar';
import { Heart } from 'lucide-react';
import type { MenuItem } from '@/services/menu/menu.interface';

const FavoriteRestaurants = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: 'name' | 'price') => {
    if (sortBy === field) {
      // Toggle direction when clicking same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Switch field and reset to asc
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Fetch favorite menu items (sorted by backend)
  const {
    data: favoriteMenuItems = [],
    isLoading,
    refetch,
  } = useFavoriteMenuItems(sortBy, sortOrder);
  const toggleFavoriteMenuItemMutation = useToggleFavoriteMenuItem();

  const handleToggleFavorite = async (
    menuItemId: string,
    restaurantId: string,
  ) => {
    try {
      await toggleFavoriteMenuItemMutation.mutateAsync({
        menuItemId,
        restaurantId,
      });
      toast.success('Favorite updated successfully');
      refetch();
    } catch (error: any) {
      console.error('Failed to toggle favorite:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to update favorite';
      toast.error(errorMessage);
    }
  };

  const handleMenuItemClick = (restaurantId: string) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  // Favorites are already sorted by backend
  const sortedFavorites = favoriteMenuItems as MenuItem[];

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />

      <main className='mt-4 ml-64 flex-1 pr-8'>
        <div className='container mx-auto max-w-7xl px-4 py-6 text-left'>
          {/* Header */}
          <div className='mb-6'>
            <div className='mb-2 flex items-center gap-3'>
              <h1 className='text-3xl font-bold text-orange-950'>
                Favorite Foods
              </h1>
            </div>
            <p className='mt-4 text-stone-600'>
              Your collection of favorite foods ({favoriteMenuItems.length})
            </p>
          </div>

          {/* Sorting Options */}
          {favoriteMenuItems.length > 0 && (
            <div className='mb-4 flex items-center gap-2 rounded-lg border bg-white p-3'>
              <span className='text-sm font-medium text-gray-700'>
                Sort by:
              </span>
              <SortableHeader
                label='Name'
                field='name'
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={handleSort}
              />
              <SortableHeader
                label='Price'
                field='price'
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={handleSort}
              />
            </div>
          )}

          {/* Favorites Grid */}
          {isLoading ? (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className='h-64 animate-pulse rounded-lg bg-gray-200'
                />
              ))}
            </div>
          ) : favoriteMenuItems.length === 0 ? (
            <div className='flex flex-col items-center py-20'>
              <Heart className='mb-4 text-gray-300' size={64} strokeWidth={1} />
              <h3 className='mb-2 text-xl font-semibold text-gray-700'>
                No Favorite Foods Yet
              </h3>
              <p className='mb-6 text-gray-500'>
                Start exploring and add foods to your favorites!
              </p>
              <button
                onClick={() => navigate('/')}
                className='rounded-lg bg-orange-500 px-6 py-2 text-white transition hover:bg-orange-600'
              >
                Explore Foods
              </button>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {sortedFavorites.map((menuItem) => (
                <MenuItemCard
                  key={`${menuItem.restaurant_id}:${menuItem.food_id}`}
                  menuItem={menuItem}
                  isFavorite={!!menuItem.is_favorited}
                  onFavoriteToggle={handleToggleFavorite}
                  onClick={() => handleMenuItemClick(menuItem.restaurant_id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FavoriteRestaurants;
