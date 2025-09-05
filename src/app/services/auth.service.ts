import { Injectable, Inject, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../environment/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private base = environment.apiUrl;
    private apiAuth = this.base + '/theevolution/auth';
    private tokenKey = 'access_token';
    private refreshKey = 'refresh_token';

    private http = inject(HttpClient);
    private platformId = inject(PLATFORM_ID);

    private setTokens(token: string, refreshToken: string): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.tokenKey, token);
            localStorage.setItem(this.refreshKey, refreshToken);
        }
    }

    private clearTokens(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(this.tokenKey);
            localStorage.removeItem(this.refreshKey);
        }
    }

    getToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem(this.tokenKey);
        }
        return null;
    }

    getRefreshToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem(this.refreshKey);
        }
        return null;
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${this.apiAuth}/login`, { username, password }).pipe(
            tap(res => this.setTokens(res.token, res.refreshToken))
        );
    }

    loginEmployee(username: string, password: string) {
        return this.http.post<any>(`${this.apiAuth}/login-employee`, { username, password }).pipe(
            tap(res => this.setTokens(res.token, res.refreshToken))
        );
    }

    getRoles() {
        return this.http.get(`${this.apiAuth}/roles`);
    }

    refreshToken() {
        const refreshToken = this.getRefreshToken();
        return this.http.post<any>(`${this.apiAuth}/refresh-token`, { refreshToken }).pipe(
            tap(res => this.setTokens(res.token, res.refreshToken))
        );
    }

    logout() {
        const token = this.getToken();
        return this.http.post(`${this.apiAuth}/logout`, { token }).pipe(
            tap(() => this.clearTokens())
        );
    }

    isLoggedIn(): boolean {
        const token = this.getToken();
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1])); // decode JWT payload
            const now = Math.floor(Date.now() / 1000);
            return payload.exp && payload.exp > now;
        } catch {
            return false;
        }
    }
}
