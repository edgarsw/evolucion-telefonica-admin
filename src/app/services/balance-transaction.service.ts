import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { ApiResponse } from '../models/api-response.model';
import { BalanceTransaction } from '../models/balance-transaction.model';
@Injectable({
  providedIn: 'root',
})
export class BalanceTransactionService {
  private baseUrl = `${environment.apiUrl}/theevolution/transactions`;

  constructor(private http: HttpClient) {}

  /**
   * Get all transactions
   */
  getAll(): Observable<ApiResponse<BalanceTransaction[]>> {
    return this.http.get<ApiResponse<BalanceTransaction[]>>(this.baseUrl);
  }

  /**
   * Create a new transaction
   */
  create(
    transaction: Partial<BalanceTransaction>
  ): Observable<ApiResponse<BalanceTransaction>> {
    return this.http.post<ApiResponse<BalanceTransaction>>(this.baseUrl, transaction);
  }
}
