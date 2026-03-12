import { Button } from '@/components/ui/button';
import { MoveUp, MoveDown } from 'lucide-react';

export type SortOrder = 'asc' | 'desc';

export interface SortableHeaderProps {
  label: string;
  field: string;
  currentSortBy: string;
  currentSortOrder: SortOrder;
  onSort: (field: string) => void;
}

export const SortableHeader = ({
  label,
  field,
  currentSortBy,
  currentSortOrder,
  onSort,
}: SortableHeaderProps) => {
  const isActive = currentSortBy === field;

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={() => onSort(field)}
      className={`h-9 px-4 rounded-lg font-semibold ${isActive ? "bg-orange-100 text-orange-800 hover:bg-orange-200 hover:text-orange-800" : "text-stone-700 hover:bg-stone-200"}`}
    >
      {label}
      {isActive && (
        <span className='ml-1'>{currentSortOrder === 'asc' ? <MoveUp size={16} /> : <MoveDown size={16} />}</span>
      )}
    </Button>
  );
};
