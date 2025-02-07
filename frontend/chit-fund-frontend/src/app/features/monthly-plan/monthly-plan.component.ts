import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface ChitPlanDTO {
  month: number;
  poolAmount: number;
  commission: number;
  winningBid: number;
  discount: number;
  discountPerMember: number;
}

interface MonthlyPlanResponse {
  results: ChitPlanDTO[];
  monthlyDraw: string[];
}

@Component({
  selector: 'app-monthly-plan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monthly-plan.component.html',
  styleUrls: ['./monthly-plan.component.css']
})
export class MonthlyPlanComponent implements OnInit {
  groupId: string | null = null;
  monthlyPlan: MonthlyPlanResponse | null = null;
  loading = true;
  error: string | null = null;
  group: any = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.groupId = params['id'];
      if (this.groupId) {
        this.fetchGroupDetails();
      }
    });
  }

  fetchGroupDetails(): void {
    this.http.get(`http://localhost:8083/api/groups/${this.groupId}`).subscribe({
      next: (group: any) => {
        this.group = group;
        this.fetchMonthlyPlan();
      },
      error: (error) => {
        console.error('Error fetching group details:', error);
        this.error = 'Failed to load group details';
        this.loading = false;
      }
    });
  }

  fetchMonthlyPlan(): void {
    this.http.get<MonthlyPlanResponse>(
      `http://localhost:8083/api/groups/${this.groupId}/monthly-plan?totalAmount=${this.group.totalAmount}&duration=${this.group.duration}&interest=${this.group.interest}`
    ).subscribe({
      next: (response) => {
        this.monthlyPlan = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching monthly plan:', error);
        this.error = 'Failed to load monthly plan';
        this.loading = false;
      }
    });
  }
}