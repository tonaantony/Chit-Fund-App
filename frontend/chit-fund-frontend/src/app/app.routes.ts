import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
//import { DashboardComponent } from './features/dashboard/dashboard.component';
// import { ProfileComponent } from './features/profile/profile.component';
// import { EditProfileComponent } from './features/editprofile/editprofile.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ChatComponent } from './features/ai/ai-chat/ai-chat.component';

export const appRoutes: Routes = [
 // { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  //{ path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  //{ path: 'dashboard', component: DashboardComponent},
  { path: 'register', component: RegisterComponent },
  //{ path: 'profile', component: ProfileComponent },
  //{ path: 'editprofile', component: EditProfileComponent },
  { path: 'ai-chat', component: ChatComponent },
  //{ path: 'groups', component: GroupsComponent }
];

