'use client'

import { useMemo, useState } from 'react';
import { PageHeader } from '@/app/components/ui/page-header';
import { DataTable } from '@/app/components/ui/data-table';
import { StatusBadge } from '@/app/components/ui/status-badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Check, X, Plus } from 'lucide-react';
import { formatCurrency, formatDate } from '@/app/lib/formatters';
import { Loan, LoanFinancials, LoanStatus } from '@/app/types/financial';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGetActiveLoansForMember, useGetAllLoans } from '@/app/api/queries/useLoans';
import { approveLoan, recordApprovedLoan, recordLoanRepayment, rejectLoan } from '@/app/api/loan';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useDebounce } from 'use-debounce';

export default function AdminLoans() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [loanType, setLoanType] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedLoanId, setSelectedLoanId] = useState("");
  const [debouncedSearch] = useDebounce(selectedMember, 1000);

  const queryClient = useQueryClient()

  const getActiveLoanParams = useMemo(() => ({ selectedMember: debouncedSearch }), [debouncedSearch]);

  const approveMutation = useMutation({
    mutationFn: (loan: {id : string}) => approveLoan(loan.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-loans'] });
      toast.success('Loan approved successfully');
    },
    onError: () => {
      toast.error('Failed to approve loan. Please try again.');
    }
  });

  const disapproveMutation = useMutation({
    mutationFn: (loan: {id : string}) => rejectLoan(loan.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-loans'] });
    },
    onError: () => {
      toast.error('Failed to disapprove loan. Please try again.');
    }
  });

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const params = useMemo(() => ({
    page,
    limit,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  }), [page, limit, statusFilter]);

  const { data } = useGetAllLoans(params);

  // useEffect(() => {
  //   setPage(1);
  // }, [debouncedSearch, directionFilter, sortBy, sortOrder]);

  const loanData = data?.data.map(loan => ({ ...loan, id: loan._id })) || [];
  const meta = data?.meta;

  const totalPendingLoans = data?.stats.pendingLoans || 0;
  const totalActiveLoans = data?.stats.activeLoans || 0;
  const totalPaidLoans = data?.stats.paidLoans || 0;
  const totalRejectedLoans = data?.stats.rejectedLoans || 0;

  const handleRecordLoan = async(e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMember || !amount || !loanType) {
      toast.error('Please fill in all required fields');
      return;
    }

    if(isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    try {
      if(loanType === 'repayment') {
        await recordLoanRepayment(selectedLoanId, selectedMember, Number(amount));
      } else if(loanType === 'approval') {
        await recordApprovedLoan(selectedMember, Number(amount));
      }
      toast.success('Loan recorded successfully');
    } catch (error) {
      toast.error('Failed to record loan. Please try again.');
    } finally {
    setIsDialogOpen(false);
    }
  };

  const { data: memberLoans, isLoading } = useGetActiveLoansForMember(getActiveLoanParams.selectedMember,{
    enabled: isDialogOpen && debouncedSearch.length > 0 
  });


  const columns = [
    {
      key: 'member',
      header: 'Member',
      cell: (item: LoanFinancials) => (
        <div>
          <p className="font-medium">{`${item.memberFirstname} ${item.memberLastname}`}</p>
          <p className="text-xs text-muted-foreground font-mono">{item.memberId}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (item: LoanFinancials) => (
        <span className="font-semibold">{formatCurrency(item.amount)}</span>
      ),
    },
    {
      key: 'purpose',
      header: 'Purpose',
      cell: (item: LoanFinancials) => <span className="text-sm">{item.reason}</span>,
    },
    {
      key: 'outstanding balance',
      header: 'Outstanding Balance',
      cell: (item: LoanFinancials) => (
        item.outstandingBalance  ? <span className="font-semibold">{formatCurrency(item.outstandingBalance)}</span> : <span className="text-sm text-muted-foreground">N/A</span>
      ),
    },
    {
      key: 'date',
      header: 'Applied Date',
      cell: (item: LoanFinancials) => (
        <span className="text-sm">{formatDate(item.createdAt)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (item: LoanFinancials) => {
        const statusMap: Record<LoanStatus, 'pending' | 'active' | 'completed' | 'rejected' > = {
          PENDING: 'pending',
          ACTIVE: 'active',
          REJECTED: 'rejected',
          PAID: 'completed',
        };
        return <StatusBadge status={statusMap[item.status]} />;
      },
    },
    {
      key: 'actions',
      header: '',
      cell: (item: Loan) =>
        item.status === 'PENDING' ? (
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="outline" 
              onClick={() => approveMutation.mutate({id: item._id})}
              disabled={approveMutation.isPending}
            >
              <Check className="w-4 h-4 mr-1" />
              Approve
            </Button>
            <Button size="sm" variant="ghost" 
              onClick={() => disapproveMutation.mutate({id: item._id})}
              disabled={disapproveMutation.isPending}
            >
              <X className="w-4 h-4 mr-1" />
              Reject
            </Button>
          </div>
        ) : null,
      className: 'text-right',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Loan Management"
        description="Review and manage loan applications"
        action={
          <Dialog open={isDialogOpen} 
             onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setSelectedMember('');
                setSelectedLoanId('');
              }
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Record Loan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Record Loan</DialogTitle>
                <DialogDescription>
                  Enter the loan details. This will update the member&apos;s account and ledger.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleRecordLoan} className="space-y-4 mt-4">
                {/* Member Search */}
                <div className="space-y-2">
                  <Label>Select Member</Label>
                  <div className="relative">
                    {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /> */}
                    <Input
                      placeholder="Enter member ID..."
                      value={selectedMember}
                      onChange={(e) => setSelectedMember(e.target.value)}
                      required
                    />
                  </div>

                  {/* { memberSearch && (
                    <div className="max-h-32 overflow-y-auto border rounded-lg">
                      {filteredMembers.map((member) => (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => {
                            setSelectedMember(member.id);
                            setMemberSearch(member.name);
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex justify-between"
                        >
                          <span>{member.name}</span>
                          <span className="text-muted-foreground font-mono">{member.memberId}</span>
                        </button>
                      ))}
                    </div>
                    )
                  } */}

                  <div className="space-y-2">
                    <Label>Select Specific Loan</Label>
                    <Select 
                      value={selectedLoanId} 
                      onValueChange={setSelectedLoanId} 
                      disabled={memberLoans?.length === 0}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={memberLoans ? "Choose loan to repay" : "No active loans"} />
                      </SelectTrigger>
                      <SelectContent>
                        {memberLoans?.map((loan: Loan) => (
                          <SelectItem key={loan._id} value={loan._id}>
                            {loan.reason} — Balance: ₦{loan.outstandingBalance}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₦)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Loan Type</Label>
                  <Select value={loanType} onValueChange={setLoanType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="repayment">Loan Repayment</SelectItem>
                      <SelectItem value="approval">Approved Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Record Loan
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-warning">{totalPendingLoans}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-red-500">{totalRejectedLoans}</p>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-primary">{totalActiveLoans}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-muted-foreground">{totalPaidLoans}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex justify-end">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <>
         <DataTable
            columns={columns}
            data={loanData}
            emptyMessage="No loans found"
        />
         <div className="flex justify-between items-center mt-4">
            <Button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>

            <span>
              Page {meta?.page} of {meta?.totalPages}
            </span>

            <Button
              disabled={page === meta?.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
      </>
    </div>
  );
}
