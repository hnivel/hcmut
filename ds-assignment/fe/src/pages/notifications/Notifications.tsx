import Sidebar from '@/components/layouts/Sidebar';
import NotificationHeader from './components/NotificationHeader';
import NotificationList from './components/NotificationList';

const Notifications = () => {
  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />
      <div className='mt-4 ml-64 flex-1 pr-8'>
        <div className='container mx-auto max-w-7xl px-4 py-6 text-left'>
          <NotificationHeader />
          <NotificationList />
        </div>
      </div>
    </div>
  );
};

export default Notifications;
