// src/app/features/chat/chat.component.ts

import { Component, OnInit, ViewChild, ElementRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AiService } from '@app/core/services/ai.service';

interface ChatMessage {
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.scss'
})
export class ChatComponent implements OnInit {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  
  messages = signal<ChatMessage[]>([]);
  newMessage = signal<string>('');
  loading = signal<boolean>(false);

  constructor(private aiService: AiService) {}

  ngOnInit(): void {
    this.messages.update(messages => [
      ...messages,
      {
        content: 'Hello! How can I help you today?',
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  }

  sendMessage(): void {
    const message = this.newMessage();
    if (!message.trim()) return;

    this.messages.update(messages => [
      ...messages,
      {
        content: message,
        sender: 'user',
        timestamp: new Date()
      }
    ]);

    this.loading.set(true);
    
    this.aiService.sendMessage(message).subscribe({
      next: (response) => {
        this.messages.update(messages => [
          ...messages,
          {
            content: response.response,
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
        this.scrollToBottom();
        this.loading.set(false);
      },
      error: (error) => {
        this.messages.update(messages => [
          ...messages,
          {
            content: 'Sorry, I encountered an error. Please try again.',
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
        this.loading.set(false);
        console.error('Error:', error);
      }
    });

    this.newMessage.set('');
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const container = this.messageContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    });
  }
}