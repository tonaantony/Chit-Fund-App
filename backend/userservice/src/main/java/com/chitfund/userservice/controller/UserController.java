package com.chitfund.userservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.chitfund.userservice.dto.AddGroupDTO;
import com.chitfund.userservice.dto.RespondToJoinRequestDTO;
import com.chitfund.userservice.model.User;
import com.chitfund.userservice.service.UserService;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin()
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User userData) {
        try {
            User user = userService.registerUser(userData);
            return ResponseEntity.status(200).body(user);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable String userId) {
        try {
            User user = userService.getUserById(userId);
            if (user != null) {
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(404).body(Map.of("message", "User not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/email/{userEmail}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String userEmail) {
        try {
            User user = userService.getUserByEmail(userEmail);
            if (user != null) {
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(404).body(Map.of("message", "User not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/groups/{userEmail}")
    public ResponseEntity<?> getListOfGroups(@PathVariable String userEmail) {
        try {
            List<String> groups = userService.getListOfGroups(userEmail);
            if (groups != null && !groups.isEmpty()) {
                return ResponseEntity.ok(groups);
            } else {
                return ResponseEntity.status(404).body(Map.of("message", "No groups found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/edit/{userEmail}")
    public ResponseEntity<?> editUserProfile(@PathVariable String userEmail, @RequestBody User updatedData) {
        try {
            User updatedUser = userService.updateUserProfile(userEmail, updatedData);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{groupId}/respond/{userId}")
    public ResponseEntity<?> respondToJoinRequest(
        @PathVariable String groupId,
        @PathVariable String userId,
        @RequestBody @Valid RespondToJoinRequestDTO requestDTO) {
        String action = requestDTO.getAction();
            try {
                userService.respondToJoinRequest(groupId, userId, action);
                return ResponseEntity.ok(Map.of("message", "Request " + action + "ed successfully"));
            } catch (Exception e) {
                return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
            }
    }


    @PostMapping("/addGroup/{userEmail}")
    public ResponseEntity<?> addGroup(
        @PathVariable String userEmail,
        @RequestBody @Valid AddGroupDTO requestDTO) {
            String groupId = requestDTO.getGroupId();
            try {
                User user = userService.addGroupToUser(groupId, userEmail);
                return ResponseEntity.ok(user);
            } catch (Exception e) {
                return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
            }
    }


    @GetMapping("/username/{userName}")
    public ResponseEntity<?> getIdByUserName(@PathVariable String userName) {
        try {
            String userId = userService.getIdByUserName(userName);
            if (userId != null) {
                return ResponseEntity.ok(Map.of("userId", userId));
            } else {
                return ResponseEntity.status(404).body(Map.of("message", "User not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }
}

