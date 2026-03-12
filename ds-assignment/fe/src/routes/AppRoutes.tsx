import LogIn from '@/pages/login/LogIn';
import Explore from '@/pages/explore/Explore';
import RestaurantDetails from '@/pages/restaurant/RestaurantDetails';
import FavoriteRestaurants from '@/pages/favorites/FavoriteRestaurants';
import Orders from '@/pages/orders/Orders';
import OrderDetails from '@/pages/orders/OrderDetails';
import OrderTracking from '@/pages/orders/OrderTracking';
import OrderRating from '@/pages/orders/OrderRating';
import Profile from '@/pages/profile/Profile';
import Notifications from '@/pages/notifications/Notifications';
import Checkout from '@/pages/checkout/Checkout';
import PrivateRoutes from './PrivateRoutes';
import RoleBasedRedirect from './RoleBasedRedirect';
import type { RouteObject } from 'react-router-dom';

// Driver pages
import DriverDashboard from '@/pages/driver/dashboard/DriverDashboard';
import DriverActiveOrders from '@/pages/driver/active/DriverActiveOrders';
import DriverHistory from '@/pages/driver/history/DriverHistory';

// Restaurant pages
import RestaurantDashboard from '@/pages/restaurant/dashboard/RestaurantDashboard';
import RestaurantOrders from '@/pages/restaurant/orders/RestaurantOrders';
import RestaurantMenu from '@/pages/restaurant/menu/RestaurantMenu';
import RestaurantAnalytics from '@/pages/restaurant/analytics/RestaurantAnalytics';
import RestaurantSettings from '@/pages/restaurant/settings/RestaurantSettings';
import CreateRestaurant from '@/pages/restaurant/create/CreateRestaurant';
import RestaurantEdit from '@/pages/restaurant/edit/RestaurantEdit';

export const AppRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <LogIn />,
  },
  {
    path: '/',
    element: (
      <PrivateRoutes>
        <RoleBasedRedirect />
      </PrivateRoutes>
    ),
  },
  {
    path: '/explore',
    element: (
      <PrivateRoutes>
        <Explore />
      </PrivateRoutes>
    ),
  },
  {
    path: '/restaurant/:restaurantId',
    element: (
      <PrivateRoutes>
        <RestaurantDetails />
      </PrivateRoutes>
    ),
  },
  {
    path: '/favorites',
    element: (
      <PrivateRoutes>
        <FavoriteRestaurants />
      </PrivateRoutes>
    ),
  },
  {
    path: '/orders',
    element: (
      <PrivateRoutes>
        <Orders />
      </PrivateRoutes>
    ),
  },
  {
    path: '/orders/:orderId',
    element: (
      <PrivateRoutes>
        <OrderDetails />
      </PrivateRoutes>
    ),
  },
  {
    path: '/orders/:orderId/track',
    element: (
      <PrivateRoutes>
        <OrderTracking />
      </PrivateRoutes>
    ),
  },
  {
    path: '/orders/:orderId/rate',
    element: (
      <PrivateRoutes>
        <OrderRating />
      </PrivateRoutes>
    ),
  },
  {
    path: '/checkout',
    element: (
      <PrivateRoutes>
        <Checkout />
      </PrivateRoutes>
    ),
  },
  {
    path: '/profile',
    element: (
      <PrivateRoutes>
        <Profile />
      </PrivateRoutes>
    ),
  },
  {
    path: '/notifications',
    element: (
      <PrivateRoutes>
        <Notifications />
      </PrivateRoutes>
    ),
  },
  // Driver routes
  {
    path: '/driver/deliveries',
    element: (
      <PrivateRoutes>
        <DriverDashboard />
      </PrivateRoutes>
    ),
  },
  {
    path: '/driver/active',
    element: (
      <PrivateRoutes>
        <DriverActiveOrders />
      </PrivateRoutes>
    ),
  },
  {
    path: '/driver/history',
    element: (
      <PrivateRoutes>
        <DriverHistory />
      </PrivateRoutes>
    ),
  },
  // Restaurant routes
  {
    path: '/restaurant/dashboard',
    element: (
      <PrivateRoutes>
        <RestaurantDashboard />
      </PrivateRoutes>
    ),
  },
  {
    path: '/restaurant/menu',
    element: (
      <PrivateRoutes>
        <RestaurantMenu />
      </PrivateRoutes>
    ),
  },
  {
    path: '/restaurant/orders',
    element: (
      <PrivateRoutes>
        <RestaurantOrders />
      </PrivateRoutes>
    ),
  },
  {
    path: '/restaurant/analytics',
    element: (
      <PrivateRoutes>
        <RestaurantAnalytics />
      </PrivateRoutes>
    ),
  },
  {
    path: '/restaurant/settings',
    element: (
      <PrivateRoutes>
        <RestaurantSettings />
      </PrivateRoutes>
    ),
  },
  {
    path: '/restaurant/create',
    element: (
      <PrivateRoutes>
        <CreateRestaurant />
      </PrivateRoutes>
    ),
  },
  {
    path: '/restaurant/edit/:restaurantId',
    element: (
      <PrivateRoutes>
        <RestaurantEdit />
      </PrivateRoutes>
    ),
  },
];
