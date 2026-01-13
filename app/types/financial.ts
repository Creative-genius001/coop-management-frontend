export type LoanStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
export type WithdrawalStatus = 'pending' | 'approved' | 'rejected';
export type TransactionType = 'credit' | 'debit';
export type ContributionType = 'monthly' | 'special' | 'share_capital';

export interface Contribution {
  id: string;
  memberId: string;
  amount: number;
  type: ContributionType;
  reference: string;
  date: string;
  recordedBy?: string;
}

export interface Loan {
  id: string;
  memberId: string;
  memberName?: string;
  amount: number;
  interestRate: number;
  term: number; // months
  status: LoanStatus;
  purpose: string;
  appliedDate: string;
  approvedDate?: string;
  monthlyPayment?: number;
  outstandingBalance?: number;
}

export interface Withdrawal {
  id: string;
  memberId: string;
  memberName?: string;
  amount: number;
  reason: string;
  status: WithdrawalStatus;
  requestDate: string;
  processedDate?: string;
}

export interface LedgerEntry {
  id: string;
  memberId: string;
  memberName?: string;
  type: TransactionType;
  category: string;
  amount: number;
  balance: number;
  description: string;
  reference: string;
  date: string;
}

export interface Account {
  savings: number;
  shareCapital: number;
  loanLiability: number;
  accruedInterest: number;
  totalBalance: number;
}

export interface DashboardStats {
  totalSavings: number;
  activeLoans: number;
  pendingWithdrawals: number;
  monthlyContribution: number;
}

export interface AdminDashboardStats {
  totalCooperativeBalance: number;
  totalMembers: number;
  outstandingLoans: number;
  pendingApprovals: number;
  monthlyInflow: number;
  monthlyOutflow: number;
}

export interface Member {
  id: string;
  memberId: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive';
  savings: number;
  shareCapital: number;
  loanBalance: number;
}
