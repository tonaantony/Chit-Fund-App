package com.chitfund.aiservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.chitfund.aiservice.model.AIChat;
import com.chitfund.aiservice.service.AIService;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/chat")
    public ResponseEntity<AIChat> generateAIChat(@RequestBody String query) {
        AIChat response = aiService.generateAIChat(query);
        return ResponseEntity.ok(response);
    }
}
