export interface Group {
  id: number;
  groupId: string;
  groupName: string;
  groupType: string;
  interest: number;
  organizerId: string;
  members: number;
  duration: number;
  totalAmount: number;
  ticketValue: number;
  participants: string[];
  joinRequests: string[];
  monthlyDraw: string[];
  description: string;
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