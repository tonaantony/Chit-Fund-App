import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '@app/shared/models/user.model';
import { AuthService } from './auth.service';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private apiUrl = 'http://localhost:8082/api/users'; // Adjust URL as needed

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  registerUser(userData: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData);
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/email/${email}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`);
  }

  updateProfile(userEmail: string, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/edit/${userEmail}`, userData);
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.token;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getListOfGroups(userId: string): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/groups/${userId}`, { headers });
  }

  // Add these methods to your existing UserService

  getUserGroups(userId: string): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/groups/${userId}`, { headers }).pipe(
      tap(response => console.log('Raw API Response:', response)),
      catchError(error => {
        console.error('API Error:', error);
        throw error;
      })
    );
  }

  leaveGroup(userEmail: string, groupId: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/groups/${groupId}/leave/${userEmail}`, { headers });
  }
  // ... other methods
  updateUserProfile(email: string, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/edit/${email}`, userData);
  }

  deactivateUser(userId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${userId}/deactivate`, {});
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }
}
