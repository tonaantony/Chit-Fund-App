// src/app/shared/models/chat.model.ts

export interface ChatMessage {
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  }
  
  export interface AIResponse {
    response: string;
  }