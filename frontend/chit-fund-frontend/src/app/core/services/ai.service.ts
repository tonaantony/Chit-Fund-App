
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = 'http://localhost:8085/api/ai/chat';

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<any> {
    return this.http.post(this.apiUrl, message);
  }
}