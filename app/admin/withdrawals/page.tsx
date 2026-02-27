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
import { Withdrawal } from '@/app/types/financial';
import { toast } from "sonner"
import { useGetAllWithdrawals } from '@/app/api/queries/useWithdrawal';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminWithdrawals() {

  const queryClient = useQueryClient()

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>('all');
  const [limit] = useState(10);

  

  const params = useMemo(() => ({
    page,
    limit,
    status: status !== 'all' ? status : undefined,
  }), [page, limit, status]);

  const { data, isPending, isError } = useGetAllWithdrawals(params);

  const withdawalData = data?.data || [];
  const meta = data?.meta;

  const totalApprovedWithdrawal = data?.totalAprovedWithdrawal || 0;

  const totalPendingWithdrawal = data?.totalPendingWithdrawal || 0;
  
  const totalRejectedWithdrawal = data?.totalRejectedWithdrawal || 0;

  const handleApprove = (id: string) => {
    toast('Withdrawal approved', {
      description: 'The withdrawal has been approved and processed.',
      position: 'top-center',
    });
  };

  const handleReject = (id: string) => {
    toast('Withdrawal rejected', {
      description: 'The withdrawal request has been rejected.',
      position: 'top-center',
    });
  };

  const columns = [
    {
      key: 'member',
      header: 'Member',
      cell: (item: Withdrawal) => (
        <div>
          <p className="font-medium">Chris Bumstread</p>
          <p className="text-xs text-muted-foreground font-mono">{item.memberId}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (item: Withdrawal) => (
        <span className="font-semibold">{formatCurrency(item.amount)}</span>
      ),
    },
    {
      key: 'date',
      header: 'Request Date',
      cell: (item: Withdrawal) => (
        <span className="text-sm">{formatDate(item.createdAt)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (item: Withdrawal) =>{
         const status = item.status === 'PENDING' ? 'pending' : item.status === 'APPROVED' ? 'approved' : 'rejected';
         return <StatusBadge status={status} />
      },
    },
    {
      key: 'actions',
      header: '',
      cell: (item: Withdrawal) =>
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
    <>
      { isPending && <div>Loading withdrawals...</div> }
      { isError && <div><p>Cannot display ledger entries</p></div> }
      { data && (
        <div className="space-y-6">
      <PageHeader
        title="Withdrawal Requests"
        description="Review and process withdrawal requests"
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-warning">{totalPendingWithdrawal}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-success">{totalApprovedWithdrawal}</p>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-destructive">{totalRejectedWithdrawal}</p>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex justify-end">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <>
        <DataTable
          columns={columns}
          data={withdawalData}
          emptyMessage="No withdrawal requests found"
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
      )}
    </>
  );
}
