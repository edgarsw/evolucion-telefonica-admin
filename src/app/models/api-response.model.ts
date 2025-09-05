import { StatusResponse } from "../enums/status-response.enum";
import { Pagination } from "./pagination.model";

export interface ApiResponse<T> {
  status: StatusResponse;
  message: string;
  data: T;
  total?: number;
  error?: {
    code: number;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  status: 'success' | 'fail' | 'error';
  data: T[];
  pagination: Pagination;
  message: string;
  error?: {
    code: number;
    message: string;
  };
}