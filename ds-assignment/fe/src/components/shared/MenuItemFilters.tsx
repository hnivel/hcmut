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
import type { MenuItemSearchParams } from '@/services/menu/menu.interface';

export interface MenuItemFiltersProps {
  filters: MenuItemSearchParams;
  onFiltersChange: (filters: Partial<MenuItemSearchParams>) => void;
  onClearFilters: () => void;
  categories?: string[];
}

export const MenuItemFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
  categories = [],
}: MenuItemFiltersProps) => {
  const [localFilters, setLocalFilters] =
    useState<MenuItemSearchParams>(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
  };

  const handleReset = () => {
    setLocalFilters({});
    onClearFilters();
  };

  return (
    <div className='space-y-4 rounded-lg border p-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>Filters</h3>
        <Button variant='outline' size='sm' onClick={handleReset}>
          Clear All
        </Button>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {/* Category Filter */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Category</label>
          <Select
            value={localFilters.category || 'all'}
            onValueChange={(value) =>
              setLocalFilters((prev) => ({
                ...prev,
                category: value === 'all' ? undefined : value,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Select category' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
                    : (value as 'AVAILABLE' | 'UNAVAILABLE'),
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Select status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All</SelectItem>
              <SelectItem value='AVAILABLE'>Available</SelectItem>
              <SelectItem value='UNAVAILABLE'>Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Min Price Filter */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Min Price</label>
          <Input
            type='number'
            placeholder='0'
            value={localFilters.minPrice || ''}
            onChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
          />
        </div>

        {/* Max Price Filter */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Max Price</label>
          <Input
            type='number'
            placeholder='Any'
            value={localFilters.maxPrice || ''}
            onChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
          />
        </div>
      </div>

      <Button onClick={handleApply} className='w-full'>
        Apply Filters
      </Button>
    </div>
  );
};
