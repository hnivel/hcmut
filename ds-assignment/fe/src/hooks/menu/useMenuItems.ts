import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuService } from '@/services/menu/menu';
import type {
  MenuItemSearchParams,
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from '@/services/menu/menu.interface';

// Query keys
export const menuKeys = {
  all: ['menuItems'] as const,
  lists: () => [...menuKeys.all, 'list'] as const,
  list: (params?: MenuItemSearchParams) =>
    [...menuKeys.lists(), params] as const,
  details: () => [...menuKeys.all, 'detail'] as const,
  detail: (restaurantId: string, menuItemId: string) =>
    [...menuKeys.details(), restaurantId, menuItemId] as const,
  restaurant: (restaurantId: string) =>
    [...menuKeys.all, 'restaurant', restaurantId] as const,
  categories: () => [...menuKeys.all, 'categories'] as const,
  category: (category: string) =>
    [...menuKeys.all, 'category', category] as const,
  favorites: () => [...menuKeys.all, 'favorites'] as const,
  search: (query: string) => [...menuKeys.all, 'search', query] as const,
};

// Fetch menu items with filters, sorting, and pagination
export const useMenuItems = (params?: MenuItemSearchParams) => {
  return useQuery({
    queryKey: menuKeys.list(params),
    queryFn: () => menuService.getMenuItems(params),
  });
};

// Fetch restaurant menu (supports backend sorting)
export const useRestaurantMenu = (
  restaurantId: string,
  sortBy?: 'name' | 'price',
  sortOrder?: 'asc' | 'desc',
) => {
  return useQuery({
    queryKey: [
      ...menuKeys.restaurant(restaurantId),
      sortBy || 'name',
      sortOrder || 'asc',
    ],
    queryFn: () =>
      menuService.getRestaurantMenu(restaurantId, sortBy, sortOrder),
    enabled: !!restaurantId,
  });
};

// Fetch menu item by ID
export const useMenuItem = (restaurantId: string, menuItemId: string) => {
  return useQuery({
    queryKey: menuKeys.detail(restaurantId, menuItemId),
    queryFn: () => menuService.getMenuItemById(restaurantId, menuItemId),
    enabled: !!restaurantId && !!menuItemId,
  });
};

// Fetch all categories
export const useCategories = () => {
  return useQuery({
    queryKey: menuKeys.categories(),
    queryFn: () => menuService.getCategories(),
  });
};

// Fetch menu items by category
export const useMenuItemsByCategory = (category: string) => {
  return useQuery({
    queryKey: menuKeys.category(category),
    queryFn: () => menuService.getMenuItemsByCategory(category),
    enabled: !!category,
  });
};

// Fetch favorite menu items (supports backend sorting)
export const useFavoriteMenuItems = (
  sortBy?: 'name' | 'price',
  sortOrder?: 'asc' | 'desc',
) => {
  return useQuery({
    queryKey: ['menuItems', 'favorites', sortBy || 'name', sortOrder || 'asc'],
    queryFn: () => menuService.getFavoriteMenuItems(sortBy, sortOrder),
  });
};

// Search menu items
export const useSearchMenuItems = (query: string) => {
  return useQuery({
    queryKey: menuKeys.search(query),
    queryFn: () => menuService.searchMenuItems(query),
    enabled: !!query && query.length > 0,
  });
};

// Create menu item mutation
export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMenuItemDto) => menuService.createMenuItem(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: menuKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: menuKeys.restaurant(variables.restaurant_id),
      });
    },
  });
};

// Update menu item mutation
export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      restaurantId,
      menuItemId,
      data,
    }: {
      restaurantId: string;
      menuItemId: string;
      data: UpdateMenuItemDto;
    }) => menuService.updateMenuItem(restaurantId, menuItemId, data),
    onSuccess: (_, { restaurantId, menuItemId }) => {
      queryClient.invalidateQueries({ queryKey: menuKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: menuKeys.detail(restaurantId, menuItemId),
      });
      queryClient.invalidateQueries({
        queryKey: menuKeys.restaurant(restaurantId),
      });
    },
  });
};

// Delete menu item mutation
export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      restaurantId,
      menuItemId,
    }: {
      restaurantId: string;
      menuItemId: string;
    }) => menuService.deleteMenuItem(restaurantId, menuItemId),
    onSuccess: (_, { restaurantId }) => {
      queryClient.invalidateQueries({ queryKey: menuKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: menuKeys.restaurant(restaurantId),
      });
    },
  });
};

// Toggle favorite menu item mutation
export const useToggleFavoriteMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      menuItemId,
      restaurantId,
    }: {
      menuItemId: string;
      restaurantId: string;
    }) => menuService.toggleFavoriteMenuItem(menuItemId, restaurantId),
    onSuccess: (_, { restaurantId }) => {
      queryClient.invalidateQueries({ queryKey: menuKeys.favorites() });
      queryClient.invalidateQueries({
        queryKey: menuKeys.restaurant(restaurantId),
      });
      queryClient.invalidateQueries({ queryKey: menuKeys.lists() });
    },
  });
};
