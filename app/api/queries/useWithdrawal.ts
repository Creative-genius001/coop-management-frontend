import { GetWithdrawalParams } from '@/app/types/financial';
import { useQuery } from '@tanstack/react-query';
import { getAllWithdrawals } from '../withdrawal';

export const useGetAllWithdrawals = (params: GetWithdrawalParams) => {
  return useQuery({
    queryKey: ['all-withdrawals', params],
    queryFn: () => getAllWithdrawals(params),
  });
}