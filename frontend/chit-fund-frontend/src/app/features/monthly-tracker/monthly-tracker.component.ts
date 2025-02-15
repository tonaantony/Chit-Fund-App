import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service'; // Adjusted path
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserRole } from '@app/shared/models/user.model'; // Adjust the path as needed

interface Transaction {
  transactionAmount: number;
  transactionDate: string;
  groupId: string;
}

interface MonthStatus {
  monthName: string;
  ticketValue: number;
  isPaid: boolean;
}

@Component({
  selector: 'app-monthly-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monthly-tracker.component.html',
  styleUrls: ['./monthly-tracker.component.css'],
})
export class MonthlyTrackerComponent implements OnInit {
  ticketValue: number = 0;
  duration: number = 0;
  startDate: Date | null = null;
  installments: MonthStatus[] = [];
  error: string | null = null;
  groupId: string | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    const token = await this.authService.getToken();
    if (token && this.authService.isTokenExpired(token)) {
      this.authService.logout();
      this.error = 'Session expired. Please log in again.';
      return;
    }

    this.authService.userSubject.subscribe((user) => {
      if (!user) {
        this.error = 'User not logged in.';
        return;
      }

      if (user.userRole !== UserRole.PARTICIPANT) {
        this.error = 'Access denied. Only participants can view this page.';
        return;
      }

      this.groupId = this.route.snapshot.paramMap.get('groupId');
      if (this.groupId) {
        this.fetchGroupDetails();
      } else {
        this.error = 'Group ID is missing.';
      }
    });
  }

  fetchGroupDetails(): void {
    const authToken = this.authService.getToken();
    if (!authToken) {
      this.error = 'Authentication token is missing.';
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });

    this.http.get<any>(`http://localhost:8083/api/groups/${this.groupId}`, { headers }).subscribe(
      (groupResponse) => {
        this.ticketValue = groupResponse.ticketValue;
        this.duration = groupResponse.duration;
        this.startDate = new Date(groupResponse.startDate); // Assuming startDate is in the response
        this.fetchTransactions();
      },
      (error) => {
        console.error('Error fetching group details:', error);
        this.error = 'Failed to fetch group details.';
      }
    );
  }

  fetchTransactions(): void {
    const authToken = this.authService.getToken();
    if (!authToken) {
      this.error = 'Authentication token is missing.';
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });

    this.authService.userSubject.subscribe((user) => {
      if (!user) {
        this.error = 'User not logged in.';
        return;
      }

      this.http
        .get<Transaction[]>(`http://localhost:8084/transactions/find/user/${user.userId}`, { headers })
        .subscribe(
          (userTransactions) => {
            const monthsList: MonthStatus[] = [];
            for (let i = 0; i < this.duration; i++) {
              const currentMonth = new Date(this.startDate!);
              currentMonth.setMonth(currentMonth.getMonth() + i);
              const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

              const isPaid = userTransactions.some((transaction) => {
                const transactionDate = new Date(transaction.transactionDate);
                return (
                  transactionDate.getMonth() === currentMonth.getMonth() &&
                  transactionDate.getFullYear() === currentMonth.getFullYear() &&
                  transaction.transactionAmount === this.ticketValue &&
                  transaction.groupId === this.groupId
                );
              });

              monthsList.push({
                monthName,
                ticketValue: this.ticketValue,
                isPaid,
              });
            }

            this.installments = monthsList;
          },
          (error) => {
            console.error('Error fetching transactions:', error);
            this.error = 'Failed to fetch installments.';
          }
        );
    });
  }

  handlePay(): void {
    this.authService.userSubject.subscribe((user) => {
      if (user) {
        // this.router.navigate([`/groups/${this.groupId}/users/${user.userId}`], {
          this.router.navigate([`transactions`], {
          state: { ticketValue: this.ticketValue },
        });
      } else {
        this.error = 'User not logged in.';
      }
    });
  }
}
