import { useQuery } from '@tanstack/react-query';
import { getAllLedgerEntries, getLedgers } from '../ledger';
import { GetLedgerParams } from '@/app/types/financial';

export const useLedgers = (memberId: string) => {
  return useQuery({
    queryKey: ['ledgers'],
    queryFn: () => getLedgers(memberId),
  });
}

export const useGetAllLedgerEntry = (params: GetLedgerParams) => {
  return useQuery({
    queryKey: ['all-ledger-entries', params],
    queryFn: () => getAllLedgerEntries(params),
  });
}