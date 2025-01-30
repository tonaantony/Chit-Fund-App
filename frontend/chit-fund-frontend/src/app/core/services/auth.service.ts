import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '@app/shared/models/user.model';
import { isPlatformBrowser } from '@angular/common';

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
  private isBrowser: boolean;
  private roleKey = 'userRole';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;


  // constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: any) {
  //   if (isPlatformBrowser(this.platformId)) {
  //     const userData = localStorage.getItem('currentUser');
  //     if (userData) {
  //       this.currentUserSubject.next(JSON.parse(userData));
  //     }
  //   }
  // }
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

   //constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  // register(user: any): Observable<any> {
  //   console.log('Sending registration request to:', `${this.baseUrl}/register`);
  //   console.log('With user data:', user);
    
  //   return this.http.post(`${this.baseUrl}/register`, user)
  //     .pipe(
  //       tap(response => console.log('Registration response:', response)),
  //       catchError(this.handleError)
  //     );
  // }

  register(user: any): Observable<any> {
    console.log('Sending registration request to:', `${this.baseUrl}/register`);
    console.log('With user data:', user);
    
    return this.http.post(`${this.baseUrl}/register`, user)
      .pipe(
        tap(response => console.log('Registration response:', response)),
        catchError(this.handleError)
      );
  }

  // login(userEmail: string, password: string): Observable<LoginResponse> {
  //   return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { userEmail, password })
  //     .pipe(
  //       tap((response: LoginResponse) => {
  //         if (response.token) {
  //           localStorage.setItem(this.tokenKey, response.token);
  //           // Store the role in local storage
  //           const role = this.getRoleFromToken(response.token);
  //           localStorage.setItem(this.roleKey, role);
  //         }
  //       }),
  //       catchError(this.handleError)
  //     );
  // }

  // login(userEmail: string, password: string): Observable<LoginResponse> {
  //   return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { userEmail, password })
  //     .pipe(
  //       tap((response: LoginResponse) => {
  //         if (response.token) {
  //           localStorage.setItem(this.tokenKey, response.token);
  //           const role = this.getRoleFromToken(response.token);
  //           localStorage.setItem(this.roleKey, role);
  //         }
  //       }),
  //       catchError(this.handleError)
  //     );
  // }

  login(userEmail: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { userEmail, password })
      .pipe(
        tap((response: LoginResponse) => {
          if (response.token) {
            localStorage.setItem(this.tokenKey, response.token);
            const role = this.getRoleFromToken(response.token);
            localStorage.setItem(this.roleKey, role);
            console.log('Token stored:', response.token);
            console.log('Role stored:', role);
          }
        }),
        catchError(this.handleError)
      );
  }


  // logout(): void {
  //   localStorage.removeItem(this.tokenKey);
  // }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
  }

  // getToken(): string | null {
  //   return localStorage.getItem(this.tokenKey);
  // }

  // getRole(): string | null {
  //   return localStorage.getItem(this.roleKey); // Retrieve the role from local storage
  // }

  // isLoggedIn(): boolean {
  //   return !!this.getToken();
  // }

  // getToken(): string | null {
  //   if (typeof window !== 'undefined' && localStorage) {
  //     return localStorage.getItem('token');
  //   }
  //   return null;
  // }

  getToken(): string | null {
    return this.getLocalStorage('token');
  }

  setToken(token: string): void {
    this.setLocalStorage('token', token);
  }

  getRole(): string | null {
    return this.getLocalStorage('userRole');
  }

  setRole(role: string): void {
    this.setLocalStorage('userRole', role);
  }

  // private handleError(error: HttpErrorResponse) {
  //   console.error('API Error:', error);
  //   let errorMessage = 'An error occurred';
    
  //   if (error.error instanceof ErrorEvent) {
  //     // Client-side error
  //     errorMessage = error.error.message;
  //   } else {
  //     // Server-side error
  //     errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
  //   }
    
  //   console.error('Processed error message:', errorMessage);
  //   return throwError(() => new Error(errorMessage));
  // }

  private getLocalStorage(key: string): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private setLocalStorage(key: string, value: string): void {
    if (this.isBrowser) {
      localStorage.setItem(key, value);
    }
  }

  private removeLocalStorage(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    }
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

  // private getRoleFromToken(token: string): string {
  //   const decodedToken = this.decodeToken(token);
  //   return decodedToken.role || '';
  // }
  // private getRoleFromToken(token: string): string {
  //   const decodedToken = this.decodeToken(token);
  //   return decodedToken.role || '';
  // }

  private getRoleFromToken(token: string): string {
    const decodedToken = this.decodeToken(token);
    console.log('Decoded Token:', decodedToken);
    return decodedToken.role || '';
  }

  // private decodeToken(token: string): any {
  //   const base64Url = token.split('.')[1];
  //   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  //   const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
  //       return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  //   }).join(''));

  //   return JSON.parse(jsonPayload);
  // }
  private decodeToken(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  updateUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
