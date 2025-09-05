import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import { Client } from '../models/client.model';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private apiUrl = `${environment.apiUrl}/theevolution/client`;

  private http = inject(HttpClient);

  getClients(): Observable<ApiResponse<Client[]>> {
    return this.http.get<ApiResponse<Client[]>>(this.apiUrl);
  }

  // PENDIENTE: Implementar paginacion
  getClientsPaginated(page = 1, limit = 10): Observable<PaginatedResponse<Client>> {
    return this.http.get<PaginatedResponse<Client>>(
      `${this.apiUrl}/paginated?page=${page}&limit=${limit}`
    );
  }

  addClient(client: Client): Observable<ApiResponse<Client>> {
    return this.http.post<ApiResponse<Client>>(this.apiUrl, client);
  }

  deleteClient(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }

  updateClient(client: Client): Observable<ApiResponse<Client>> {
    return this.http.put<ApiResponse<Client>>(
      `${this.apiUrl}/${client.clientId}`,
      client
    );
  }
}
