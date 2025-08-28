import { StatusResponse } from "../enums/status-response.enum";

export interface ApiResponse<T> {
  status: StatusResponse;
  message: string;
  data: T;
  error?: {
    code: number;
    message: string;
  };
}
