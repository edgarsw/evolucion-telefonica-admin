import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { ApiResponse } from '../models/api-response.model';

export interface SubBranchType {
  subBranchTypeId: string;
}

@Injectable({ providedIn: 'root' })
export class SubBranchTypeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/theevolution/sub-branch-types`;

  getAll(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(this.apiUrl);
  }
}
