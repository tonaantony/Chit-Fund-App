package com.chitfund.userservice.dto;

import java.util.List;

public class Group {
    private String groupId;
    private List<String> joinRequests;

    // Getters and Setters
    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public List<String> getJoinRequests() {
        return joinRequests;
    }

    public void setJoinRequests(List<String> joinRequests) {
        this.joinRequests = joinRequests;
    }

    @Override
    public String toString() {
        return "Group{" +
                "groupId='" + groupId + '\'' +
                ", joinRequests=" + joinRequests +
                '}';
    }
}

