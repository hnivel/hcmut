import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { RestaurantSearchParams } from '@/services/restaurants/restaurant.interface';

export interface RestaurantFiltersProps {
  filters: RestaurantSearchParams;
  onFiltersChange: (filters: Partial<RestaurantSearchParams>) => void;
  onClearFilters: () => void;
}

export const RestaurantFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
}: RestaurantFiltersProps) => {
  const [localFilters, setLocalFilters] =
    useState<RestaurantSearchParams>(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
  };

  const handleReset = () => {
    setLocalFilters({});
    onClearFilters();
  };

  return (
    <div className='space-y-4 rounded-lg border p-4 bg-white shadow-md'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>Filters</h3>
        <Button variant='outline' size='sm' onClick={handleReset}>
          Clear All
        </Button>
      </div>

      <div className='grid gap-4 grid-cols-1'>
        {/* Status Filter */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Status</label>
          <Select
            value={localFilters.status || 'all'}
            onValueChange={(value) =>
              setLocalFilters((prev) => ({
                ...prev,
                status:
                  value === 'all'
                    ? undefined
                    : (value as 'OPEN' | 'CLOSED' | 'TEMPORARILY_CLOSED'),
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Select status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All</SelectItem>
              <SelectItem value='OPEN'>Open</SelectItem>
              <SelectItem value='CLOSED'>Closed</SelectItem>
              <SelectItem value='TEMPORARILY_CLOSED'>
                Temporarily Closed
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Minimum Rating Filter */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Minimum Rating</label>
          <Select
            value={localFilters.minRating?.toString() || 'all'}
            onValueChange={(value) =>
              setLocalFilters((prev) => ({
                ...prev,
                minRating: value === 'all' ? undefined : Number(value),
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Select rating' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All</SelectItem>
              <SelectItem value='4'>4+ Stars</SelectItem>
              <SelectItem value='3'>3+ Stars</SelectItem>
              <SelectItem value='2'>2+ Stars</SelectItem>
              <SelectItem value='1'>1+ Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Radius */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Radius (km)</label>
          <Input
            type='number'
            placeholder='Search radius'
            value={localFilters.radius || ''}
            onChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                radius: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
          />
        </div>
      </div>

      <Button onClick={handleApply} className='w-full bg-amber-600 text-white hover:bg-amber-700'>
        Apply Filters
      </Button>
    </div>
  );
};
