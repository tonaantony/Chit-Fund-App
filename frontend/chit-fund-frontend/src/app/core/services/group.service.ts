import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group, ChitCalculationDTO, ChitPlanDTO, JoinRequestResponse } from '@app/shared/models/group.model';

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

  requestToJoin(groupId: string, userId: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/join`, { groupId, userId }, 
      { responseType: 'text' });
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


// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class GroupService {
//   private apiUrl = 'http://localhost:8083/api/groups';

//   constructor(private http: HttpClient) {}

//   getAllGroups(): Observable<any[]> {
//     return this.http.get<any[]>(this.apiUrl);
//   }

//   getGroupById(id: string): Observable<any> {
//     return this.http.get<any>(`${this.apiUrl}/${id}`);
//   }

//   requestToJoin(groupId: string, userId: string): Observable<any> {
//     return this.http.post(`${this.apiUrl}/join`, { groupId, userId });
//   }
// }




  getGroupsByOrganizer(organizerId: string): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/organizer/${organizerId}`);
  }

  acceptJoinRequest(groupId: string, userId: string): Observable<JoinRequestResponse> {
    return this.http.post<JoinRequestResponse>(
      `${this.apiUrl}/${groupId}/accept-join/${userId}`,
      {}
    );
  }

  createGroup(group: Group): Observable<Group> {
    return this.http.post<Group>(this.apiUrl, group);
  }

  // getAllGroups(): Observable<Group[]> {
  //   return this.http.get<Group[]>(this.apiUrl);
  // }

  // getGroupById(groupId: string): Observable<Group> {
  //   return this.http.get<Group>(`${this.apiUrl}/${groupId}`);
  // }

}