import { useState, useCallback } from 'react';

export type SortOrder = 'asc' | 'desc';

export interface UseSortingResult {
  sortBy: string;
  sortOrder: SortOrder;
  setSortBy: (field: string) => void;
  setSortOrder: (order: SortOrder) => void;
  toggleSortOrder: () => void;
  handleSort: (field: string) => void;
  reset: () => void;
}

export interface UseSortingOptions {
  initialSortBy?: string;
  initialSortOrder?: SortOrder;
}

export const useSorting = (
  options: UseSortingOptions = {},
): UseSortingResult => {
  const { initialSortBy = 'name', initialSortOrder = 'asc' } = options;

  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);

  const toggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  const handleSort = useCallback(
    (field: string) => {
      setSortBy((prev) => {
        if (prev === field) {
          toggleSortOrder();
          return prev;
        }
        setSortOrder('asc');
        return field;
      });
    },
    [toggleSortOrder],
  );

  const reset = useCallback(() => {
    setSortBy(initialSortBy);
    setSortOrder(initialSortOrder);
  }, [initialSortBy, initialSortOrder]);

  return {
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    toggleSortOrder,
    handleSort,
    reset,
  };
};
