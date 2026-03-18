import { GetLoanParams, Loan, PaginatedLoanResponse } from '../types/financial';
import { api } from './https';

export const getMemberLoans = async (memberId: string): Promise<Loan[]> => {
  const { data } = await api.get('/loan/member/'+memberId);
  return data;
};

export const getAllLoans = async (params: GetLoanParams): Promise<PaginatedLoanResponse> => {
  const { data } = await api.get('/admin/loans/all', { params });
  return data;
}

export const approveLoan = async (loanId: string): Promise<void> => {
  await api.post(`/loan/approve/${loanId}`);
}

export const rejectLoan = async (loanId: string): Promise<void> => {
  await api.post(`/loan/reject/${loanId}`);
}

export const requestLoan = async (accountId: string, amount: string, reason: string): Promise<void> => {
  await api.post('/loan/request', { accountId, amount, reason });
}