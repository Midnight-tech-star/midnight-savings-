import { Member, MembershipRequest, Transaction } from '../types';

export const initialMembers: Member[] = [
  { id: '1', name: 'James Omondi', phone: '0712345678', status: 'Paid', eligible: true, shares: 1, paymentTimestamp: '2023-10-21 14:30' },
  { id: '2', name: 'Sarah Wanjiku', phone: '0722334455', status: 'Pending', eligible: false, shares: 2 },
  { id: '3', name: 'David Mutua', phone: '0733445566', status: 'Paid', eligible: true, shares: 1, paymentTimestamp: '2023-10-21 16:45' },
  { id: '4', name: 'Grace Akinyi', phone: '0744556677', status: 'Pending', eligible: false, shares: 1 },
];

export const initialRequests: MembershipRequest[] = [
  { id: 'req1', name: 'Peter Kiprono', phone: '0755667788', status: 'pending' },
  { id: 'req2', name: 'Mary Atieno', phone: '0766778899', status: 'pending' },
];

export const initialTransactions: Transaction[] = [
  { id: 't1', type: 'Payment', amount: 740, date: '2023-10-22 09:00', userName: 'James Omondi' },
  { id: 't2', type: 'Join', amount: 100, date: '2023-10-21 11:20', userName: 'David Mutua' },
  { id: 't3', type: 'Disbursement', amount: 5000, date: '2023-10-15 08:30', userName: 'Sarah Wanjiku' },
];