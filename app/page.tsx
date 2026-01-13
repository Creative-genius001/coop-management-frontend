import { Wallet, HandCoins, ArrowUpCircle, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/app/components/ui/page-header';
import { StatCard } from '@/app/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { DataTable } from '@/app/components/ui/data-table';
import { StatusBadge } from '@/app/components/ui/status-badge';
import { useAuth } from '@/app/contexts/AuthContext';
import { formatCurrency, formatDate, formatCompactNumber } from '@/app/lib/formatters';
import { mockDashboardStats, mockLedgerEntries, mockContributionChartData } from '@/app/data/mockData';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function MemberDashboard() {
  const { user } = useAuth();
  const stats = mockDashboardStats;
  const recentTransactions = mockLedgerEntries.slice(0, 5);

  const transactionColumns = [
    {
      key: 'date',
      header: 'Date',
      cell: (item: typeof recentTransactions[0]) => (
        <span className="text-sm">{formatDate(item.date)}</span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      cell: (item: typeof recentTransactions[0]) => (
        <div>
          <p className="font-medium text-sm">{item.description}</p>
          <p className="text-xs text-muted-foreground">{item.category}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (item: typeof recentTransactions[0]) => (
        <span className={item.type === 'credit' ? 'credit-text' : 'debit-text'}>
          {item.type === 'credit' ? '+' : '-'}{formatCurrency(item.amount)}
        </span>
      ),
      className: 'text-right',
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${user?.name.split(' ')[0]}!`}
        description="Here's an overview of your cooperative account"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Savings"
          value={formatCompactNumber(stats.totalSavings)}
          icon={<Wallet className="w-5 h-5" />}
          trend={{ value: 12, isPositive: true }}
          variant="primary"
        />
        <StatCard
          title="Active Loans"
          value={stats.activeLoans}
          icon={<HandCoins className="w-5 h-5" />}
        />
        <StatCard
          title="Pending Withdrawals"
          value={stats.pendingWithdrawals}
          icon={<ArrowUpCircle className="w-5 h-5" />}
        />
        <StatCard
          title="Monthly Contribution"
          value={formatCompactNumber(stats.monthlyContribution)}
          icon={<TrendingUp className="w-5 h-5" />}
          variant="success"
        />
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contribution Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockContributionChartData}>
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

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={transactionColumns}
              data={recentTransactions}
              emptyMessage="No recent transactions"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
