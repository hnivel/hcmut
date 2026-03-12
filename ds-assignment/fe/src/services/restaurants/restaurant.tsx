import api from '../api';
import type {
  Restaurant,
  RestaurantWithHours,
  RestaurantReview,
  CreateRestaurantDto,
  UpdateRestaurantDto,
  RestaurantSearchParams,
  PaginatedResponse,
} from './restaurant.interface';
import { mockRestaurants } from '@/lib/mockData';

// Helper function to assign image based on restaurant ID
const assignImageByRestaurantId = (restaurantId: string): string => {
  const images = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', // Fine dining restaurant
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', // Asian noodles
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800', // Pizza
    'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800', // Sushi platter
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', // Burger
    'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800', // Thai food
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800', // Cafe
    'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800', // Chinese dim sum
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', // Gourmet dish
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', // Restaurant interior
    'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800', // Pasta
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', // Gourmet pizza
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800', // Salad bowl
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', // Healthy bowl
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800', // Breakfast food
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800', // Food spread
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', // BBQ ribs
    'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800', // Tacos
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800', // Ramen
    'https://images.unsplash.com/photo-1562967914-608f82629710?w=800', // Indian curry
    'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800', // Mexican food
    'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800', // Korean BBQ
    'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800', // Mediterranean
    'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800', // French cuisine
    'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800', // Seafood
  ];

  // Use the numeric part of the ID or hash the ID to get a consistent index
  const numericId = parseInt(restaurantId.replace(/\D/g, ''), 10) || 0;
  return images[numericId % images.length];
};

// Helper function to add images to restaurant data
const addImagesToRestaurants = (restaurants: Restaurant[]): Restaurant[] => {
  return restaurants.map((restaurant) => ({
    ...restaurant,
    image_url:
      restaurant.image_url ||
      assignImageByRestaurantId(restaurant.restaurant_id),
  }));
};

export const restaurantService = {
  // Get all restaurants with filters
  getRestaurants: async (params?: RestaurantSearchParams) => {
    try {
      const response = await api.get<PaginatedResponse<Restaurant>>(
        '/restaurants',
        { params },
      );
      return {
        ...response.data,
        data: addImagesToRestaurants(response.data.data),
      };
    } catch (error) {
      // Fallback to mock data
      console.warn('API call failed, using mock data:', error);
      return {
        data: mockRestaurants,
        meta: {
          page: 1,
          limit: 20,
          total: mockRestaurants.length,
          totalPages: 1,
        },
      };
    }
  },

  // Get restaurant by ID with operating hours
  getRestaurantById: async (restaurantId: string) => {
    try {
      const response = await api.get<RestaurantWithHours>(
        `/restaurants/${restaurantId}`,
      );
      const restaurant = response.data;
      return {
        ...restaurant,
        image_url:
          restaurant.image_url || assignImageByRestaurantId(restaurantId),
      };
    } catch (error) {
      // Fallback to mock data
      console.warn('API call failed, using mock data:', error);
      const restaurant = mockRestaurants.find(
        (r) => r.restaurant_id === restaurantId,
      );
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }
      return restaurant as RestaurantWithHours;
    }
  },

  // Get restaurant reviews
  getRestaurantReviews: async (
    restaurantId: string,
    params?: { page?: number; limit?: number },
  ) => {
    try {
      const response = await api.get<PaginatedResponse<RestaurantReview>>(
        `/restaurants/${restaurantId}/reviews`,
        { params },
      );
      return response.data;
    } catch (error) {
      console.warn('API call failed, returning empty reviews:', error);
      return {
        data: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    }
  },

  // Get featured/popular restaurants
  getFeaturedRestaurants: async (limit: number = 10) => {
    try {
      const response = await api.get<Restaurant[]>('/restaurants/featured', {
        params: { limit },
      });
      return addImagesToRestaurants(response.data);
    } catch (error) {
      // Fallback to mock data
      console.warn('API call failed, using mock data:', error);
      return mockRestaurants.slice(0, limit);
    }
  },

  // Search restaurants
  searchRestaurants: async (params?: RestaurantSearchParams) => {
    try {
      const response = await api.get<PaginatedResponse<Restaurant>>(
        '/restaurants/search',
        {
          params,
        },
      );
      return {
        ...response.data,
        data: addImagesToRestaurants(response.data.data),
      };
    } catch (error) {
      // Fallback to mock data with simple search
      console.warn('API call failed, using mock data:', error);
      const filtered = mockRestaurants.filter(
        (r) =>
          !params?.search ||
          r.name.toLowerCase().includes(params.search.toLowerCase()),
      );
      return {
        data: filtered,
        meta: {
          page: 1,
          limit: 20,
          total: filtered.length,
          totalPages: 1,
        },
      };
    }
  },

  // Get restaurants by category
  getRestaurantsByCategory: async (category: string) => {
    try {
      const response = await api.get<Restaurant[]>(
        `/restaurants/category/${category}`,
      );
      return addImagesToRestaurants(response.data);
    } catch (error) {
      console.warn('API call failed, using mock data:', error);
      return mockRestaurants;
    }
  },

  // Create restaurant (owner/admin only)
  createRestaurant: async (data: CreateRestaurantDto) => {
    const response = await api.post<Restaurant>('/restaurants', data);
    return response.data;
  },

  // Update restaurant (owner only)
  // PUT /restaurants/:restaurantId - Updates restaurant information
  // Only the restaurant owner can update their restaurant
  // All fields are optional - only provided fields will be updated
  updateRestaurant: async (restaurantId: string, data: UpdateRestaurantDto) => {
    const response = await api.put<RestaurantWithHours>(
      `/restaurants/${restaurantId}`,
      data,
    );
    return response.data;
  },

  // Delete restaurant (owner only)
  // DELETE /restaurants/:restaurantId - Permanently deletes restaurant
  // Cascade deletes: operating hours, menu items, favorites
  // Only the restaurant owner can delete their restaurant
  deleteRestaurant: async (restaurantId: string) => {
    const response = await api.delete<{ message: string }>(
      `/restaurants/${restaurantId}`,
    );
    return response.data;
  },

  // Toggle favorite restaurant
  toggleFavorite: async (restaurantId: string) => {
    const response = await api.post(`/restaurants/${restaurantId}/favorite`);
    return response.data;
  },

  // Get favorite restaurants for current user
  getFavoriteRestaurants: async (params?: {
    page?: number;
    limit?: number;
  }) => {
    try {
      const response = await api.get<PaginatedResponse<Restaurant>>(
        '/restaurants/favorites',
        { params },
      );
      return {
        ...response.data,
        data: addImagesToRestaurants(response.data.data),
      };
    } catch (error) {
      console.warn('API call failed, returning empty favorites:', error);
      return {
        data: [],
        meta: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      };
    }
  },

  // Get restaurants owned by the current user (for restaurant owners)
  // Note: API doesn't have dedicated endpoint, so we fetch all and filter client-side
  // In production, this should ideally filter by owner_id on the backend
  getMyRestaurants: async (
    ownerId: string,
    params?: { page?: number; limit?: number },
  ) => {
    // Fetch all restaurants with pagination
    // The API will need to be enhanced to filter by owner_id server-side
    const response = await api.get<PaginatedResponse<Restaurant>>(
      '/restaurants',
      {
        params: {
          ...params,
          limit: params?.limit || 100, // Fetch more to account for filtering
        },
      },
    );

    // Filter restaurants by owner_id on client side
    // This is not ideal for production but works with current API
    const myRestaurants = response.data.data.filter(
      (restaurant) => restaurant.owner_id === ownerId,
    );

    return {
      data: myRestaurants,
      meta: {
        ...response.data.meta,
        total: myRestaurants.length,
        totalPages: Math.ceil(
          myRestaurants.length / (params?.limit || response.data.meta.limit),
        ),
      },
    };
  },

  // Get a specific restaurant owned by the current user
  getMyRestaurantById: async (restaurantId: string) => {
    // Use the standard getRestaurantById since API doesn't have separate endpoint
    const response = await api.get<RestaurantWithHours>(
      `/restaurants/${restaurantId}`,
    );
    return response.data;
  },
};
