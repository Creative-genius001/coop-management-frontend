import { Users, Wallet, HandCoins, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatCurrency, formatDate, formatCompactNumber } from '@/lib/formatters';
import {
  mockAdminDashboardStats,
  mockLoans,
  mockWithdrawals,
  mockCooperativeChartData,
} from '@/data/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function AdminDashboard() {
  const stats = mockAdminDashboardStats;
  const pendingLoans = mockLoans.filter((l) => l.status === 'pending');
  const pendingWithdrawals = mockWithdrawals.filter((w) => w.status === 'pending');

  const pendingItems = [
    ...pendingLoans.map((l) => ({
      id: l.id,
      type: 'Loan' as const,
      member: l.memberName || l.memberId,
      amount: l.amount,
      date: l.appliedDate,
      status: l.status,
    })),
    ...pendingWithdrawals.map((w) => ({
      id: w.id,
      type: 'Withdrawal' as const,
      member: w.memberName || w.memberId,
      amount: w.amount,
      date: w.requestDate,
      status: w.status,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const pendingColumns = [
    {
      key: 'type',
      header: 'Type',
      cell: (item: typeof pendingItems[0]) => (
        <span className="text-sm font-medium">{item.type}</span>
      ),
    },
    {
      key: 'member',
      header: 'Member',
      cell: (item: typeof pendingItems[0]) => (
        <span className="text-sm">{item.member}</span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (item: typeof pendingItems[0]) => (
        <span className="font-semibold">{formatCurrency(item.amount)}</span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      cell: (item: typeof pendingItems[0]) => (
        <span className="text-sm text-muted-foreground">{formatDate(item.date)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (item: typeof pendingItems[0]) => <StatusBadge status={item.status} />,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Dashboard"
        description="Overview of cooperative operations and finances"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Balance"
          value={formatCompactNumber(stats.totalCooperativeBalance)}
          icon={<Wallet className="w-5 h-5" />}
          trend={{ value: 8.5, isPositive: true }}
          variant="primary"
        />
        <StatCard
          title="Total Members"
          value={stats.totalMembers}
          icon={<Users className="w-5 h-5" />}
          trend={{ value: 3, isPositive: true }}
        />
        <StatCard
          title="Outstanding Loans"
          value={formatCompactNumber(stats.outstandingLoans)}
          icon={<HandCoins className="w-5 h-5" />}
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={<Clock className="w-5 h-5" />}
          variant="warning"
        />
      </div>

      {/* Inflow/Outflow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/10">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Inflow</p>
                <p className="text-2xl font-bold">{formatCompactNumber(stats.monthlyInflow)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-destructive/10">
                <TrendingDown className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Outflow</p>
                <p className="text-2xl font-bold">{formatCompactNumber(stats.monthlyOutflow)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cash Flow Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockCooperativeChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickFormatter={(value) => `₦${value / 1000000}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [formatCurrency(value), '']}
                  />
                  <Legend />
                  <Bar dataKey="inflow" name="Inflow" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="outflow" name="Outflow" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={pendingColumns}
              data={pendingItems}
              emptyMessage="No pending approvals"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
