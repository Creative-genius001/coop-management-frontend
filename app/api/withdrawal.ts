import { GetWithdrawalParams, PaginatedWithdrawalResponse } from '../types/financial';
import { api } from './https';

export const getAllWithdrawals = async (params: GetWithdrawalParams) : Promise<PaginatedWithdrawalResponse> => {
  const { data } = await api.get('/withdrawal', { params });
  return data;
}

export const requestWithdrawal = async (memberId: string, amount: number, reason: string) => {
  const { data } = await api.post('/withdrawal/request', { memberId, amount, reason });
  return data;
}

export const approveWithdrawal = async (withdrawalId: string) => {
  const { data } = await api.post(`/withdrawal/${withdrawalId}/approve`);
  return data;
}

export const rejectWithdrawal = async (withdrawalId: string) => {
  const { data } = await api.post(`/withdrawal/${withdrawalId}/reject`);
  return data;
}

export const recordWithdrawal = async (memberId: string, amount: number) => {
  const { data } = await api.post('/admin/withdrawal/record', { memberId, amount });
  return data;
}