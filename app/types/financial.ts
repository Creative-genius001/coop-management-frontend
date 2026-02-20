// export type LoanStatus = 'ACTIVE' | 'PAID' | 'PENDING' | 'REJECTED';
export type LoanStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'inactive';
export type WithdrawalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type DirectionType = 'CREDIT' | 'DEBIT';
export type ContributionType = 'CASH' | 'TRANSFER';
export type CategoryType = 'CONTRIBUTION' | 'LOAN' | 'REPAYMENT' | 'WITHDRAWAL';

export interface Contribution {
  id: string;
  memberId: string;
  amount: number;
  type: ContributionType;
  reference?: string;
  createdAt: string;
}

export interface Loan {
  id: string;
  memberId: string;
  accountId: string;
  amount: number;
  interestRate?: number;
  loanDuration?: number; // months
  outstandingBalance: number;
  status: LoanStatus;
  reason: string;
  appliedDate: string;
  statusHistory: { status: LoanStatus; timestamp: string, changedBy: string }[];
}

export interface Withdrawal {
  id: string;
  memberId: string;
  amount: number;
  reason?: string;
  status: WithdrawalStatus;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  referenceId: string;
  memberId: string;
  category: CategoryType;
  amount: number;
  direction: DirectionType;
  createdAt: string;
}

export interface Account {
  memberId: string;
  loanLiability: number;
  accruedInterest: number;
  totalBalance: number;
}

export interface DashboardStats {
  totalContributions: number;
  activeLoans: number;
  pendingWithdrawals: number;
  contributionChartData: { month: string; amount: number }[];
  recentLedger: LedgerEntry[];
}

export interface AdminDashboardStats {
  totalCooperativeBalance: number;
  totalMembers: number;
  outstandingLoans: number;
  pendingApprovals: number;
  monthlyInflow: number;
  monthlyOutflow: number;
  pendingLoanItems: Loan[];
  pendingWithdrawalItems: Withdrawal[];
}

export interface Member {
  id: string;
  memberId: string;
  firstname: string;
  lastname: string;
  email?: string;
  phone: string;
  joinedAt: string;
  status: 'active' | 'inactive' | 'suspended';
  role : 'member' | 'admin'
}
