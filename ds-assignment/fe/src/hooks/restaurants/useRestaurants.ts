import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantService } from '@/services/restaurants/restaurant';
import type {
  RestaurantSearchParams,
  CreateRestaurantDto,
  UpdateRestaurantDto,
} from '@/services/restaurants/restaurant.interface';

// Query keys
export const restaurantKeys = {
  all: ['restaurants'] as const,
  lists: () => [...restaurantKeys.all, 'list'] as const,
  list: (params?: RestaurantSearchParams) =>
    [...restaurantKeys.lists(), params] as const,
  details: () => [...restaurantKeys.all, 'detail'] as const,
  detail: (id: string) => [...restaurantKeys.details(), id] as const,
  featured: () => [...restaurantKeys.all, 'featured'] as const,
  favorites: (params?: { page?: number; limit?: number }) =>
    [...restaurantKeys.all, 'favorites', params] as const,
  reviews: (id: string, params?: { page?: number; limit?: number }) =>
    [...restaurantKeys.detail(id), 'reviews', params] as const,
};

// Fetch restaurants with filters, sorting, and pagination
export const useRestaurants = (params?: RestaurantSearchParams) => {
  return useQuery({
    queryKey: restaurantKeys.list(params),
    queryFn: () => restaurantService.getRestaurants(params),
  });
};

// Fetch restaurant by ID
export const useRestaurant = (restaurantId: string) => {
  return useQuery({
    queryKey: restaurantKeys.detail(restaurantId),
    queryFn: () => restaurantService.getRestaurantById(restaurantId),
    enabled: !!restaurantId,
  });
};

// Fetch featured restaurants
export const useFeaturedRestaurants = (limit?: number) => {
  return useQuery({
    queryKey: restaurantKeys.featured(),
    queryFn: () => restaurantService.getFeaturedRestaurants(limit),
  });
};

// Fetch favorite restaurants
export const useFavoriteRestaurants = (params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: restaurantKeys.favorites(params),
    queryFn: () => restaurantService.getFavoriteRestaurants(params),
  });
};

// Fetch restaurant reviews
export const useRestaurantReviews = (
  restaurantId: string,
  params?: { page?: number; limit?: number },
) => {
  return useQuery({
    queryKey: restaurantKeys.reviews(restaurantId, params),
    queryFn: () => restaurantService.getRestaurantReviews(restaurantId, params),
    enabled: !!restaurantId,
  });
};

// Search restaurants
export const useSearchRestaurants = (params?: RestaurantSearchParams) => {
  return useQuery({
    queryKey: [...restaurantKeys.lists(), 'search', params],
    queryFn: () => restaurantService.searchRestaurants(params),
    enabled: !!params?.search,
  });
};

// Create restaurant mutation
export const useCreateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRestaurantDto) =>
      restaurantService.createRestaurant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.lists() });
    },
  });
};

// Update restaurant mutation
export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      restaurantId,
      data,
    }: {
      restaurantId: string;
      data: UpdateRestaurantDto;
    }) => restaurantService.updateRestaurant(restaurantId, data),
    onSuccess: (_, { restaurantId }) => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: restaurantKeys.detail(restaurantId),
      });
    },
  });
};

// Delete restaurant mutation
export const useDeleteRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (restaurantId: string) =>
      restaurantService.deleteRestaurant(restaurantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.lists() });
    },
  });
};

// Toggle favorite restaurant mutation
export const useToggleFavoriteRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (restaurantId: string) =>
      restaurantService.toggleFavorite(restaurantId),
    onSuccess: (_, restaurantId) => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.favorites() });
      queryClient.invalidateQueries({
        queryKey: restaurantKeys.detail(restaurantId),
      });
    },
  });
};
