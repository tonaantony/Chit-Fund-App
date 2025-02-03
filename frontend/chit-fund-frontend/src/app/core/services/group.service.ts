import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group, ChitCalculationDTO, ChitPlanDTO, JoinRequestResponse } from '@app/shared/models/group.model';
import { JoinRequestDTO } from '@app/shared/models/join-request.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = 'http://localhost:8083/api/groups';  // Direct URL instead of environment

  constructor(private http: HttpClient) { }


  getAllGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.apiUrl);
  }

  getGroupById(groupId: string): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/${groupId}`);
  }

  updateGroup(groupId: string, group: Partial<Group>): Observable<Group> {
    return this.http.put<Group>(`${this.apiUrl}/${groupId}`, group);
  }

  deleteGroup(groupName: string): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${groupName}`, { responseType: 'text' });
  }

  requestToJoinGroup(groupId: string, userId: string): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post(`${this.apiUrl}/join`, { groupId, userId }, { headers });
  }

  addParticipant(groupId: string, userId: string, organizerId: string): Observable<string> {
    const headers = new HttpHeaders().set('X-User-Id', organizerId);
    return this.http.post(
      `${this.apiUrl}/${groupId}/add-participant`,
      { userId },
      { headers, responseType: 'text' }
    );
  }

  getParticipants(groupId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${groupId}/participants`);
  }

  calculateChit(calculation: ChitCalculationDTO): Observable<ChitPlanDTO[]> {
    return this.http.post<ChitPlanDTO[]>(`${this.apiUrl}/calculate-chit`, calculation);
  }

  getGroupsByOrganizer(organizerId: string): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/organizer/${organizerId}`);
  }

  acceptJoinRequest(groupId: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${groupId}/accept-join/${userId}`, {});
  }

  createGroup(group: Group): Observable<Group> {
    return this.http.post<Group>(this.apiUrl, group);
  }

}