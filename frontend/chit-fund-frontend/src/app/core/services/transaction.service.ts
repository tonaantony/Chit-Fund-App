import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Transaction {
  transactionId: string;
  transactionAmount: number;
  transactionDate: Date;
  transactionType: string;
  userId: string;
  groupId: string;
  transactionFrom: string;
  transactionTo: string; // Assuming 'transactionTo' is present in the transaction object
  
  // Add other transaction properties as needed
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl = 'http://localhost:8084/transactions'; // Adjust port as needed

  constructor(private http: HttpClient) { }

  createTransaction(transaction: Transaction): Observable<string> {
    return this.http.post<string>(this.baseUrl, transaction);
  }

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/all`);
  }

  getTransactionById(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.baseUrl}/find/${id}`);
  }

  getTransactionsByUserId(userId: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/find/user/${userId}`);
  }

  getTransactionsByGroupId(groupId: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/find/group/${groupId}`);
  }

  getTransactionsByType(type: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/find/type/${type}`);
  }
}