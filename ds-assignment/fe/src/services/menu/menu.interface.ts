export interface MenuItem {
  food_id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  price: number;
  status: 'AVAILABLE' | 'UNAVAILABLE';
  image_url?: string;
  category?: string;
  is_favorited?: boolean; // Added to track favorite status from API
}

export interface MenuItemFavourite {
  customer_id: string;
  restaurant_id: string;
  menu_item_id: string;
  favorited_at: string;
}

export interface Category {
  name: string;
  description?: string;
  image_url?: string;
}

export interface CreateMenuItemDto {
  name: string;
  description?: string;
  price: number;
  restaurant_id: string;
  status?: 'AVAILABLE' | 'UNAVAILABLE';
  categories?: string[];
}

export interface UpdateMenuItemDto {
  name?: string;
  description?: string;
  price?: number;
  status?: 'AVAILABLE' | 'UNAVAILABLE';
  categories?: string[];
}

// Pagination and sorting
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Menu item search and filter parameters
export interface MenuItemSearchParams extends PaginationParams, SortParams {
  search?: string;
  category?: string;
  restaurantId?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: 'AVAILABLE' | 'UNAVAILABLE';
}

// Paginated response structure
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
