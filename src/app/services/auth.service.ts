// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private base = environment.apiUrl;
    private apiAuth = this.base + '/theevolution/auth';
    private tokenKey = 'access_token';
    private refreshKey = 'refresh_token';

    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        return this.http.post<any>(`${this.apiAuth}/login`, { username, password }).pipe(
            tap(res => {
                localStorage.setItem(this.tokenKey, res.token);
                localStorage.setItem(this.refreshKey, res.refreshToken);
            })
        );
    }

    getRoles() {
        return this.http.get(`${this.apiAuth}/roles`);
    }

    refreshToken() {
        const refreshToken = localStorage.getItem(this.refreshKey);
        return this.http.post<any>(`${this.apiAuth}/refresh-token`, { refreshToken }).pipe(
            tap(res => {
                localStorage.setItem(this.tokenKey, res.token);
                localStorage.setItem(this.refreshKey, res.refreshToken);
            })
        );
    }

    logout() {
        const token = localStorage.getItem(this.tokenKey);
        return this.http.post(`${this.apiAuth}/logout`, { token }).pipe(
            tap(() => {
                localStorage.removeItem(this.tokenKey);
                localStorage.removeItem(this.refreshKey);
            })
        );
    }

    getToken() {
        return localStorage.getItem(this.tokenKey);
    }
}
