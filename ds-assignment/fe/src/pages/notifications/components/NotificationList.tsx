import { Bell } from 'lucide-react';

const NotificationList = () => {
  return (
    <div className='rounded-lg border bg-white p-12 text-center shadow-sm'>
      <Bell
        className='mx-auto mb-4 h-16 w-16 text-gray-300'
        strokeWidth={1.5}
      />
      <h3 className='mb-2 text-xl font-semibold text-gray-700'>
        No notifications
      </h3>
      <p className='text-gray-500'>
        You don't have any notifications at the moment.
      </p>
    </div>
  );
};

export default NotificationList;
