export interface Transaction {
    transactionId: string;
    transactionAmount: number;
    transactionDate: Date;
    transactionType: string;
    userId: string;
    groupId: string;
    transactionFrom: string;
    transactionTo: string;
}

// Optional: You might want to add transaction type enum for better type safety
export enum TransactionType {
    PAYMENT = 'PAYMENT',
    TRANSFER = 'TRANSFER',
    DEPOSIT = 'DEPOSIT',
    WITHDRAWAL = 'WITHDRAWAL'
    // Add other transaction types as needed
}