import { useState, useEffect } from 'react';
import { RestaurantContext } from './RestaurantContext';
import type { Restaurant } from '@/services/restaurants/restaurant.interface';

interface RestaurantProviderProps {
  children: React.ReactNode;
}

export const RestaurantProvider = ({ children }: RestaurantProviderProps) => {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load selected restaurant from localStorage on mount
  useEffect(() => {
    const storedRestaurant = localStorage.getItem('selectedRestaurant');
    if (storedRestaurant) {
      try {
        setSelectedRestaurant(JSON.parse(storedRestaurant));
      } catch (error) {
        console.error('Failed to parse stored restaurant:', error);
        localStorage.removeItem('selectedRestaurant');
      }
    }
  }, []);

  // Save selected restaurant to localStorage when it changes
  useEffect(() => {
    if (selectedRestaurant) {
      localStorage.setItem(
        'selectedRestaurant',
        JSON.stringify(selectedRestaurant),
      );
    } else {
      localStorage.removeItem('selectedRestaurant');
    }
  }, [selectedRestaurant]);

  return (
    <RestaurantContext.Provider
      value={{
        selectedRestaurant,
        setSelectedRestaurant,
        restaurants,
        setRestaurants,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};
