import { createContext } from 'react';
import type { RestaurantContextValue } from './restaurant.interface';

export const RestaurantContext = createContext<
  RestaurantContextValue | undefined
>(undefined);
