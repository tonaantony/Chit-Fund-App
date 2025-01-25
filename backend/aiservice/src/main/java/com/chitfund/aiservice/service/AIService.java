package com.chitfund.aiservice.service;

import com.chitfund.aiservice.model.AIChat;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
public class AIService {


    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final WebClient geminiWebClient;
    private final ObjectMapper objectMapper;

    public AIService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.geminiWebClient = webClientBuilder.baseUrl("https://generativelanguage.googleapis.com/v1beta").build();
        this.objectMapper = objectMapper;
    }

    /**
     * Generate fund suggestions for a given group data using the Gemini API
     *
     * @param groupData the group data (usually a JSON representation of contributions and total fund)
     * @return the generated fund suggestion
     */
    public AIChat generateAIChat(String query) {
        try {

            String payload = String.format(
                    """
                    {
                      "contents": [
                        {
                          "parts": [
                            {
                              "text": "%s" 
                            }
                          ]
                        }
                      ]
                    }
                    """, query); // Corrected the missing comma

            String response = geminiWebClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/models/gemini-1.5-flash:generateContent")
                            .queryParam("key", geminiApiKey)
                            .build())
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode jsonNode = objectMapper.readTree(response);
            if (jsonNode.has("candidates") && jsonNode.get("candidates").isArray() && jsonNode.get("candidates").size() > 0
                    && jsonNode.get("candidates").get(0).has("content") && jsonNode.get("candidates").get(0).get("content").has("parts")
                    && jsonNode.get("candidates").get(0).get("content").get("parts").isArray() && jsonNode.get("candidates").get(0).get("content").get("parts").size() > 0
                    && jsonNode.get("candidates").get(0).get("content").get("parts").get(0).has("text")) {
                String suggestion = jsonNode.get("candidates").get(0).get("content").get("parts").get(0).get("text").asText();
                return new AIChat(suggestion);
            } else {
                return new AIChat("Error processing the Gemini Response");
            }
        } catch (WebClientResponseException e) {
            System.err.println("Error calling Gemini API: " + e.getStatusCode() + " " + e.getResponseBodyAsString());
            return new AIChat("Error generating response.");
        } catch (IOException e) {
            System.err.println("Error parsing Gemini API response: " + e.getMessage());
            return new AIChat("Error generating response.");
        }
    }
}
