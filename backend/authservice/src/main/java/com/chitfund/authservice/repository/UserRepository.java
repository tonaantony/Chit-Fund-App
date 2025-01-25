package com.chitfund.authservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.chitfund.authservice.model.User;

public interface UserRepository extends JpaRepository<User, Long>{
    Optional<User> findByUserEmail(String userEmail);
}
