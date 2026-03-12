import { useState, useCallback } from 'react';

export type FilterValue = string | number | boolean | undefined;

export interface UseFiltersResult<T extends Record<string, FilterValue>> {
  filters: T;
  setFilter: <K extends keyof T>(key: K, value: T[K]) => void;
  setFilters: (filters: Partial<T>) => void;
  clearFilter: (key: keyof T) => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
}

export const useFilters = <T extends Record<string, FilterValue>>(
  initialFilters: T,
): UseFiltersResult<T> => {
  const [filters, setFiltersState] = useState<T>(initialFilters);

  const setFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFiltersState((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const setFilters = useCallback((newFilters: Partial<T>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const clearFilter = useCallback(
    (key: keyof T) => {
      setFiltersState((prev) => ({
        ...prev,
        [key]: initialFilters[key],
      }));
    },
    [initialFilters],
  );

  const clearAllFilters = useCallback(() => {
    setFiltersState(initialFilters);
  }, [initialFilters]);

  const hasActiveFilters = Object.keys(filters).some(
    (key) => filters[key] !== initialFilters[key] && filters[key] !== undefined,
  );

  return {
    filters,
    setFilter,
    setFilters,
    clearFilter,
    clearAllFilters,
    hasActiveFilters,
  };
};
