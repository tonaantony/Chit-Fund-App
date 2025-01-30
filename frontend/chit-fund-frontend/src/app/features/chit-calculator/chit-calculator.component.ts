

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface ChitPlan {
  month: number;
  poolAmount: number;      // Changed to match backend
  commission: number;
  winningBid: number;      // Added
  discount: number;        // Added
  discountPerMember: number; // Added
}

@Component({
  selector: 'app-chit-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chit-calculator.component.html',
  styleUrls: ['./chit-calculator.component.css']
})
export class ChitCalculatorComponent {
  totalAmount: number = 0;
  months: number = 0;
  members: number = 0;
  commission: number = 0;
  chitPlans: ChitPlan[] = [];
  isCalculating: boolean = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  calculateChit(): void {
    if (!this.totalAmount || !this.months || !this.members || this.commission === undefined) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.isCalculating = true;
    this.error = null;

    const payload = {
      totalAmount: this.totalAmount,
      months: this.months,
      members: this.members,
      commission: this.commission
    };

    this.http.post<ChitPlan[]>('http://localhost:8083/api/groups/calculate-chit', payload)
      .subscribe({
        next: (response) => {
          this.chitPlans = response;
          this.isCalculating = false;
        },
        error: (error) => {
          console.error('Error calculating chit plan:', error);
          this.error = 'Failed to calculate chit plan. Please try again.';
          this.isCalculating = false;
        }
      });
  }

  formatCurrency(amount: number): string {
    if (isNaN(amount) || amount === null) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  }

  getTotalPoolAmount(): number {
    return this.chitPlans.reduce((sum, plan) => sum + plan.poolAmount, 0);
  }

  getTotalCommission(): number {
    return this.chitPlans.reduce((sum, plan) => sum + plan.commission, 0);
  }

  getTotalWinningBids(): number {
    return this.chitPlans.reduce((sum, plan) => sum + plan.winningBid, 0);
  }

  getTotalDiscount(): number {
    return this.chitPlans.reduce((sum, plan) => sum + plan.discount, 0);
  }
}