import { useState } from 'react';
import SidebarWrapper from '@/components/layouts/SidebarWrapper';
import NotificationHeader from './components/NotificationHeader';
import NotificationList from './components/NotificationList';
import DashboardFooter from '@/components/layouts/Footer';

const NotificationPage = () => {
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');

  return (
    <div className='page-layout'>
      {/* Responsive Sidebar Wrapper */}
      <SidebarWrapper />

      {/* Main Content */}
      <div className='flex flex-1 flex-col'>
        <main className='w-full flex-1 py-12 md:py-16'>
          <div className='page-container'>
            {/* Header */}
            <div className='page-header'>
              <h1 className='page-title'>Notifications</h1>
            </div>

            <NotificationHeader filter={filter} onFilterChange={setFilter} />
            <div className='3xl:space-y-5 space-y-2'>
              <NotificationList filter={filter} />
            </div>
          </div>
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
};

export default NotificationPage;
