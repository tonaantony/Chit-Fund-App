import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService,Transaction } from '@app/core/services/transaction.service';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionComponent implements OnInit {
  transactions: Transaction[] = [];
  newTransaction: Transaction = {
    transactionId: '',
    transactionAmount: 0,
    transactionDate: new Date(),
    transactionFrom: '',
    transactionTo: '',  // Assuming 'transactionTo' is present in the transaction object
    userId: '',
    groupId: '',
    transactionType: ''
  };
  searchUserId: string = '';
  searchGroupId: string = '';
  searchType: string = '';

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.loadAllTransactions();
  }

  loadAllTransactions() {
    this.transactionService.getAllTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
      }
    });
  }

  createTransaction() {
    this.transactionService.createTransaction(this.newTransaction).subscribe({
      next: (response) => {
        console.log('Transaction created:', response);
        this.loadAllTransactions();
        // Reset form
        this.newTransaction = {
          transactionId: '',
          transactionAmount: 0,
          transactionDate: new Date(),
          transactionFrom: '',
          transactionTo: '',  // Assuming 'transactionTo' is present in the transaction object
          userId: '',
          groupId: '',
          transactionType: ''
        };
      },
      error: (error) => {
        console.error('Error creating transaction:', error);
      }
    });
  }

  searchByUserId() {
    if (this.searchUserId) {
      this.transactionService.getTransactionsByUserId(this.searchUserId).subscribe({
        next: (data) => {
          this.transactions = data;
        },
        error: (error) => {
          console.error('Error searching by user ID:', error);
        }
      });
    }
  }

  searchByGroupId() {
    if (this.searchGroupId) {
      this.transactionService.getTransactionsByGroupId(this.searchGroupId).subscribe({
        next: (data) => {
          this.transactions = data;
        },
        error: (error) => {
          console.error('Error searching by group ID:', error);
        }
      });
    }
  }

  searchByType() {
    if (this.searchType) {
      this.transactionService.getTransactionsByType(this.searchType).subscribe({
        next: (data) => {
          this.transactions = data;
        },
        error: (error) => {
          console.error('Error searching by type:', error);
        }
      });
    }
  }
}