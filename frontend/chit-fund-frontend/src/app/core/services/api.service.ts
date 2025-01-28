import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '@app/shared/models/user.model';
import { Group } from '@app/shared/models/group.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080'; // Update this with your actual API URL

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/api/users`);
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/api/users/email/${email}`);
  }

  getAllGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.baseUrl}/api/groups`);
  }

  getGroupById(id: string): Observable<Group> {
    return this.http.get<Group>(`${this.baseUrl}/api/groups/${id}`);
  }

  getGroupParticipants(groupId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/api/groups/${groupId}/participants`);
  }
}