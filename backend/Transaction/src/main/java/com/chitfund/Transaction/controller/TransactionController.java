package com.chitfund.Transaction.controller;

import com.chitfund.Transaction.entity.Transaction;
import com.chitfund.Transaction.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
@CrossOrigin()
public class TransactionController {

    @Autowired
    TransactionService transactionService;

    @PostMapping
    public ResponseEntity<String> createTransaction(@RequestBody Transaction transaction) {
        return ResponseEntity.ok(transactionService.createTransaction(transaction));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @GetMapping("/find/{transactionId}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable String transactionId) {
        return ResponseEntity.ok(transactionService.getTransactionById(transactionId));
    }

    @GetMapping("/find/user/{userId}")
    public ResponseEntity<List<Transaction>> getTransactionsByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(transactionService.getTransactionsByUserId(userId));
    }

    @GetMapping("/find/group/{groupId}")
    public ResponseEntity<List<Transaction>> getTransactionsByGroupId(@PathVariable String groupId) {
        return ResponseEntity.ok(transactionService.getTransactionsByGroupId(groupId));
    }

    @GetMapping("/find/type/{transactionType}")
    public ResponseEntity<List<Transaction>> getTransactionsByType(@PathVariable String transactionType) {
        return ResponseEntity.ok(transactionService.getTransactionsByType(transactionType));
    }
}