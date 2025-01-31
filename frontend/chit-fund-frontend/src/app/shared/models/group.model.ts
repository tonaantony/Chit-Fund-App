export interface Group {
  groupId: string;
  groupName: string;
  description: string;
  status: string;
  memberCount: number;
  createdDate: Date;
  joinRequests: string[];
  organizerId: string;
  participants: string[];
  groupType?: string;
  interest?: number;
  members?: number;
  duration?: number;
  totalAmount?: number;
  ticketValue?: number;
}

export interface JoinRequestResponse {
  message: string;
  success: boolean;
}

export interface ChitPlanDTO {
  month: number;
  amount: number;
  commission: number;
  amountGiven: number;
}

export interface ChitCalculationDTO {
  totalAmount: number;
  months: number;
  members: number;
  commission: number;
}

