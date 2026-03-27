import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fectchActiveLoansForMember, getAllLoans, getMemberLoans } from '../loan';
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const useGetActiveLoansForMember = (selectedMember: string, options?: Omit<UseQueryOptions<any, any, any, any>, 'queryKey' | 'queryFn'>) =>
  useQuery({
    queryKey: ['active-loans', selectedMember],
    queryFn: () => fectchActiveLoansForMember(selectedMember),
    ...options
  });

