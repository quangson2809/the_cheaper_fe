/** Universal response envelope from the backend */
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T | null;
  timestamp: string;
  path: string | null;
}

/** Spring Data paginated response */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;   // 0-based current page
  size: number;
  first: boolean;
  last: boolean;
}
