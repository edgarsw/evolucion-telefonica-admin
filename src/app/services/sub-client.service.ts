import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { ApiResponse } from '../models/api-response.model';
import { SubClient } from '../models/client.model';

@Injectable({ providedIn: 'root' })
export class SubClientService {
    private apiUrl = `${environment.apiUrl}/theevolution/sub-users`;

    private http = inject(HttpClient);

    /**
     * Update a subclient
     */
    update(subClientId: number, payload: Partial<SubClient>): Observable<ApiResponse<SubClient>> {
        return this.http.put<ApiResponse<SubClient>>(
            `${this.apiUrl}/${subClientId}`,
            payload
        );
    }
}
