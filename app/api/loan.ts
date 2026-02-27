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