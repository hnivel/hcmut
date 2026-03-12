import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useRestaurants,
  useFeaturedRestaurants,
} from '@/hooks/restaurants/useRestaurants';
import type { RestaurantSearchParams } from '@/services/restaurants/restaurant.interface';
import { RestaurantCard } from '@/components/shared/RestaurantCard';
import { RestaurantFilters } from '@/components/shared/RestaurantFilters';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { SortableHeader } from '@/components/shared/SortableHeader';
import { SearchBar } from '@/components/shared/SearchBar';
import Sidebar from '@/components/layouts/Sidebar';
import { Filter, TrendingUp, X } from 'lucide-react';
import { usePagination } from '@/hooks/usePagination';
import { useSorting } from '@/hooks/useSorting';
import { useFilters } from '@/hooks/useFilters';

const Explore = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination, sorting, and filtering hooks
  const { page, limit, setPage, setLimit } = usePagination({
    initialLimit: 12,
  });
  const { sortBy, sortOrder, handleSort, toggleSortOrder } = useSorting({
    initialSortBy: '',
  });
  const { filters, setFilter, clearAllFilters, hasActiveFilters } = useFilters<
    Omit<
      RestaurantSearchParams,
      'page' | 'limit' | 'sortBy' | 'sortOrder' | 'search'
    >
  >({
    status: undefined,
    minRating: undefined,
    latitude: undefined,
    longitude: undefined,
    radius: undefined,
  });

  // Build query params
  const queryParams: RestaurantSearchParams = {
    page,
    limit,
    sortBy,
    sortOrder,
    search: searchQuery || undefined,
    ...filters,
  };

  // Fetch data using hooks
  const { data: restaurantsData, isLoading } = useRestaurants(queryParams);
  const { data: featuredData } = useFeaturedRestaurants(8);

  const restaurants = restaurantsData?.data || [];
  const meta = restaurantsData?.meta;
  const featuredRestaurants = featuredData || [];

  const handleRestaurantClick = (restaurantId: string) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page on search
  };

  const handleFiltersChange = (newFilters: Partial<RestaurantSearchParams>) => {
    Object.entries(newFilters).forEach(([key, value]) => {
      setFilter(key as any, value as any);
    });
    setPage(1); // Reset to first page on filter change
  };

  const handleClearFilters = () => {
    clearAllFilters();
    setSearchQuery('');
    setPage(1);
  };

  const handleSortChange = (field: string) => {
    if (field === sortBy) {
      // Toggle sort order
      toggleSortOrder();
    }
    handleSort(field);
    setPage(1); // Reset to first page on sort change
  };

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />

      <main className='mt-4 ml-64 flex-1 pr-8'>
        <div className='container mx-auto max-w-7xl px-4 py-6 text-left'>
          {/* Header */}
          <div className='mb-6'>
            <h1 className='mb-4 text-3xl font-bold text-orange-950'>
              Explore Restaurants
            </h1>
            <p className='text-stone-600'>
              Discover delicious food from restaurants around you
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className='mb-6 flex items-center gap-3'>
            <SearchBar
              placeholder='Search restaurants, dishes...'
              onSearch={handleSearchChange}
              className='flex-1'
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className='flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 transition hover:bg-stone-100'
            >
              <Filter size={18} />
              Filters
              {hasActiveFilters && (
                <span className='ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-400 text-xs text-white'>
                  !
                </span>
              )}
            </button>
          </div>

          {/* Active Filters Display */}
          {(hasActiveFilters || searchQuery) && (
            <div className='mb-2 flex flex-wrap items-center gap-2'>
              <span className='text-md font-medium text-stone-900'>
                Active filters:
              </span>
              {searchQuery && (
                <span className='flex items-center gap-2 rounded-full bg-orange-100 px-3 py-2 text-sm font-semibold text-orange-800'>
                  Search: {searchQuery}
                  <button onClick={() => handleSearchChange('')}>
                    <X size={14} />
                  </button>
                </span>
              )}
              {filters.status && (
                <span className='flex items-center gap-2 rounded-full bg-orange-100 px-3 py-2 text-sm font-semibold text-orange-800'>
                  Status: {filters.status}
                  <button onClick={() => setFilter('status', undefined)}>
                    <X size={14} />
                  </button>
                </span>
              )}
              {filters.minRating && (
                <span className='flex items-center gap-2 rounded-full bg-orange-100 px-3 py-2 text-sm font-semibold text-orange-800'>
                  Min Rating: {filters.minRating}+
                  <button onClick={() => setFilter('minRating', undefined)}>
                    <X size={14} />
                  </button>
                </span>
              )}
              {filters.radius && (
                <span className='flex items-center gap-2 rounded-full bg-orange-100 px-3 py-2 text-sm font-semibold text-orange-800'>
                  Within {filters.radius}km
                  <button onClick={() => setFilter('radius', undefined)}>
                    <X size={14} />
                  </button>
                </span>
              )}
              <button
                onClick={handleClearFilters}
                className='rounded-full bg-stone-100 px-3 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-300'
              >
                Clear all
              </button>
            </div>
          )}

          {/* Filters Panel */}
          {showFilters && (
            <div className='absolute top-48 right-12 z-40 mb-6 w-80'>
              <RestaurantFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={clearAllFilters}
              />
            </div>
          )}

          {/* Sorting Options */}
          <div className='mb-4 flex items-center gap-2'>
            <span className='text-md font-medium text-stone-900'>Sort by:</span>
            <SortableHeader
              label='Name'
              field='name'
              currentSortBy={sortBy}
              currentSortOrder={sortOrder}
              onSort={handleSortChange}
            />
            <SortableHeader
              label='Rating'
              field='rating'
              currentSortBy={sortBy}
              currentSortOrder={sortOrder}
              onSort={handleSortChange}
            />
          </div>

          {/* Featured Restaurants */}
          {!searchQuery &&
            !hasActiveFilters &&
            featuredRestaurants.length > 0 && (
              <div className='mb-8'>
                <div className='mb-4 flex items-center gap-2'>
                  <h2 className='text-2xl font-bold text-stone-900'>
                    Featured Restaurants
                  </h2>
                </div>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                  {featuredRestaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.restaurant_id}
                      restaurant={restaurant}
                      onClick={handleRestaurantClick}
                    />
                  ))}
                </div>
              </div>
            )}

          {/* All Restaurants */}
          <div>
            <h2 className='mb-4 text-2xl font-bold text-stone-900'>
              {searchQuery
                ? `Results for "${searchQuery}"`
                : hasActiveFilters
                  ? 'Filtered Restaurants'
                  : 'All Restaurants'}
              {meta && ` (${meta.total})`}
            </h2>

            {isLoading ? (
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className='h-64 animate-pulse rounded-lg bg-stone-200'
                  />
                ))}
              </div>
            ) : restaurants.length === 0 ? (
              <div className='rounded-lg bg-white px-4 py-12 text-center'>
                <p className='text-lg text-stone-500'>No restaurants found</p>
                <p className='mt-2 text-sm text-stone-400'>
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                  {restaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.restaurant_id}
                      restaurant={restaurant}
                      onClick={handleRestaurantClick}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                  <div className='mt-6'>
                    <PaginationControls
                      page={page}
                      limit={limit}
                      totalPages={meta.totalPages}
                      totalItems={meta.total}
                      onPageChange={setPage}
                      onLimitChange={setLimit}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Explore;
