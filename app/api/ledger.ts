import { LedgerEntry } from '../types/financial';
import { api } from './https';

export const getLedgers = async (memberId: string) : Promise<LedgerEntry[]> => {
  const { data } = await api.get('/ledger/member/'+memberId);
  return data;
};
