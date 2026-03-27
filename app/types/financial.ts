export type LoanStatus = 'ACTIVE' | 'PAID' | 'PENDING' | 'REJECTED';
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

export interface RecentContribution {
  data: Contribution[];
  totalContributions: number;
  numberOfContributions: number;
}

export interface Loan {
  _id: string;
  id: string;
  memberId: string;
  accountId: string;
  amount: number;
  outstandingBalance: number;
  status: LoanStatus;
  reason: string;
  createdAt: string;
  statusHistory: { status: LoanStatus; timestamp: string, changedBy: string }[];
}

export interface LoanFinancials extends Loan {
  memberFirstname: string;
  memberLastname: string;
  memberIdentifier: string;
}

export interface LoanStats {
  activeLoans: number;
  pendingLoans: number;
  rejectedLoans: number;
  paidLoans: number;
}
export interface PaginatedLoanResponse {
  data: LoanFinancials[];
  stats: LoanStats;
  meta: PaginationMeta;
}

export interface GetLoanParams {
  page?: number;
  limit?: number;
  status?: string;
}

export interface Withdrawal {
  _id: string;
  id: string;
  memberId: string;
  amount: number;
  reason?: string;
  status: WithdrawalStatus;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface GetWithdrawalParams {
  page?: number;
  limit?: number;
  status?: string;
}

export interface PaginatedWithdrawalResponse {
  data: Withdrawal[];
  totalAprovedWithdrawal: number;
  totalPendingWithdrawal: number;
  totalRejectedWithdrawal: number;
  meta: PaginationMeta;
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

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedLedgerResponse {
  data: LedgerEntry[];
  totalBalance: number;
  numOfCredits: number;
  numOfDebits: number;
  meta: PaginationMeta;
}

export interface GetLedgerParams {
  page?: number;
  limit?: number;
  direction?: string;
  sortBy?: 'createdAt' | 'amount' | 'direction';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface GetMembersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface Account {
  memberId: string;
  loanLiability: number;
  accruedInterest: number;
  totalBalance: number;
}

export interface DashboardStats {
  currentContributionBalance: number;
  totalContributions: number;
  activeLoans: number;
  pendingWithdrawals: number;
  contributionChartData: { month: string; amount: number }[];
  recentLedger: LedgerEntry[];
}

export interface AdminDashboardStats {
  chartStats: { 
    month: string;
    inflow: number;
    outflow: number;
  }[];
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

export interface MemberWithFinancials extends Member {
  totalSavings: number;
  totalLoans: number;
}

export interface PaginatedMembersResponse {
  data: MemberWithFinancials[];
  stats: MemberStats,
  meta: PaginationMeta;
}

export interface MemberStats {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  suspendedMembers: number;
}
