import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '@app/shared/models/user.model';
import { StorageService } from './storage.service';

export interface LoginRequest {
  userEmail: string;
  password: string;
}

// Define interface for login response
interface LoginResponse {
  token: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8081/auth';
  private tokenKey = 'token';
  private roleKey = 'userRole';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;


  // constructor(private http: HttpClient) {
  //   const userData = localStorage.getItem('currentUser');
  //   if (userData) {
  //     this.currentUserSubject.next(JSON.parse(userData));
  //   }
  //  }
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      const userData = await this.storageService.getItem('currentUser');
      if (userData) {
        this.currentUserSubject.next(JSON.parse(userData));
      }
      this.token = await this.storageService.getItem('token');
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
  }

  register(user: any): Observable<any> {
    console.log('Sending registration request to:', `${this.baseUrl}/register`);
    console.log('With user data:', user);
    
    return this.http.post(`${this.baseUrl}/register`, user)
      .pipe(
        tap(response => console.log('Registration response:', response)),
        catchError(this.handleError)
      );
  }

  
  login(loginRequest: any): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/login`, loginRequest).pipe(
      tap(async (token: string) => {
        await this.storageService.setItem(this.tokenKey, token);
        this.token = token;
      }),
      catchError(this.handleError)
    );
  }

  async getToken(): Promise<string | null> {
    return await this.storageService.getItem(this.tokenKey);
  }

  async getRole(): Promise<string | null> {
    return await this.storageService.getItem(this.roleKey);
  }

  async isLoggedIn(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  getUserDetails(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/details`).pipe(
      tap(async (user: any) => {
        await this.storageService.setItem(this.roleKey, user.userRole.name);
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

 

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error('Processed error message:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

 

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
  updateUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

}
