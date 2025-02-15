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
  user$ = this.currentUserSubject.asObservable();
  token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  userSubject = this.currentUserSubject.asObservable();


  // constructor(private http: HttpClient) {
  //   const userData = localStorage.getItem('currentUser');
  //   if (userData) {
  //     this.currentUserSubject.next(JSON.parse(userData));
  //   }
  //  }
  constructor(
    private http: HttpClient,
    public storageService: StorageService
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

  
  // login(loginRequest: any): Observable<string> {
  //   return this.http.post<string>(`${this.baseUrl}/login`, loginRequest).pipe(
  //     tap(async (token: string) => {
  //       await this.storageService.setItem(this.tokenKey, token);
  //       this.token = token;
  //     }),
  //     catchError(this.handleError)
  //   );
  // }

  // login(loginRequest: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/login`, loginRequest, {
  //     responseType: 'text' // Add this to handle text response
  //   }).pipe(
  //     tap(async (token: string) => {
  //       await this.storageService.setItem(this.tokenKey, token);
  //       this.token = token;
  //     }),
  //     catchError(this.handleError)
  //   );
  // }

  // login(loginRequest: any): Observable<string> {
  //   return this.http.post<string>(`${this.baseUrl}/login`, loginRequest, {
  //     responseType: 'text' as 'json'
  //   }).pipe(
  //     tap(async (token: string) => {
  //       await this.storageService.setItem(this.tokenKey, token); // Save token
  //       this.token = token; // Update the AuthService token
  //     }),
  //     catchError(this.handleError)
  //   );
  // }
  

  getUserByEmail(userEmail: string): Observable<any> {
  return this.http.get(`http://localhost:8082/api/users/email/${userEmail}`);
}

login(loginRequest: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/login`, loginRequest, {
    responseType: 'text',
  }).pipe(
    tap(async (token: string) => {
      await this.storageService.setItem(this.tokenKey, token);
      this.token = token;

      // Fetch and store user details after successful login
      const userDetails = await this.getUserByEmail(loginRequest.userEmail).toPromise();
      if (userDetails) {
        // Store complete user details
        await this.storageService.setItem('currentUser', JSON.stringify(userDetails));
        this.currentUserSubject.next(userDetails);
        await this.storageService.setItem(this.roleKey, loginRequest.role);
      } else {
        throw new Error('User details not found');
      }
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

  // getUserDetails(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/user/details`).pipe(
  //     tap(async (user: any) => {
  //       await this.storageService.setItem(this.roleKey, user.userRole.name);
  //     }),
  //     catchError(this.handleError)
  //   );
  // }

  // getUserDetails(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/user/details`).pipe(
  //     tap(async (user: any) => {
  //       await this.storageService.setItem(this.roleKey, user.userRole.name); // Store user role
  //     }),
  //     catchError(this.handleError)
  //   );
  // }

  getUserDetailsByEmail(email: string): Observable<any> {
    const url = `http://localhost:8082/api/users/${email}`; // Construct the URL
    return this.http.get(url).pipe(
      tap(async (user: any) => {
        console.log('User details response:', user); // Debug response
        if (user?.userRole?.name) {
          await this.storageService.setItem(this.roleKey, user.userRole.name); // Save role to storage
        } else {
          throw new Error('User role not found in response');
        }
      }),
      catchError(this.handleError) // Handle errors
    );
  }
  
  

  logout(): void {
    // Clear all stored data
    this.storageService.removeItem(this.tokenKey);
    this.storageService.removeItem('currentUser');
    this.storageService.removeItem(this.roleKey);
    this.currentUserSubject.next(null);
    this.token = null;
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
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  // Add method to get current user details
  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await this.storageService.getItem('currentUser');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Add method to initialize user session
  async initializeUserSession(): Promise<void> {
    try {
      const userData = await this.storageService.getItem('currentUser');
      if (userData) {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      }
      this.token = await this.storageService.getItem(this.tokenKey);
    } catch (error) {
      console.error('Error initializing user session:', error);
    }
  }

  isTokenExpired(token: string): boolean {
    // Decode the token to get the expiration date
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return true; // Token is invalid or has no expiration
    }
    const expirationDate = new Date(payload.exp * 1000); // Convert to milliseconds
    return expirationDate < new Date(); // Check if the token is expired
  }

  private decodeToken(token: string): any {
    // Decode the JWT token (this is a simple implementation)
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload)); // Decode base64 payload
  }

}
