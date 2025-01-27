// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { ChatComponent } from '@app/features/ai/ai-chat/ai-chat.component';

export const routes: Routes = [
  { path: 'ai-chat', component: ChatComponent },
];