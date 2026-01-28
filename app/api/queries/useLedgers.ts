import { useQuery } from '@tanstack/react-query';
import { getLedgers } from '../ledger';

export const useLedgers = (memberId: string) =>
  useQuery({
    queryKey: ['ledgers'],
    queryFn: () => getLedgers(memberId),
  });