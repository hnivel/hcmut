import type { Restaurant } from '@/services/restaurants/restaurant.interface';

export interface RestaurantContextValue {
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  restaurants: Restaurant[];
  setRestaurants: (restaurants: Restaurant[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}
