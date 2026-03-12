import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  useRestaurantMenu,
  useToggleFavoriteMenuItem,
  useFavoriteMenuItems,
} from '@/hooks/menu/useMenuItems';
import { restaurantService } from '@/services/restaurants/restaurant.tsx';
import { orderService } from '@/services/orders/order.tsx';
import type { Restaurant } from '@/services/restaurants/restaurant.interface';
import type { MenuItem } from '@/services/menu/menu.interface';
import type { OrderWithDetails } from '@/services/orders/order.interface';
import { MenuItemCard } from '@/components/shared/MenuItemCard';
import { SortableHeader } from '@/components/shared/SortableHeader';
import { Input } from '@/components/ui/input';
import Sidebar from '@/components/layouts/Sidebar';
import {
  Star,
  MapPin,
  Phone,
  Mail,
  ShoppingCart,
  Heart,
  ArrowLeft,
  X,
  Plus,
  Minus,
  Trash2,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { mockRestaurants } from '@/lib/mockData';

interface LocalCartItem {
  item_id: string;
  item_name: string;
  item_price: number;
  item_image?: string;
  quantity: number;
  restaurant_id: string;
}

const RestaurantDetails = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<LocalCartItem[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const toggleFavoriteMenuItemMutation = useToggleFavoriteMenuItem();
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>(
    {},
  );
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: 'name' | 'price') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Fetch menu using React Query with backend sorting
  const {
    data: menuItems = [],
    isLoading: menuLoading,
    refetch: refetchMenu,
  } = useRestaurantMenu(restaurantId || '', sortBy, sortOrder);

  // Fetch user's favorite menu items
  const { data: favoriteItems = [] } = useFavoriteMenuItems();

  useEffect(() => {
    if (restaurantId) {
      loadRestaurantData();
    }
  }, [restaurantId]);

  const loadRestaurantData = async () => {
    if (!restaurantId) return;

    try {
      setLoading(true);
      try {
        const restaurantData =
          await restaurantService.getRestaurantById(restaurantId);

        setRestaurant(restaurantData);
        setIsFavorite(restaurantData.is_favorite || false);
      } catch (apiError) {
        // Use mock data if API fails
        console.log(
          'API not available, using mock data for restaurant details',
        );
        const mockRestaurant =
          mockRestaurants.find((r) => r.restaurant_id === restaurantId) ||
          mockRestaurants[0];
        setRestaurant(mockRestaurant);
        setIsFavorite(false);
      }
    } catch (error) {
      console.error('Failed to load restaurant data:', error);
      toast.error('Failed to load restaurant details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (item: MenuItem, quantity: number) => {
    // Add category with error toast
    const handleAddCategory = async (newCategory: string) => {
      try {
        // Replace with actual API call
        // await categoryService.addCategory(newCategory);
        // Simulate success
        toast.success(`Category '${newCategory}' added!`);
      } catch (error: any) {
        console.error('Failed to add category:', error);
        let errorMessage = 'Failed to add category';
        if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }
        toast.error(errorMessage);
      }
    };

    // Update food item with error toast
    const handleUpdateFoodItem = async (
      foodItemId: string,
      updateData: any,
    ) => {
      try {
        // Replace with actual API call
        // await foodService.updateFoodItem(foodItemId, updateData);
        // Simulate success
        toast.success('Food item updated!');
      } catch (error: any) {
        console.error('Failed to update food item:', error);
        let errorMessage = 'Failed to update food item';
        if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }
        toast.error(errorMessage);
      }
    };
    if (!restaurantId) {
      toast.error('Restaurant not found');
      return;
    }

    try {
      // Persist item to backend cart so checkout can work with server cart
      await orderService.addToCart({
        item_id: item.food_id,
        restaurant_id: restaurantId,
        quantity,
        note: undefined,
      });

      // Update local cart for instant UI feedback
      const existingItem = cart.find(
        (cartItem) => cartItem.item_id === item.food_id,
      );

      if (existingItem) {
        setCart(
          cart.map((cartItem) =>
            cartItem.item_id === item.food_id
              ? { ...cartItem, quantity: cartItem.quantity + quantity }
              : cartItem,
          ),
        );
      } else {
        setCart([
          ...cart,
          {
            item_id: item.food_id,
            item_name: item.name,
            item_price: item.price,
            item_image: item.image_url,
            quantity,
            restaurant_id: item.restaurant_id,
          },
        ]);
      }

      setShowCart(true);
      toast.success(`${item.name} added to cart`);
    } catch (error: any) {
      console.error('Failed to add item to cart:', error);
      let errorMessage = 'Failed to add item to cart';
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  const handleToggleFavorite = () => {
    toast.info(
      'Favorite a menu item to add this restaurant to your favorites!',
    );
  };

  const handleToggleMenuItemFavorite = async (
    menuItemId: string,
    restaurantId: string,
  ) => {
    try {
      await toggleFavoriteMenuItemMutation.mutateAsync({
        menuItemId,
        restaurantId,
      });
      toast.success('Favorite updated successfully');
      // Reload both restaurant data and menu items to update is_favorited status
      await Promise.all([loadRestaurantData(), refetchMenu()]);
    } catch (error: any) {
      console.error('Failed to toggle favorite:', error);
      let errorMessage = 'Failed to update favorite';
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    // Pass cart data to checkout page via navigation state
    navigate('/checkout', { state: { cart, restaurant } });
  };

  const handleUpdateCartItem = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(itemId);
      return;
    }
    setCart(
      cart.map((cartItem) =>
        cartItem.item_id === itemId
          ? { ...cartItem, quantity: newQuantity }
          : cartItem,
      ),
    );
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(cart.filter((cartItem) => cartItem.item_id !== itemId));
    toast.success('Item removed from cart');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getCartItemQuantity = (itemId: string) => {
    return cart.find((item) => item.item_id === itemId)?.quantity || 0;
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.item_price * item.quantity,
    0,
  );

  // Create a Set of favorite (restaurant_id, food_id) pairs for quick lookup
  const favoriteKeys = new Set(
    favoriteItems.map((item) => `${item.restaurant_id}:${item.food_id}`),
  );

  // Merge menu items with favorite status (per user, per restaurant)
  const menuItemsWithFavorites = menuItems.map((item) => ({
    ...item,
    is_favorited: favoriteKeys.has(`${item.restaurant_id}:${item.food_id}`),
  }));

  // Only available items are shown
  const availableItems = menuItemsWithFavorites.filter(
    (item) => item.status === 'AVAILABLE',
  );

  const categories = Array.from(
    new Set(
      availableItems.flatMap((item) => (item.category ? [item.category] : [])),
    ),
  );

  // Apply filters
  let filteredMenuItems = availableItems;

  // Category filter
  if (selectedCategory) {
    filteredMenuItems = filteredMenuItems.filter(
      (item) => item.category === selectedCategory,
    );
  }

  // Search filter
  if (searchQuery) {
    filteredMenuItems = filteredMenuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  // Price range filter
  if (priceRange.min !== undefined) {
    filteredMenuItems = filteredMenuItems.filter(
      (item) => item.price >= priceRange.min!,
    );
  }
  if (priceRange.max !== undefined) {
    filteredMenuItems = filteredMenuItems.filter(
      (item) => item.price <= priceRange.max!,
    );
  }

  // Menu items are already sorted by backend
  const sortedMenuItems = filteredMenuItems;

  if (loading || menuLoading) {
    return (
      <div className='flex min-h-screen bg-gray-50'>
        <Sidebar />
        <main className='mt-[120px] flex-1 lg:mt-0 lg:ml-56'>
          <div className='container mx-auto px-4 py-6 text-left'>
            <div className='animate-pulse space-y-4'>
              <div className='h-64 rounded-lg bg-gray-200' />
              <div className='h-8 w-1/3 rounded bg-gray-200' />
              <div className='h-4 w-1/2 rounded bg-gray-200' />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className='flex min-h-screen bg-gray-50'>
        <Sidebar />
        <main className='mt-[120px] flex-1 lg:mt-0 lg:ml-56'>
          <div className='container mx-auto mt-4 max-w-7xl px-4 py-6 text-left'>
            <div className='py-12'>
              <p className='mt-4 text-lg text-gray-500'>Restaurant not found</p>
              <Button onClick={() => navigate('/')} className='mt-4'>
                Back to Explore
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />

      <main className='ml-64 flex-1 pb-24'>
        <div className='container mx-auto mt-4 max-w-7xl px-4 py-6 text-left'>
          {/* Back Button */}
          <Button
            variant='ghost'
            onClick={() => navigate('/')}
            className='mb-4'
          >
            <ArrowLeft size={18} className='mr-2' />
            Back to Explore
          </Button>

          {/* Restaurant Header */}
          <Card className='mb-6 overflow-hidden'>
            <div className='md:flex'>
              <div className='md:w-1/3'>
                <div className='aspect-square w-full bg-gray-200'>
                  {restaurant.image_url ? (
                    <img
                      src={restaurant.image_url}
                      alt={restaurant.name}
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <div className='flex h-full w-full items-center justify-center text-gray-400'>
                      <span className='text-6xl'>🍽️</span>
                    </div>
                  )}
                </div>
              </div>

              <div className='p-6 md:w-2/3'>
                <div className='mb-4 flex items-start justify-between'>
                  <div className='flex-1'>
                    <h1 className='mb-2 text-3xl font-bold text-gray-900'>
                      {restaurant.name}
                    </h1>
                    <div className='flex items-center gap-2'>
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          restaurant.status === 'OPEN'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {restaurant.status === 'OPEN' ? 'Open Now' : 'Closed'}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={handleToggleFavorite}
                  >
                    <Heart
                      size={20}
                      className={isFavorite ? 'fill-red-500 text-red-500' : ''}
                    />
                  </Button>
                </div>

                {restaurant.description && (
                  <p className='mb-4 text-gray-600'>{restaurant.description}</p>
                )}

                <div className='space-y-3 text-sm text-gray-600'>
                  {restaurant.average_rating !== undefined &&
                    restaurant.average_rating !== null && (
                      <div className='flex items-center gap-2'>
                        <Star
                          size={18}
                          className='fill-yellow-400 text-yellow-400'
                        />
                        <span className='font-medium'>
                          {restaurant.average_rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  {restaurant.address_details && (
                    <div className='flex items-start gap-2'>
                      <MapPin size={18} className='mt-0.5 shrink-0' />
                      <span>{restaurant.address_details}</span>
                    </div>
                  )}
                  {restaurant.phone && (
                    <div className='flex items-center gap-2'>
                      <Phone size={18} />
                      <span>{restaurant.phone}</span>
                    </div>
                  )}
                  {restaurant.email && (
                    <div className='flex items-center gap-2'>
                      <Mail size={18} />
                      <span>{restaurant.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Search and Filters */}
          <div className='mb-6 space-y-4 rounded-lg border bg-white p-4'>
            <div className='flex flex-col gap-4 md:flex-row'>
              {/* Search */}
              <div className='relative flex-1'>
                <Search
                  className='absolute top-1/2 left-3 -translate-y-1/2 text-gray-400'
                  size={18}
                />
                <Input
                  type='text'
                  placeholder='Search menu items...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10'
                />
              </div>

              {/* Price Range */}
              <div className='flex gap-2'>
                <Input
                  type='number'
                  placeholder='Min price'
                  value={priceRange.min || ''}
                  onChange={(e) =>
                    setPriceRange((prev) => ({
                      ...prev,
                      min: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  className='w-32'
                />
                <Input
                  type='number'
                  placeholder='Max price'
                  value={priceRange.max || ''}
                  onChange={(e) =>
                    setPriceRange((prev) => ({
                      ...prev,
                      max: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  className='w-32'
                />
              </div>

              {/* Clear Filters */}
              {(searchQuery ||
                priceRange.min ||
                priceRange.max ||
                selectedCategory) && (
                <Button
                  variant='outline'
                  onClick={() => {
                    setSearchQuery('');
                    setPriceRange({});
                    setSelectedCategory(null);
                  }}
                >
                  Clear
                </Button>
              )}
            </div>

            {/* Sorting */}
            <div className='flex items-center gap-2 border-t pt-3'>
              <span className='text-sm font-medium text-gray-700'>
                Sort by:
              </span>
              <SortableHeader
                label='Name'
                field='name'
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={handleSort}
              />
              <SortableHeader
                label='Price'
                field='price'
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={handleSort}
              />
            </div>
          </div>

          {/* Categories Filter */}
          {categories.length > 0 && (
            <div className='mb-6 flex gap-2 overflow-x-auto pb-2'>
              <button
                onClick={() => setSelectedCategory(null)}
                className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  !selectedCategory
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              {[...categories]
                .sort((a, b) => a.localeCompare(b))
                .map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap ${
                      selectedCategory === category
                        ? 'bg-orange-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
            </div>
          )}

          {/* Menu Items */}
          <div>
            <h2 className='mb-4 text-2xl font-bold text-gray-900'>Menu</h2>

            {restaurant.status !== 'OPEN' && (
              <div className='mb-4 rounded-lg border border-red-200 bg-red-50 p-4'>
                <p className='font-medium text-red-800'>
                  This restaurant is currently closed and not accepting orders.
                </p>
              </div>
            )}

            {sortedMenuItems.length === 0 ? (
              <div className='rounded-lg bg-white py-12'>
                <p className='text-gray-500'>No menu items available</p>
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                {sortedMenuItems.map((item) => (
                  <MenuItemCard
                    key={`${item.restaurant_id}:${item.food_id}`}
                    menuItem={item}
                    onAddToCart={
                      restaurant.status === 'OPEN' ? handleAddToCart : undefined
                    }
                    cartQuantity={getCartItemQuantity(item.food_id)}
                    isFavorite={item.is_favorited}
                    onFavoriteToggle={handleToggleMenuItemFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Floating Cart Button */}
        {cartItemCount > 0 && (
          <div className='fixed right-6 bottom-6 z-50'>
            <Button
              size='lg'
              className='rounded-full bg-orange-500 shadow-lg hover:bg-orange-600'
              onClick={() => setShowCart(true)}
            >
              <ShoppingCart size={20} className='mr-2' />
              View Cart ({cartItemCount})
            </Button>
          </div>
        )}

        {/* Cart Sidebar */}
        {showCart && (
          <div
            className='fixed inset-0 z-50 bg-black/50'
            onClick={() => setShowCart(false)}
          >
            <div
              className='absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='flex h-full flex-col'>
                <div className='flex items-center justify-between border-b p-4'>
                  <h3 className='text-lg font-semibold'>Your Cart</h3>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setShowCart(false)}
                  >
                    <X size={20} />
                  </Button>
                </div>

                <div className='flex-1 overflow-y-auto p-4'>
                  {cart.length === 0 ? (
                    <div className='py-12 text-gray-500'>
                      <p>Your cart is empty</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.item_id}
                        className='mb-4 flex gap-3 border-b pb-4'
                      >
                        {item.item_image && (
                          <img
                            src={item.item_image}
                            alt={item.item_name}
                            className='h-16 w-16 rounded-lg object-cover'
                          />
                        )}
                        <div className='flex-1'>
                          <h4 className='font-medium'>{item.item_name}</h4>
                          <p className='text-sm text-gray-600'>
                            {formatPrice(item.item_price)} each
                          </p>
                          <p className='font-medium text-orange-600'>
                            {formatPrice(item.item_price * item.quantity)}
                          </p>
                        </div>
                        <div className='flex flex-col items-end justify-between'>
                          <button
                            onClick={() => handleRemoveFromCart(item.item_id)}
                            className='text-red-500 hover:text-red-700'
                          >
                            <Trash2 size={18} />
                          </button>
                          <div className='flex items-center gap-2'>
                            <button
                              onClick={() =>
                                handleUpdateCartItem(
                                  item.item_id,
                                  item.quantity - 1,
                                )
                              }
                              className='rounded-full border p-1 hover:bg-gray-100'
                            >
                              <Minus size={14} />
                            </button>
                            <span className='w-8 text-center font-medium'>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateCartItem(
                                  item.item_id,
                                  item.quantity + 1,
                                )
                              }
                              className='rounded-full border p-1 hover:bg-gray-100'
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className='border-t p-4'>
                  <div className='mb-4 flex items-center justify-between'>
                    <span className='text-lg font-semibold'>Total:</span>
                    <span className='text-2xl font-bold text-orange-600'>
                      {formatPrice(cartSubtotal)}
                    </span>
                  </div>
                  <Button
                    className='w-full bg-orange-500 hover:bg-orange-600'
                    size='lg'
                    onClick={handleCheckout}
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RestaurantDetails;
