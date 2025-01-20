import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private authSubject = new BehaviorSubject<boolean>(this.isAuthenticated());

  constructor(private http: HttpClient) {}

  register(user: any) {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

  login(user: any) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, user);
  }

  setAuthStatus(status: boolean) {
    this.authSubject.next(status);
  }

  isAuthenticated() {
    return localStorage.getItem('token') !== null;
  }

  logout() {
    localStorage.removeItem('token');
    this.setAuthStatus(false);
  }

  getAuthStatus() {
    return this.authSubject.asObservable();
  }
}
