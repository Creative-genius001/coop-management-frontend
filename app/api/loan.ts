import { Loan } from '../types/financial';
import { api } from './https';

export const getMemberLoans = async (memberId: string): Promise<Loan[]> => {
  const { data } = await api.get('/loan/member/'+memberId);
  return data;
};