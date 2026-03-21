'use client'

import { Wallet, HandCoins, ArrowUpCircle, Plus, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/app/components/ui/page-header';
import { StatCard } from '@/app/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { DataTable } from '@/app/components/ui/data-table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { formatCurrency, formatDate, formatCompactNumber } from '@/app/lib/formatters';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuthStore } from '../store/auth-store';
import { useMemberDashboardStats } from '../api/queries/useMemberDashboardStats';
import { useState } from 'react';
import { toast } from 'sonner'
import { requestWithdrawal } from '../api/withdrawal';

export default function MemberDashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [withdrawlAmount, setWithdrawalAmount] = useState<string>('');
  const [reason, setReason] = useState('');

  const { user } = useAuthStore();

  const { data, isPending, isError } = useMemberDashboardStats(user?.memberId || '');

  console.log('Dashboard data:', data);

  const handleRequestWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawlAmount || !reason) {
      toast.error('Please fill in all fields');
      return;
    }

    if (isNaN(Number(withdrawlAmount)) || Number(withdrawlAmount) <= 0) {
      toast.error('Please enter a valid withdrawal amount');
      return;
    }

    if (!user?.memberId) {
      toast.error('User not authenticated');
      return;
    }
    try {
       await requestWithdrawal(user?.memberId , Number(withdrawlAmount) , reason)
       toast.success('Withdrawal request submitted successfully',{
        description: 'The admin will review your request within 2-3 business days.',
        position: 'top-center',
       }
       );
    } catch (error) {
       toast.error('Failed to submit withdrawal request', {
        description: 'Please try again later.',
        position: 'top-center',
       });
    } finally { 
    setIsDialogOpen(false);
  };
}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let transactionColumns: any = [];

  if(data) {

    transactionColumns = [
    {
      key: 'date',
      header: 'Date',
      cell: (item: typeof data.recentLedger[0]) => (
        <span className="text-sm font-medium">{formatDate(item.createdAt)}</span>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      cell: (item: typeof data.recentLedger[0]) => (
        <div>
          <p className="font-medium text-sm">{item.category}</p>
          {/* <p className="text-xs text-muted-foreground">{item.category}</p> */}
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      cell: (item: typeof data.recentLedger[0]) => (
        <div>
            {item.direction === 'CREDIT' ? <Badge className="bg-green-100 text-green-800 dark:text-green-300 px-2 py-1 text-sm">CREDIT</Badge> : <Badge className="bg-red-50 text-red-700 dark:text-red-300 px-2 py-1 text-sm">DEBIT</Badge>}
          {/* <p className="text-xs text-muted-foreground">{item.category}</p> */}
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (item: typeof data.recentLedger[0]) => (
        <span className={item.direction === 'CREDIT' ? 'credit-text' : 'debit-text'}>
          {item.direction === 'CREDIT' ? '+' : '-'}{formatCurrency(item.amount)}
        </span>
      ),
      className: 'text-right',
    },
  ];

  }

  
  return (
    <>
      { isPending && <div>Loading dashboard...</div> }
      { isError && <div><p>Cannot display data</p></div> }
      { data &&  <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${user?.firstname.split(' ')[0]}!`}
        description="Here's an overview of your cooperative account"
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
                <DialogTitle>Withdraw Money From Your Account</DialogTitle>
                <DialogDescription>
                  Submit your withdrawal application. Our team will review it within 2-3 business days.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleRequestWithdrawal} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Withdrawal Amount (₦)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    required
                  />
                </div>
                {/* <div className="space-y-2">
                  <Label htmlFor="term">Loan Term (months)</Label>
                  <Input
                    id="term"
                    type="number"
                    placeholder="6, 12, or 24"
                    min={6}
                    max={24}
                    required
                  />
                </div> */}
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Textarea
                    id="purpose"
                    placeholder="Describe the purpose of this loan"
                    onChange={(e) => setReason(e.target.value)}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Contributions"
          value={formatCompactNumber(data.totalContributions)}
          icon={<TrendingUp className="w-5 h-5" />}
          trend={{ value: 12, isPositive: true }}
          variant="primary"
        />
        <StatCard
          title="Active Loans"
          value={data.activeLoans}
          icon={<HandCoins className="w-5 h-5" />}
        />
        <StatCard
          title="Pending Withdrawals"
          value={data.pendingWithdrawals}
          icon={<ArrowUpCircle className="w-5 h-5" />}
        />
        <StatCard
          title="Contribution Balance"
          value={formatCompactNumber(data.currentContributionBalance || 0)}
          icon={<Wallet className="w-5 h-5" />}
          variant="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contribution Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.contributionChartData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickFormatter={(value) => `₦${value / 1000}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Amount']}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={transactionColumns}
              data={data.recentLedger}
              emptyMessage="No recent transactions"
            />
          </CardContent>
        </Card>
      </div>
    </div>}
    </>
    
  );
}
