import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { tabs } from '../constants';

interface Props {
  filter: 'all' | 'read' | 'unread';
  onFilterChange: (value: 'all' | 'read' | 'unread') => void;
}

const NotificationHeader = ({ filter, onFilterChange }: Props) => {
  return (
    <div className='mb-6'>
      <NavigationMenu>
        <NavigationMenuList className='flex gap-4'>
          {tabs.map((tab) => (
            <NavigationMenuItem key={tab.key}>
              <button
                onClick={() =>
                  onFilterChange(tab.key as 'all' | 'read' | 'unread')
                }
                className={`3xl:text-xl flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all ${
                  filter === tab.key
                    ? 'bg-slate-700 text-white shadow-lg'
                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className='h-5 w-5' />
                <span>{tab.label}</span>
              </button>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default NotificationHeader;
