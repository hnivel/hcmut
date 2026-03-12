import {
  Home,
  Bell,
  Compass,
  UserCheck,
  UserPlus,
  Send,
  Inbox,
  HelpCircle,
  LogOut,
  Users,
  Calendar,
  MessageCircleMore,
  FileText,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import { useRole } from '@/hooks/auth/useRole';
import { useNotifications } from '@/contexts/notifications/NotificationContext';
import { useState } from 'react';
import logoBK from '../../assets/logoBK.png';

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
    className={`flex cursor-pointer items-center justify-between rounded-lg p-2 transition ${
      active
        ? 'border border-blue-100 bg-blue-50 font-semibold text-blue-700'
        : 'text-gray-700 hover:bg-gray-100'
    }`}
  >
    <div className='flex items-center'>
      {icon}
      <span className='3xl:text-2xl ml-3 text-sm'>{label}</span>
    </div>
    {badge ? (
      <span className='rounded-full bg-red-500 px-2 py-0.5 text-xs text-white'>
        {badge}
      </span>
    ) : null}
  </div>
);

const SectionTitle = ({ title }: { title: string }) => (
  <div className='3xl:mt-4 mt-2 flex justify-start'>
    <p className='3xl:text-2xl ml-2 text-lg font-extrabold text-gray-500'>
      {title}
    </p>
  </div>
);

interface MobileNavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const MobileNavItem = ({
  icon,
  label,
  active,
  onClick,
}: MobileNavItemProps) => (
  <button
    onClick={onClick}
    className={`flex w-[110px] flex-shrink-0 flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 transition ${
      active
        ? 'bg-blue-50 text-blue-600'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
    }`}
  >
    {icon}
    <span className='overflow-hidden text-center text-[9px] font-medium text-ellipsis whitespace-nowrap'>
      {label}
    </span>
  </button>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const { isMentor, isMentee, isFaculty } = useRole();
  const { unreadCount } = useNotifications();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowLogoutConfirm(false);
  };

  return (
    <>
      {/* Mobile Top Bar with Logo and User Actions */}
      <header className='fixed top-0 left-0 z-50 w-full border-b bg-white lg:hidden'>
        <div className='flex items-center justify-between px-4 py-3'>
          <div className='flex items-center gap-2'>
            <div className='flex h-10 w-10 items-center justify-center'>
              <img
                src={logoBK}
                alt='Logo'
                className='h-full w-full object-cover'
              />
            </div>
            <h1 className='text-xl font-semibold text-gray-800'>TSS</h1>
          </div>

          <div className='flex items-center gap-3'>
            {!isFaculty && (
              <button
                onClick={() => navigate('/notifications')}
                className='relative rounded-lg p-2 hover:bg-gray-100'
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className='absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white'>
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => navigate('/profile')}
              className='flex h-9 w-9 items-center justify-center rounded-full bg-gray-300 text-sm font-medium'
            >
              {user?.firstName?.[0] || 'U'}
              {user?.lastName?.[0] || 'U'}
            </button>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className='flex items-center gap-1 rounded-lg p-2 hover:bg-gray-100'
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <nav className='relative border-t'>
          {/* Gradient indicators for scrollability */}
          <div className='pointer-events-none absolute top-0 left-0 z-10 h-full w-4 bg-gradient-to-r from-white to-transparent' />
          <div className='pointer-events-none absolute top-0 right-0 z-10 h-full w-4 bg-gradient-to-l from-white to-transparent' />

          <div className='mobile-nav-scroll flex items-center gap-3 overflow-x-auto px-3'>
            {!isFaculty && (
              <MobileNavItem
                icon={<Home size={18} />}
                label='Dashboard'
                active={isActive('/dashboard')}
                onClick={() => navigate('/dashboard')}
              />
            )}

            {isMentee && (
              <>
                <MobileNavItem
                  icon={<Compass size={18} />}
                  label='Explore Mentors'
                  active={isActive('/matching/explore-mentors')}
                  onClick={() => navigate('/matching/explore-mentors')}
                />
                <MobileNavItem
                  icon={<UserCheck size={18} />}
                  label='Matched Mentors'
                  active={isActive('/matching/matched-mentors')}
                  onClick={() => navigate('/matching/matched-mentors')}
                />
                <MobileNavItem
                  icon={<UserPlus size={18} />}
                  label='Matching Requests'
                  active={isActive('/matching/requests')}
                  onClick={() => navigate('/matching/requests')}
                />
                <MobileNavItem
                  icon={<Send size={18} />}
                  label='Sent Requests'
                  active={isActive('/session/sent-requests')}
                  onClick={() => navigate('/session/sent-requests')}
                />
                <MobileNavItem
                  icon={<Inbox size={18} />}
                  label='Received Requests'
                  active={isActive('/session/received-requests')}
                  onClick={() => navigate('/session/received-requests')}
                />
              </>
            )}

            {isMentor && (
              <>
                <MobileNavItem
                  icon={<Users size={18} />}
                  label='Matched Mentees'
                  active={isActive('/mentor/matched-mentees')}
                  onClick={() => navigate('/mentor/matched-mentees')}
                />
                <MobileNavItem
                  icon={<UserPlus size={18} />}
                  label='Matching Requests'
                  active={isActive('/mentor/matching-requests')}
                  onClick={() => navigate('/mentor/matching-requests')}
                />
                <MobileNavItem
                  icon={<Inbox size={18} />}
                  label='Received Requests'
                  active={isActive('/mentor/received-requests')}
                  onClick={() => navigate('/mentor/received-requests')}
                />
                <MobileNavItem
                  icon={<Calendar size={18} />}
                  label='My Availability'
                  active={isActive('/mentor/my-availability')}
                  onClick={() => navigate('/mentor/my-availability')}
                />
                <MobileNavItem
                  icon={<MessageCircleMore size={18} />}
                  label='Feedback'
                  active={isActive('/mentor/feedback')}
                  onClick={() => navigate('/mentor/feedback')}
                />
              </>
            )}

            {isFaculty && (
              <MobileNavItem
                icon={<FileText size={18} />}
                label='Reports'
                active={isActive('/reports')}
                onClick={() => navigate('/reports')}
              />
            )}
          </div>
        </nav>
      </header>

      {/* Desktop Sidebar */}
      <aside className='3xl:w-96 fixed top-0 left-0 hidden h-screen w-56 flex-col justify-between overflow-y-auto border-r bg-white lg:flex'>
        {/* --- Header --- */}
        <div>
          <div className='3xl:px-6 3xl:py-5 flex items-center border-b px-4 py-1'>
            <div className='flex h-18 w-18 items-center justify-center rounded-full text-3xl font-semibold text-white'>
              <img
                src={logoBK}
                alt='Logo'
                className='object-scale-up h-full w-full overflow-hidden object-cover'
              />
            </div>
            <h1 className='3xl:text-4xl ml-2 text-2xl font-semibold text-gray-800'>
              TSS
            </h1>
          </div>

          {/* --- Navigation --- */}
          <nav className='3xl:space-y-4 mt-4 space-y-1 px-4 text-gray-700'>
            {/* Dashboard and Notifications (Mentee and Mentor only) */}
            {!isFaculty && (
              <>
                <SidebarItem
                  icon={<Home size={24} />}
                  label='Dashboard'
                  active={isActive('/dashboard')}
                  onClick={() => navigate('/dashboard')}
                />

                <SidebarItem
                  icon={<Bell size={24} />}
                  label='Notifications'
                  badge={unreadCount}
                  active={isActive('/notifications')}
                  onClick={() => navigate('/notifications')}
                />
              </>
            )}

            {/* --- Mentee Navigation --- */}
            {isMentee && (
              <>
                <SectionTitle title='Matching' />
                <SidebarItem
                  icon={<Compass size={24} />}
                  label='Explore Mentors'
                  active={isActive('/matching/explore-mentors')}
                  onClick={() => navigate('/matching/explore-mentors')}
                />
                <SidebarItem
                  icon={<UserCheck size={24} />}
                  label='Matched Mentors'
                  active={isActive('/matching/matched-mentors')}
                  onClick={() => navigate('/matching/matched-mentors')}
                />
                <SidebarItem
                  icon={<UserPlus size={24} />}
                  label='Matching Requests'
                  active={isActive('/matching/requests')}
                  onClick={() => navigate('/matching/requests')}
                />

                <SectionTitle title='Session Requests' />
                <SidebarItem
                  icon={<Send size={24} />}
                  label='Sent Requests'
                  active={isActive('/session/sent-requests')}
                  onClick={() => navigate('/session/sent-requests')}
                />
                <SidebarItem
                  icon={<Inbox size={24} />}
                  label='Received Requests'
                  active={isActive('/session/received-requests')}
                  onClick={() => navigate('/session/received-requests')}
                />
              </>
            )}

            {/* --- Mentor Navigation --- */}
            {isMentor && (
              <>
                <SectionTitle title='Matching' />
                <SidebarItem
                  icon={<Users size={24} />}
                  label='Matched Mentees'
                  active={isActive('/mentor/matched-mentees')}
                  onClick={() => navigate('/mentor/matched-mentees')}
                />
                <SidebarItem
                  icon={<UserPlus size={24} />}
                  label='Matching Requests'
                  active={isActive('/mentor/matching-requests')}
                  onClick={() => navigate('/mentor/matching-requests')}
                />

                <SectionTitle title='Sessions' />
                <SidebarItem
                  icon={<Inbox size={24} />}
                  label='Received Requests'
                  active={isActive('/mentor/received-requests')}
                  onClick={() => navigate('/mentor/received-requests')}
                />
                <SidebarItem
                  icon={<Calendar size={24} />}
                  label='My Availability'
                  active={isActive('/mentor/my-availability')}
                  onClick={() => navigate('/mentor/my-availability')}
                />
                <SidebarItem
                  icon={<MessageCircleMore size={24} />}
                  label='Feedback'
                  active={isActive('/mentor/feedback')}
                  onClick={() => navigate('/mentor/feedback')}
                />
              </>
            )}

            {/* --- Faculty Navigation (Reports Only) --- */}
            {isFaculty && (
              <>
                <SectionTitle title='Analytics' />
                <SidebarItem
                  icon={<FileText size={24} />}
                  label='Reports'
                  active={isActive('/reports')}
                  onClick={() => navigate('/reports')}
                />
              </>
            )}

            {/* --- Help (for all roles) --- */}
            <SectionTitle title=' ' />
            <SidebarItem
              icon={<HelpCircle size={24} />}
              label='Help'
              active={isActive('/help')}
              onClick={() => navigate('/help')}
            />
          </nav>
        </div>

        {/* --- User info + Logout --- */}
        <div className='3xl:space-y-3 3xl:py-8 space-y-1 border-t px-4 py-2'>
          <div
            onClick={() => {
              if (!isFaculty) navigate('/profile');
            }}
            className='flex cursor-pointer items-center rounded-lg p-2 transition hover:bg-gray-100'
          >
            <div className='3xl:h-18 3xl:w-18 flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-xl font-medium'>
              {user?.firstName?.[0] || 'U'}
              {user?.lastName?.[0] || 'U'}
            </div>
            <div className='ml-3'>
              <p className='3xl:text-2xl truncate text-left text-sm font-medium text-gray-800'>
                {user ? `${user.firstName} ${user.lastName}` : 'User Name'}
              </p>
              <p className='3xl:text-md truncate text-left text-xs text-gray-500'>
                {user?.department || 'Department'}
              </p>
              <div
                className={`inline-flex items-center justify-start rounded-full px-2 py-0.5 text-left text-xs font-medium ${
                  isMentor
                    ? 'bg-blue-100 text-blue-800'
                    : isFaculty
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-green-100 text-green-800'
                }`}
              >
                {isMentor ? 'Mentor' : isFaculty ? 'Faculty' : 'Mentee'}
              </div>
            </div>
          </div>

          <SidebarItem
            icon={<LogOut size={24} />}
            label='Log Out'
            onClick={() => setShowLogoutConfirm(true)}
          />
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/40'>
          <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>
            <h3 className='mb-4 text-xl font-semibold text-gray-800'>
              Confirm Logout
            </h3>
            <p className='mb-6 text-base text-gray-600'>
              Are you sure you want to log out?
            </p>
            <div className='flex justify-end gap-3'>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className='rounded-lg border border-gray-300 px-6 py-2 text-base font-medium text-gray-700 hover:bg-gray-100'
              >
                No
              </button>
              <button
                onClick={handleLogout}
                className='rounded-lg bg-red-500 px-6 py-2 text-base font-medium text-white hover:bg-red-600'
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
