import api from '../api';
import type {
  MenuItem,
  Category,
  CreateMenuItemDto,
  UpdateMenuItemDto,
  MenuItemSearchParams,
  PaginatedResponse,
} from './menu.interface';

export const menuService = {
  // Add new category
  addCategory: async (name: string) => {
    const response = await api.post<Category>('/categories', { name });
    return response.data;
  },
  // Get all menu items with filters
  getMenuItems: async (params?: MenuItemSearchParams) => {
    const response = await api.get<PaginatedResponse<MenuItem>>('/menu-items', {
      params,
    });
    return response.data;
  },

  // Get menu items for a specific restaurant
  getRestaurantMenu: async (
    restaurantId: string,
    sortBy?: 'name' | 'price',
    sortOrder?: 'asc' | 'desc',
  ) => {
    const response = await api.get<MenuItem[]>(
      `/restaurants/${restaurantId}/menu`,
      {
        params: { sortBy, sortOrder },
      },
    );
    return response.data;
  },

  // Get menu item by ID
  getMenuItemById: async (restaurantId: string, menuItemId: string) => {
    const response = await api.get<MenuItem>(
      `/menu-items/${restaurantId}/${menuItemId}`,
    );
    return response.data;
  },

  // Get all categories
  getCategories: async () => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  // Get menu items by category
  getMenuItemsByCategory: async (category: string) => {
    const response = await api.get<MenuItem[]>(
      `/menu-items/category/${category}`,
    );
    return response.data;
  },

  // Create menu item (restaurant owner only)
  createMenuItem: async (data: CreateMenuItemDto) => {
    const response = await api.post<MenuItem>('/menu-items', data);
    return response.data;
  },

  // Update menu item (restaurant owner only)
  updateMenuItem: async (
    restaurantId: string,
    menuItemId: string,
    data: UpdateMenuItemDto,
  ) => {
    const response = await api.put<MenuItem>(
      `/menu-items/${restaurantId}/${menuItemId}`,
      data,
    );
    return response.data;
  },

  // Delete menu item (restaurant owner only)
  deleteMenuItem: async (restaurantId: string, menuItemId: string) => {
    const response = await api.delete(
      `/menu-items/${restaurantId}/${menuItemId}`,
    );
    return response.data;
  },

  // Toggle favorite menu item
  toggleFavoriteMenuItem: async (menuItemId: string, restaurantId: string) => {
    const response = await api.post(`/menu-items/${menuItemId}/favorite`, {
      restaurant_id: restaurantId,
    });
    return response.data;
  },

  // Get favorite menu items for current user
  getFavoriteMenuItems: async (
    sortBy?: 'name' | 'price',
    sortOrder?: 'asc' | 'desc',
  ) => {
    const response = await api.get<MenuItem[]>('/menu-items/favorites', {
      params: {
        sortBy,
        sortOrder,
      },
    });
    return response.data;
  },

  // Search menu items
  searchMenuItems: async (query: string) => {
    const response = await api.get<MenuItem[]>('/menu-items/search', {
      params: { query },
    });
    return response.data;
  },
};
