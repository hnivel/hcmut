import { useState, useEffect } from 'react';
import { ITEMS_PER_PAGE_OPTIONS } from '../constants';
import { useNotifications } from '@/contexts/notifications/NotificationContext';
import { getMentorById } from '@/constants/data';
import { getMenteeById } from '@/pages/mentor/constants/mentorData';
import {
  Bell,
  ArrowLeft,
  ArrowRight,
  Calendar,
  UserCheck,
  AlertCircle,
  MessageSquare,
  Info,
} from 'lucide-react';

interface Props {
  filter: 'all' | 'read' | 'unread';
}

const notificationIcons = {
  session_request: Calendar,
  reschedule_request: AlertCircle,
  matching_request: UserCheck,
  session_reminder: Bell,
  session_cancelled: AlertCircle,
  feedback_request: MessageSquare,
  general: Info,
};

const NotificationList = ({ filter }: Props) => {
  const {
    notifications,
    markAsRead: contextMarkAsRead,
    markSingleAsRead,
  } = useNotifications();
  const [selected, setSelected] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);

  const filteredNotifications =
    filter === 'all'
      ? notifications
      : notifications.filter((n) => n.status === filter);

  const totalItems = filteredNotifications.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredNotifications.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  useEffect(() => {
    setSelected([]);
    setCurrentPage(1);
  }, [filter, itemsPerPage]);

  const showingFrom = totalItems === 0 ? 0 : startIndex + 1;
  const showingTo = Math.min(startIndex + itemsPerPage, totalItems);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const selectAll = () => {
    if (selected.length === paginatedData.length) setSelected([]);
    else setSelected(paginatedData.map((n) => n.id));
  };

  const markAsRead = () => {
    contextMarkAsRead(selected);
    setSelected([]);
  };

  const handleSingleMarkAsRead = (id: string) => {
    markSingleAsRead(id);
  };

  return (
    <div className='space-y-6'>
      {totalItems === 0 ? (
        <div className='rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500 shadow-sm sm:text-base md:text-lg lg:text-xl'>
          No notifications in{' '}
          <span className='font-medium text-gray-700'>
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </span>
          .
        </div>
      ) : (
        <>
          {selected.length > 0 && (
            <div className='flex items-center justify-between rounded-xl bg-slate-100 px-4 py-2 sm:px-5 md:px-6'>
              <span className='text-sm text-gray-700 sm:text-base md:text-lg 3xl:text-xl'>
                {selected.length} selected
              </span>
              <button
                onClick={markAsRead}
                className='rounded-lg font-semibold bg-slate-700 px-4 py-2 text-sm text-white transition hover:bg-slate-800 sm:px-5 sm:py-3 sm:text-base md:px-6 md:text-md 3xl:text-xl'
              >
                Mark as Read
              </button>
            </div>
          )}

          <div className='overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm'>
            <div className='flex items-center gap-2 border-b bg-gray-50 px-6 py-3 text-gray-700'>
              <input
                type='checkbox'
                checked={
                  selected.length === paginatedData.length &&
                  paginatedData.length > 0
                }
                onChange={selectAll}
                className='h-5 w-5 ml-2'
              />
              <span className='text-sm sm:text-base md:text-lg 3xl:text-xl'>
                Select all
              </span>
            </div>
            <ul className='w-full'>
              {paginatedData.map((n) => {
                const IconComponent = notificationIcons[n.type];
                const displayFrom =
                  (n.fromId &&
                    (getMentorById(n.fromId)?.name ||
                      getMenteeById(n.fromId)?.name)) ||
                  n.from ||
                  'System';
                return (
                  <li
                    key={n.id}
                    className={`flex w-full items-start gap-4 border-b px-4 py-4 transition last:border-none sm:px-5 md:px-6 lg:px-8 ${
                      n.status === 'read' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type='checkbox'
                      checked={selected.includes(n.id)}
                      onChange={() => toggleSelect(n.id)}
                      className='mt-2 h-5 w-5 flex-shrink-0'
                    />
                    <IconComponent className='mt-1 h-6 w-6 flex-shrink-0 text-slate-700' />
                    <div className='flex-1 space-y-1'>
                      <div className='flex items-center justify-between gap-4'>
                        <div className='flex-1'>
                          <div className='flex items-center gap-2 mb-2'>
                            <p className='text-left text-lg font-semibold text-gray-900 sm:text-xl md:text-2xl 3xl:text-3xl'>
                              {n.title}
                            </p>
                            {n.actionRequired && (
                              <span className='rounded-full bg-red-100 px-2 py-1 text-sm font-medium text-red-700'>
                                Action Required
                              </span>
                            )}
                          </div>
                          <p className='text-left text-sm text-gray-600 sm:text-base md:text-base 3xl:text-xl'>
                            {n.message}
                          </p>
                          {displayFrom && (
                            <p className='mt-1 text-left text-xs font-medium text-gray-500 sm:text-sm md:text-base 3xl:text-lg'>
                              From: {displayFrom}
                            </p>
                          )}
                          <p className='mt-1 text-left text-xs text-gray-400 sm:text-sm md:text-base 3xl:text-lg'>
                            {new Date(n.timestamp).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        {n.status === 'unread' && (
                          <button
                            onClick={() => handleSingleMarkAsRead(n.id)}
                            className='flex-shrink-0 rounded-lg bg-slate-700 px-4 py-2 text-base font-medium text-white transition hover:bg-slate-800 sm:px-5 sm:py-3 md:px-6 md:text-md 3xl:text-xl'
                          >
                            Mark as Read
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {totalPages > 1 && (
            <div className='mt-6 flex flex-col items-center justify-between gap-4 text-sm text-gray-600 sm:text-base md:flex-row md:text-lg 3xl:text-xl'>
              <div className='flex items-center gap-4'>
                <span>Rows per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className='rounded-md border px-3 py-2 text-sm text-gray-700 sm:text-base md:text-lg 3xl:text-xl'
                >
                  {ITEMS_PER_PAGE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <span>
                  {showingFrom}-{showingTo} of {totalItems}
                </span>
              </div>

              <div className='flex items-center gap-2'>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className='rounded-md bg-gray-100 p-2 text-gray-700 disabled:opacity-40'
                >
                  <ArrowLeft className='h-5 w-5' />
                </button>

                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`rounded-md px-4 py-2 ${
                      currentPage === idx + 1
                        ? 'bg-slate-700 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className='rounded-md bg-gray-100 p-2 text-gray-700 disabled:opacity-40'
                >
                  <ArrowRight className='h-5 w-5' />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NotificationList;
