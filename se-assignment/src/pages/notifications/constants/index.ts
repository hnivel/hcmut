import { FolderKanban, Inbox, CheckCircle } from 'lucide-react';

// Use the NotificationStatus from the main data constants
export type { NotificationStatus } from '@/constants/data';

export const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];

export const tabs = [
  { key: 'all', label: 'All', icon: Inbox },
  { key: 'unread', label: 'Unread', icon: FolderKanban },
  { key: 'read', label: 'Read', icon: CheckCircle },
];
