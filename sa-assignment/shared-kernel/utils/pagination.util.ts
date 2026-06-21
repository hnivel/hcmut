export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export function paginate<T>(
  data: T[],
  params: PaginationParams = {},
): PaginationResult<T> {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 20));
  const start = (page - 1) * limit;

  return {
    data: data.slice(start, start + limit),
    total: data.length,
    page,
    limit,
  };
}
