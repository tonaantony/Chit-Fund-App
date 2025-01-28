package com.chitfund.userservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import com.chitfund.userservice.dto.Group;
import com.chitfund.userservice.dto.GroupResponse;
import com.chitfund.userservice.dto.Transaction;
import com.chitfund.userservice.model.User;
import com.chitfund.userservice.repository.UserRepository;

import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // @Autowired
    // private RestTemplate restTemplate;

    @Autowired
    private WebClient.Builder webClientBuilder;

    private final String GROUP_SERVICE_BASE_URL = "http://localhost:8083/api/groups";
    private final String TRANSACTION_SERVICE_BASE_URL = "http://localhost:8084/api/transactions";

    // Assuming you have a Group class that matches the structure of the group object in the response
public List<String> getAllGroupsForUser(String userId) {
    List<String> userGroups = new ArrayList<>();
    
    try {
        // Step 1: Fetch all groups from GroupService (now mapping to a List<Group>)
        List<Group> allGroups = webClientBuilder.baseUrl("http://localhost:8083")
                .build()
                .get()
                .uri("/api/groups")
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Group>>() {})
                .block();
    
        // Step 2: Check if the user is a participant in any of the groups
        if (allGroups != null) {
            for (Group group : allGroups) {
                try {
                    // Check if the userId is in the participants list
                    if (group.getParticipants() != null && group.getParticipants().contains(userId)) {
                        // Add the group details to the user's group list
                        userGroups.add(group.getGroupName() + " - " + group.getDescription());
                    }
                } catch (Exception e) {
                    System.err.println("Error checking participants for groupId: " + group.getGroupId() + ". " + e.getMessage());
                }
            }
        }
    
    } catch (Exception e) {
        throw new RuntimeException("Failed to fetch groups for user: " + e.getMessage());
    }
    
    // Step 3: Return the list of groups the user is a part of
    return userGroups.isEmpty() ? List.of("No groups found") : userGroups;
}

    
    
    
    
    

    public List<Transaction> getUserTransactions(String userId) {
        return webClientBuilder.build()
                .get()
                .uri(TRANSACTION_SERVICE_BASE_URL + "/user/" + userId)
                .retrieve()
                .onStatus(
                    status -> status.is4xxClientError(),
                    response -> Mono.error(new RuntimeException("Transactions not found"))
                )
                .bodyToMono(new ParameterizedTypeReference<List<Transaction>>() {})
                .block();
    }

    public User registerUser(User userData) {
        userData.setUserId(generateUserId());
        return userRepository.save(userData);
    }

    public User login(String userEmail) {
        return userRepository.findByUserEmail(userEmail).get();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(String userId) {
        return userRepository.findByUserId(userId).get();
    }

    public User getUserByEmail(String userEmail) {
        return userRepository.findByUserEmail(userEmail).get();
    }

    public String getUsernameById(String userId) {
        User user = userRepository.findByUserId(userId).get();
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        return user.getUserName();
    }

    private String generateUserId() {
        return "U" + String.format("%04d", (int) (Math.random() * 1000));
    }

    public User updateUserProfile(String userEmail, User updatedData) {
        User existingUser = userRepository.findByUserEmail(userEmail).get();
        if (existingUser == null) {
            throw new RuntimeException("User not found");
        }

        existingUser.setUserName(updatedData.getUserName());
        existingUser.setUserMobileNum(updatedData.getUserMobileNum());
        existingUser.setUserAddress(updatedData.getUserAddress());

        return userRepository.save(existingUser);
    }


    public User respondToJoinRequest(String groupId, String userId, String action) {
        if ("accept".equals(action)) {
            // Notify the GroupService to accept the join request and add the user to the group
            boolean isAccepted = webClientBuilder.build()
                .post()
                .uri("http://localhost:8083/api/groups/" + groupId + "/accept-join/" + userId) // Call GroupService to accept the join request
                .retrieve()
                .onStatus(status -> status.is4xxClientError(), response -> Mono.error(new RuntimeException("Group join failed")))
                .bodyToMono(Boolean.class)
                .block();
    
            if (isAccepted) {
                // Add the group to the user's group list
                User user = userRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("User not found"));
                user.getGroupIds().add(groupId);
                return userRepository.save(user); // Save the updated user
            }
        } else {
            // Handle rejection logic
            String groupUrl = "http://localhost:8083/api/groups/" + groupId;
            webClientBuilder.build()
                .put()
                .uri(groupUrl)
                .retrieve()
                .bodyToMono(Void.class)
                .block();
        }
        return null;
    }
    
    public User addGroupToUser(String groupId, String userEmail) {
        User user = userRepository.findByUserEmail(userEmail).get();
        if (user != null) {
            user.getGroupIds().add(groupId);
            return userRepository.save(user);
        }
        return null;
    }

    public String getIdByUserName(String userName) {
        User user = userRepository.findByUserName(userName).get();
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        return user.getUserId();
    }
}

