export interface User {
  id?: number;
  userId: string;
  userName: string;
  userEmail: string;
  password: string;
  userMobileNum: string;
  userAddress: string;
  userRole: UserRole;
  groupIds?: string[];
}

export enum UserRole {
  ADMIN = 'ADMIN',
  PARTICIPANT = 'PARTICIPANT',
  ORGANIZER = 'ORGANIZER'
}