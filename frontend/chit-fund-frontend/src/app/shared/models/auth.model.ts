import { User } from "./user.model";

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}