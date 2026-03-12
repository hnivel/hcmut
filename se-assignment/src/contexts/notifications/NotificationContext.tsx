import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { mockNotifications as menteeNotificationsData } from '@/constants/data';
import { mockNotifications as mentorNotificationsData } from '@/pages/mentor/constants/mentorData';
import { type Notification } from '@/constants/data';
import { useRole } from '@/hooks/auth/useRole';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (ids: string[]) => void;
  markSingleAsRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { isMentor } = useRole();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Initialize notifications based on role
  useEffect(() => {
    setNotifications(
      isMentor ? mentorNotificationsData : menteeNotificationsData,
    );
  }, [isMentor]);

  const unreadCount = notifications.filter((n) => n.status === 'unread').length;

  const markAsRead = (ids: string[]) => {
    setNotifications((prev) =>
      prev.map((n) => (ids.includes(n.id) ? { ...n, status: 'read' } : n)),
    );
  };

  const markSingleAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'read' } : n)),
    );
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markSingleAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider',
    );
  }
  return context;
};
