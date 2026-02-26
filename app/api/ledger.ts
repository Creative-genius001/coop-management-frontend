import { GetLedgerParams, LedgerEntry, PaginatedLedgerResponse } from '../types/financial';
import { api } from './https';

export const getLedgers = async (memberId: string) : Promise<LedgerEntry[]> => {
  const { data } = await api.get('/ledger/member/'+memberId);
  return data;
};


export const getAllLedgerEntries = async (params: GetLedgerParams) : Promise<PaginatedLedgerResponse> => {
  const { data } = await api.get('/ledger', { params });
  return data;
}