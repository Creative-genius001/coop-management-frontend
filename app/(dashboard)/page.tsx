'use client'

import { Wallet, HandCoins, ArrowUpCircle, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/app/components/ui/page-header';
import { StatCard } from '@/app/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from "@/app/components/ui/badge"
import { DataTable } from '@/app/components/ui/data-table';
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
import { useQueryClient } from '@tanstack/react-query';

export default function MemberDashboard() {

  const { user } = useAuthStore();
  const queryClient = useQueryClient()


  const { data, isPending, error, isError } = useMemberDashboardStats(user?.memberId || '');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let transactionColumns: any = [];

  if(data) {

    queryClient.setQueryData(['dashboard-stats'], data);

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
      { isError && <div>Error: {error.message}</div> }
      { data &&  <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${user?.firstname.split(' ')[0]}!`}
        description="Here's an overview of your cooperative account"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Contributions"
          value={formatCompactNumber(data.totalContributions)}
          icon={<Wallet className="w-5 h-5" />}
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
        {/* <StatCard
          title="Monthly Contribution"
          value={formatCompactNumber(data.totalContribution)}
          icon={<TrendingUp className="w-5 h-5" />}
          variant="success"
        /> */}
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
