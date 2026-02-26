import { GetWithdrawalParams, PaginatedWithdrawalResponse } from '../types/financial';
import { api } from './https';

export const getAllWithdrawals = async (params: GetWithdrawalParams) : Promise<PaginatedWithdrawalResponse> => {
  const { data } = await api.get('/withdrawal', { params });
  return data;
}