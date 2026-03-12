export interface Restaurant {
  restaurant_id: string;
  owner_id?: string;
  name: string;
  phone?: string;
  email?: string;
  address_details?: string;
  longitude?: number;
  latitude?: number;
  registration_date: string;
  status: 'OPEN' | 'CLOSED' | 'TEMPORARILY_CLOSED';
  average_rating?: number | null; // API returns average_rating, can be null if no reviews
  total_reviews?: number;
  image_url?: string;
  description?: string;
  is_favorite?: boolean; // API returns is_favorite for authenticated users
  distance?: number; // Distance in km when lat/lng provided
}

export interface OperatingHour {
  dow: number; // 0-6, 0 = Sunday
  open_time: string; // HH:mm:ss format
  close_time?: string; // HH:mm:ss format
  day_name?: string; // Only in response, not in request
}

export interface RestaurantReview {
  order_id: string;
  restaurant_id?: string;
  customer_id?: string;
  rating_point: number;
  comment?: string;
  created_at: string;
  customer_name?: string;
}

export interface RestaurantWithHours extends Restaurant {
  operating_hours?: OperatingHour[];
}

export interface CreateRestaurantDto {
  name: string; // Required, max 128 characters
  phone?: string; // Optional, max 16 characters
  email?: string; // Optional, max 64 characters
  address_details?: string; // Optional, max 256 characters
  longitude?: number; // Optional, -180 to 180
  latitude?: number; // Optional, -90 to 90
  status?: 'OPEN' | 'CLOSED' | 'TEMPORARILY_CLOSED'; // Default: OPEN
  operating_hours?: Omit<OperatingHour, 'day_name'>[]; // day_name not needed in request
}

export interface UpdateRestaurantDto {
  name?: string; // Optional, max 128 characters
  phone?: string; // Optional, max 16 characters
  email?: string; // Optional, max 64 characters
  address_details?: string; // Optional, max 256 characters
  longitude?: number; // Optional, -180 to 180
  latitude?: number; // Optional, -90 to 90
  status?: 'OPEN' | 'CLOSED' | 'TEMPORARILY_CLOSED'; // Optional
  operating_hours?: Omit<OperatingHour, 'day_name'>[]; // Optional, replaces all existing hours if provided
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

// Restaurant search and filter parameters
export interface RestaurantSearchParams extends PaginationParams, SortParams {
  search?: string;
  status?: 'OPEN' | 'CLOSED' | 'TEMPORARILY_CLOSED';
  minRating?: number;
  latitude?: number;
  longitude?: number;
  radius?: number; // Search radius in km
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
