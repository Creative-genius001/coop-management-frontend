'use client'

import { useMemo, useState } from 'react';
import { PageHeader } from '@/app/components/ui/page-header';
import { DataTable } from '@/app/components/ui/data-table';
import { StatusBadge } from '@/app/components/ui/status-badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Check, X } from 'lucide-react';
import { formatCurrency, formatDate } from '@/app/lib/formatters';
import { Loan, LoanFinancials, LoanStatus } from '@/app/types/financial';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useGetAllLoans } from '@/app/api/queries/useLoans';

export default function AdminLoans() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>('all');
  const queryClient = useQueryClient()

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

  const loanData = data?.data || [];
  const meta = data?.meta;

  const totalPendingLoans = data?.stats.pendingLoans || 0;
  const totalActiveLoans = data?.stats.activeLoans || 0;
  const totalPaidLoans = data?.stats.paidLoans || 0;
  const totalRejectedLoans = data?.stats.rejectedLoans || 0;

  const handleApprove = (loanId: string) => {
    toast( `Loan ${loanId} approved`, {
      description: 'The loan has been approved and the member has been notified.',
    });
  };

  const handleReject = (loanId: string) => {
    toast( `Loan ${loanId} rejcted`, {
      description: 'The loan has been rejected and the member has been notified.',
    });
  };

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
      key: 'term',
      header: 'Term',
      cell: () => <span className="text-sm">3 months</span>,
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
        const statusMap: Record<LoanStatus, 'pending' | 'active' | 'approved' | 'rejected' > = {
          PENDING: 'pending',
          ACTIVE: 'active',
          REJECTED: 'rejected',
          PAID: 'approved',
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
            <Button size="sm" variant="outline" onClick={() => handleApprove(item.id)}>
              <Check className="w-4 h-4 mr-1" />
              Approve
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleReject(item.id)}>
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
