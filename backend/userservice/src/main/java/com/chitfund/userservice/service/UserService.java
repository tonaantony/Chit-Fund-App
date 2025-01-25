package com.chitfund.userservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.chitfund.userservice.dto.Group;
import com.chitfund.userservice.model.User;
import com.chitfund.userservice.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestTemplate restTemplate;

    public User registerUser(User userData) {
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

    public List<String> getListOfGroups(String userEmail) {
        User user = userRepository.findByUserEmail(userEmail).get();
        if (user == null || user.getGroupIds() == null) {
            return null;
        }

        List<String> result = new ArrayList<>();
        for (String groupId : user.getGroupIds()) {
            try {
                String url = UriComponentsBuilder.fromHttpUrl("http://localhost:8083/api/groups/" + groupId)
                        .toUriString();
                Group group = restTemplate.getForObject(url, Group.class);
                if (group != null) {
                    result.add(group.toString()); // Adjust based on response structure
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return result;
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
        // Accept the request
        if (action.equals("accept")) {
            String groupUrl = "http://localhost:8083/api/groups/" + groupId + "/participants/" + userId;
            Group group = restTemplate.getForObject(groupUrl, Group.class);
            User user = userRepository.findByUserId(userId).get();
            if (group != null && user != null) {
                user.getGroupIds().add(groupId);
                return userRepository.save(user);
            }
        } else {
            String groupUrl = "http://localhost:8083/api/groups/" + groupId;
            Group group = restTemplate.getForObject(groupUrl, Group.class);
            if (group != null) {
                group.getJoinRequests().remove(userId);
                restTemplate.put("http://localhost:8083/api/groups/" + groupId, group);
            }
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

