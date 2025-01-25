package com.chitfund.Transaction.repository;

import com.chitfund.Transaction.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByTransactionId(String transactionId);
    List<Transaction> findByUserId(String userId);
    List<Transaction> findByGroupId(String groupId);
    List<Transaction> findByTransactionType(String transactionType);
}
