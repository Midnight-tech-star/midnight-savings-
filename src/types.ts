export interface User {
  id: string;
  phone: string;
  isMember: boolean;
  isAdmin: boolean;
  isNew: boolean;
  name: string;
}

export interface GroupData {
  name: string;
  contributionAmount: number;
  roundActive: boolean;
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  status: 'Paid' | 'Pending';
  eligible: boolean;
  shares: number;
  paymentTimestamp?: string;
  payoutReceived?: boolean;
}

export interface MembershipRequest {
  id: string;
  name: string;
  phone: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Transaction {
  id: string;
  type: 'Payment' | 'Disbursement' | 'Join' | 'Exit';
  amount: number;
  date: string;
  userName: string;
}