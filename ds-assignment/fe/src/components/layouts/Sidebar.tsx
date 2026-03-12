import {
  Home,
  Bell,
  Compass,
  Heart,
  ShoppingBag,
  LogOut,
  Package,
  Settings,
  UtensilsCrossed,
  Clock,
  BarChart3,
  Store,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import { useRole } from '@/hooks/auth/useRole';
import { useNotifications } from '@/contexts/notifications/NotificationsContext';
import { useRestaurantContext } from '@/hooks/restaurant/useRestaurantContext';
import logoBK from '../../assets/logoBK.png';
import { crab } from '@lucide/lab';
import { createLucideIcon } from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: number;
}

const SidebarItem = ({
  icon,
  label,
  active,
  onClick,
  badge,
}: SidebarItemProps) => (
  <div
    onClick={onClick}
    className={`flex cursor-pointer items-center justify-between rounded-lg p-3 transition ${
      active
        ? 'border border-orange-100 bg-orange-50 font-semibold text-orange-700'
        : 'text-gray-700 hover:bg-gray-100'
    }`}
  >
    <div className='flex items-center'>
      {icon}
      <span className='ml-3 text-sm 3xl:text-base'>{label}</span>
    </div>
    {badge ? (
      <span className='rounded-full bg-red-500 px-2 py-0.5 text-xs text-white'>
        {badge}
      </span>
    ) : null}
  </div>
);

const SectionTitle = ({ title }: { title: string }) => (
  <div className='mt-4 mb-2 flex justify-start'>
    <p className='ml-2 text-sm font-bold tracking-wider text-gray-400 uppercase'>
      {title}
    </p>
  </div>
);

const CrabFoodLogo = createLucideIcon('CrabFoodLogo', crab);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const { isDriver, isCustomer, isRestaurant } = useRole();
  const { unreadCount } = useNotifications();
  const { selectedRestaurant } = useRestaurantContext();

  const isActive = (path: string) => location.pathname === path;

  const handleLogOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className='fixed top-0 left-0 flex h-screen w-56 flex-col justify-between overflow-y-auto border-r bg-white shadow-sm'>
      {/* Header */}
      <div>
        <div className='flex items-center border-b px-6 py-4'>
          <div className='flex h-9 w-9 items-center justify-center'>
            <CrabFoodLogo className='h-full w-full text-orange-600' />
          </div>
          <h1 className='ml-3 text-2xl font-bold text-orange-600'>CrabFood</h1>
        </div>

        {/* Navigation */}
        <nav className='mt-4 space-y-2 px-4 text-gray-700'>
          {/* Customer Navigation */}
          {isCustomer && (
            <>
              <SidebarItem
                icon={<Compass size={22} />}
                label='Explore'
                active={isActive('/') || isActive('/explore')}
                onClick={() => navigate('/explore')}
              />
              <SidebarItem
                icon={<Heart size={22} />}
                label='Favorite Foods'
                active={isActive('/favorites')}
                onClick={() => navigate('/favorites')}
              />
              <SidebarItem
                icon={<ShoppingBag size={22} />}
                label='Your Orders'
                active={isActive('/orders')}
                onClick={() => navigate('/orders')}
              />

              <SectionTitle title='Account' />
              <SidebarItem
                icon={<Bell size={22} />}
                label='Notifications'
                badge={unreadCount}
                active={isActive('/notifications')}
                onClick={() => navigate('/notifications')}
              />
            </>
          )}

          {/* Driver Navigation */}
          {isDriver && (
            <>
              <SidebarItem
                icon={<Home size={22} />}
                label='Dashboard'
                active={isActive('/') || isActive('/driver/deliveries')}
                onClick={() => navigate('/driver/deliveries')}
              />
              <SidebarItem
                icon={<Package size={22} />}
                label='Active Deliveries'
                active={isActive('/driver/active')}
                onClick={() => navigate('/driver/active')}
              />
              <SidebarItem
                icon={<Clock size={22} />}
                label='Delivery History'
                active={isActive('/driver/history')}
                onClick={() => navigate('/driver/history')}
              />

              <SectionTitle title='Account' />
              <SidebarItem
                icon={<Bell size={22} />}
                label='Notifications'
                badge={unreadCount}
                active={isActive('/notifications')}
                onClick={() => navigate('/notifications')}
              />
            </>
          )}

          {/* Restaurant Owner Navigation */}
          {isRestaurant && (
            <>
              {selectedRestaurant && (
                <div className='mb-3 rounded-lg border border-blue-200 bg-blue-50 p-3'>
                  <div className='mb-1 flex items-center gap-2'>
                    <Store size={16} className='text-blue-600' />
                    <p className='text-xs font-medium text-blue-900'>
                      Managing:
                    </p>
                  </div>
                  <p className='line-clamp-1 text-sm font-bold text-blue-900'>
                    {selectedRestaurant.name}
                  </p>
                </div>
              )}

              <SidebarItem
                icon={<Home size={22} />}
                label='Dashboard'
                active={isActive('/') || isActive('/restaurant/dashboard')}
                onClick={() => navigate('/restaurant/dashboard')}
              />

              <SectionTitle title='Management' />
              <SidebarItem
                icon={<Package size={22} />}
                label='Orders'
                active={isActive('/restaurant/orders')}
                onClick={() => navigate('/restaurant/orders')}
              />
              <SidebarItem
                icon={<UtensilsCrossed size={22} />}
                label='Menu Management'
                active={isActive('/restaurant/menu')}
                onClick={() => navigate('/restaurant/menu')}
              />
              <SidebarItem
                icon={<BarChart3 size={22} />}
                label='Analytics'
                active={isActive('/restaurant/analytics')}
                onClick={() => navigate('/restaurant/analytics')}
              />
              <SidebarItem
                icon={<Settings size={22} />}
                label='My Restaurants'
                active={
                  isActive('/restaurant/settings') ||
                  isActive('/restaurant/create') ||
                  location.pathname.startsWith('/restaurant/edit')
                }
                onClick={() => navigate('/restaurant/settings')}
              />
            </>
          )}
        </nav>
      </div>

      {/* User info + Logout */}
      <div className='border-t px-2 py-2'>
        <div
          onClick={() => navigate('/profile')}
          className='mb-2 flex cursor-pointer items-center rounded-lg p-3 transition hover:bg-gray-50'
        >
          <div className='flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-xl font-bold text-white'>
            {user?.name?.[0] || 'U'}
          </div>
          <div className='ml-3 flex-1 text-left'>
            <p className='text-sm font-semibold text-gray-900'>
              {user?.name || 'User Name'}
            </p>
            <p className='text-xs text-gray-500'>
              {user?.email || 'user@example.com'}
            </p>
            <div
              className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                isDriver
                  ? 'bg-blue-100 text-blue-700'
                  : isRestaurant
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-orange-100 text-orange-700'
              }`}
            >
              {isDriver ? 'Driver' : isRestaurant ? 'Restaurant' : 'Customer'}
            </div>
          </div>
        </div>

        <SidebarItem
          icon={<LogOut size={22} />}
          label='Log Out'
          onClick={handleLogOut}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
export { CrabFoodLogo };
