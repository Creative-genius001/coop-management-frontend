'use client'

import { useMemo, useState } from 'react';
import { PageHeader } from '@/app/components/ui/page-header';
import { DataTable } from '@/app/components/ui/data-table';
import { StatusBadge } from '@/app/components/ui/status-badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Check, X, Plus } from 'lucide-react';
import { formatCurrency, formatDate } from '@/app/lib/formatters';
import { Withdrawal } from '@/app/types/financial';
import { toast } from "sonner"
import { useGetAllWithdrawals } from '@/app/api/queries/useWithdrawal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approveWithdrawal, recordWithdrawal, rejectWithdrawal } from '@/app/api/withdrawal';

export default function AdminWithdrawals() {

  const queryClient = useQueryClient()

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>('all');
  const [limit] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);

  

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

  const approveMutation = useMutation({
    mutationFn: (withdrawal: {id : string}) => approveWithdrawal(withdrawal.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-withdrawals'] });
      toast.success('Withdrawal approved successfully',{
        position: 'top-center',
      });
    },
    onError: () => {
      toast.error('Failed to approve withdrawal. Please try again.');
    }
  });

  const disapproveMutation = useMutation({
    mutationFn: (withdrawal: {id : string}) => rejectWithdrawal(withdrawal.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-withdrawals'] });
    },
    onError: () => {
      toast.error('Failed to disapprove withdrawal. Please try again.');
    }
  });

  const handleRecordWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMember || !amount ) {
          toast.error('Please fill in all required fields');
          return;
        }
    
        if(isNaN(Number(amount)) || Number(amount) <= 0) {
          toast.error('Please enter a valid amount');
          return;
        }
    
        try {
            await recordWithdrawal(selectedMember, amount);
            toast('Withdrawal recorded', {
            description: 'The withdrawal has been recorded and ledger updated.',
          });
          setIsDialogOpen(false);
          setSelectedMember('');
        } catch (error) {
          toast.error('Failed to record withdrawal');
        }
  }

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
            <Button size="sm" variant="outline"  
              onClick={() => approveMutation.mutate({id: item._id})}
              disabled={approveMutation.isPending}>
              <Check className="w-4 h-4 mr-1" />
              Approve
            </Button>
            <Button size="sm" variant="ghost" 
              onClick={() => disapproveMutation.mutate({id: item._id})}
              disabled={disapproveMutation.isPending}>
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
        action={
          <Dialog open={isDialogOpen} 
             onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setSelectedMember('');
              }
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Record Withdrawal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Record Withdarwal</DialogTitle>
                <DialogDescription>
                  Enter the Withdrawal details. This will update the member&apos;s account and ledger.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleRecordWithdrawal} className="space-y-4 mt-4">
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
                  
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₦)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    onChange={(e) => setAmount(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Record Withdrawal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
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
