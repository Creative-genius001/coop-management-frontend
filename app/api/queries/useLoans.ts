import { useQuery } from '@tanstack/react-query';
import { getAllLoans, getMemberLoans } from '../loan';
import { GetLoanParams } from '@/app/types/financial';

export const useGetMemberLoans = (memberId: string) =>
  useQuery({
    queryKey: ['loans'],
    queryFn: () => getMemberLoans(memberId),
  });

export const useGetAllLoans = (params: GetLoanParams) => 
  useQuery({
    queryKey: ['all-loans'],
    queryFn: () => getAllLoans(params),
  });

