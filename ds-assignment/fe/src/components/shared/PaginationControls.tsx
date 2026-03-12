import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface PaginationControlsProps {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  limitOptions?: number[];
}

export const PaginationControls = ({
  page,
  limit,
  totalPages,
  totalItems,
  onPageChange,
  onLimitChange,
  limitOptions = [10, 20, 50, 100],
}: PaginationControlsProps) => {
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  return (
    <div className='flex items-center justify-between gap-4 px-2'>
      <div className='text-muted-foreground flex items-center gap-2 text-sm'>
        <span>
          Showing {startItem}-{endItem} of {totalItems}
        </span>
        <Select
          value={limit.toString()}
          onValueChange={(value) => onLimitChange(Number(value))}
        >
          <SelectTrigger className='w-[70px]'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {limitOptions.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>per page</span>
      </div>

      <div className='flex items-center gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(1)}
          disabled={page === 1}
        >
          First
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className='text-sm'>
          Page {page} of {totalPages}
        </span>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
        >
          Last
        </Button>
      </div>
    </div>
  );
};
