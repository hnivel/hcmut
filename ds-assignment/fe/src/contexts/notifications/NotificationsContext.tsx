import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface AppNotification {
  id: string;
  title: string;
  message: string;
  status: 'read' | 'unread';
  timestamp: string;
  type?: 'order' | 'delivery' | 'promotion' | 'system';
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (ids: string[]) => void;
  markSingleAsRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

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
