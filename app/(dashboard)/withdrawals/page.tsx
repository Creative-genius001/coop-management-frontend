import { useState } from 'react';
import { PageHeader } from '@/app/components/ui/page-header';
import { DataTable } from '@/app/components/ui/data-table';
import { StatusBadge } from '@/app/components/ui/status-badge';
import { Button } from '@/app/components/ui/button';
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
import { Plus } from 'lucide-react';
import { formatCurrency, formatDate } from '@/app/lib/formatters';
import { mockWithdrawals } from '@/app/data/mockData';
import { Withdrawal } from '@/app/types/financial';
import { useToast } from '@/app/hooks/use-toast';

export default function Withdrawals() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const memberWithdrawals = mockWithdrawals.filter((w) => w.memberId === 'MEM001');

  const columns = [
    {
      key: 'date',
      header: 'Request Date',
      cell: (item: Withdrawal) => (
        <span className="text-sm">{formatDate(item.requestDate)}</span>
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
      key: 'reason',
      header: 'Reason',
      cell: (item: Withdrawal) => (
        <span className="text-sm">{item.reason}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (item: Withdrawal) => <StatusBadge status={item.status} />,
    },
    {
      key: 'processed',
      header: 'Processed Date',
      cell: (item: Withdrawal) => (
        <span className="text-sm text-muted-foreground">
          {item.processedDate ? formatDate(item.processedDate) : '-'}
        </span>
      ),
    },
  ];

  const handleRequestWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Withdrawal request submitted',
      description: 'Your request has been submitted for approval.',
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Withdrawals"
        description="Request and track your withdrawal requests"
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Request Withdrawal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Withdrawal</DialogTitle>
                <DialogDescription>
                  Submit a withdrawal request from your savings account.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleRequestWithdrawal} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₦)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    placeholder="Describe the reason for this withdrawal"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Submit Request
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Table */}
      <DataTable
        columns={columns}
        data={memberWithdrawals}
        emptyMessage="No withdrawal requests"
      />
    </div>
  );
}
