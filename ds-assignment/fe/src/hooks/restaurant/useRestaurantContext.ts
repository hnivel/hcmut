import { useContext } from 'react';
import { RestaurantContext } from '@/contexts/restaurant/RestaurantContext';

export const useRestaurantContext = () => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error(
      'useRestaurantContext must be used within a RestaurantProvider',
    );
  }
  return context;
};
