package com.chitfund.Transaction.service;

import com.chitfund.Transaction.entity.Transaction;
import com.chitfund.Transaction.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public String createTransaction(Transaction transaction) {
        transaction.setTransactionId(generateTransactionId());
        transactionRepository.save(transaction);
        return "Transaction created successfully";
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public Transaction getTransactionById(String transactionId) {
        return transactionRepository.findByTransactionId(transactionId).orElseThrow(() -> new RuntimeException("Transaction not found"));
    }

    public List<Transaction> getTransactionsByUserId(String userId) {
        return transactionRepository.findByUserId(userId);
    }

    public List<Transaction> getTransactionsByGroupId(String groupId) {
        return transactionRepository.findByGroupId(groupId);
    }

    public List<Transaction> getTransactionsByType(String transactionType) {
        return transactionRepository.findByTransactionType(transactionType);
    }

    private String generateTransactionId() {
        return "txn_" + System.currentTimeMillis() + "_" + (int) (Math.random() * 10000);
    }
}

