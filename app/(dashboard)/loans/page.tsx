'use client'

import { useState } from 'react';
import { PageHeader } from '@/app/components/ui/page-header';
import { DataTable } from '@/app/components/ui/data-table';
import { StatusBadge } from '@/app/components/ui/status-badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Plus, HandCoins, Clock, CheckCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/app/lib/formatters';
import { mockLoans } from '@/app/data/mockData';
import { Loan } from '@/app/types/financial';
import { toast } from 'sonner'
import { useAuthStore } from '@/app/store/auth-store';
import { useQueryClient } from '@tanstack/react-query';
import { useGetMemberLoans } from '@/app/api/queries/useLoans';


export default function Loans() {

  const queryClient = useQueryClient()
  const { user } = useAuthStore();
  
  const { data, isPending, error, isError } = useGetMemberLoans(user?.memberId || '');

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const columns = [
    {
      key: 'date',
      header: 'Applied Date',
      cell: (item: Loan) => (
        <span className="text-sm">{formatDate(item.appliedDate)}</span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (item: Loan) => (
        <span className="font-semibold">{formatCurrency(item.amount)}</span>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      cell: (item: Loan) => (
        <span className="text-sm">{item.reason}</span>
      ),
    },
    {
      key: 'term',
      header: 'Term',
      cell: (item: Loan) => (
        <span className="text-sm">{item.loanDuration} months</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (item: Loan) => <StatusBadge status={item.status} />,
    },
    {
      key: 'outstanding',
      header: 'Outstanding',
      cell: (item: Loan) => (
        <span className="font-medium">
          {item.outstandingBalance ? formatCurrency(item.outstandingBalance) : '-'}
        </span>
      ),
      className: 'text-right',
    },
  ];

  const handleApplyLoan = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Your loan application has been submitted for review.');
    setIsDialogOpen(false);
  };

  const activeLoan = data?.find((l) => l.status === 'active');
  const pendingLoan = data?.find((l) => l.status === 'pending');

  return (
    <>
      { isPending && <div>Loading loans...</div> }
      { isError && <div>Error: {error.message}</div> }
      { data && <div className="space-y-6">
      <PageHeader
        title="Loans"
        description="Manage your loan applications and repayments"
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Apply for Loan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apply for a Loan</DialogTitle>
                <DialogDescription>
                  Submit your loan application. Our team will review it within 2-3 business days.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleApplyLoan} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Loan Amount (₦)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="term">Loan Term (months)</Label>
                  <Input
                    id="term"
                    type="number"
                    placeholder="6, 12, or 24"
                    min={6}
                    max={24}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Textarea
                    id="purpose"
                    placeholder="Describe the purpose of this loan"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Submit Application
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <HandCoins className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Borrowed</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(data.reduce((sum, l) => sum + l.amount, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/10">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(activeLoan?.outstandingBalance || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/10">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Payment</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(activeLoan?.outstandingBalance || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data}
        emptyMessage="No loan records found"
      />
    </div>}
    </>
  );
}
