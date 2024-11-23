'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bell } from 'lucide-react';
import { BarGraph } from './bar-graph';
import { PieGraph } from './pie-graph';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import PageContainer from '@/components/layout/page-container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const flaggedTransactions = [
  {
    id: 1,
    amount: '$5,000',
    riskScore: 'High',
    status: 'Open',
    timestamp: '2023-11-23 10:30:00',
    account: '1234567890'
  },
  {
    id: 2,
    amount: '$2,500',
    riskScore: 'Medium',
    status: 'Under Review',
    timestamp: '2023-11-23 11:15:00',
    account: '9876543210'
  },
  {
    id: 3,
    amount: '$10,000',
    riskScore: 'High',
    status: 'Escalated',
    timestamp: '2023-11-23 09:45:00',
    account: '5678901234'
  },
  {
    id: 4,
    amount: '$1,000',
    riskScore: 'Low',
    status: 'Open',
    timestamp: '2023-11-23 14:20:00',
    account: '3456789012'
  },
  {
    id: 5,
    amount: '$7,500',
    riskScore: 'High',
    status: 'Under Review',
    timestamp: '2023-11-23 13:00:00',
    account: '7890123456'
  }
];

const caseStatuses = {
  open: 15,
  underInvestigation: 8,
  resolved: 22
};

const keyMetrics = {
  dailyFlagged: 12,
  resolvedToday: 5,
  highRiskPercentage: 40
};

export default function BankOverViewPage() {
  const [filteredTransactions, setFilteredTransactions] =
    useState(flaggedTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterTransactions(term, riskFilter);
  };

  const handleRiskFilter = (risk: string) => {
    setRiskFilter(risk);
    filterTransactions(searchTerm, risk);
  };

  const filterTransactions = (term: string, risk: string) => {
    let filtered = flaggedTransactions.filter(
      (transaction) =>
        transaction.account.includes(term) || transaction.amount.includes(term)
    );
    if (risk !== 'All') {
      filtered = filtered.filter(
        (transaction) => transaction.riskScore === risk
      );
    }
    setFilteredTransactions(filtered);
  };

  return (
    <PageContainer scrollable>
      <div className="space-y-6">
        \{' '}
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Investigation Dashboard
        </h1>
        {/* Real-Time Alerts */}
        <Alert>
          <Bell className="h-4 w-4" />
          <AlertTitle>New Alert</AlertTitle>
          <AlertDescription>
            A new high-risk transaction has been flagged. Transaction ID: 6789
          </AlertDescription>
        </Alert>
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Daily Flagged Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {keyMetrics.dailyFlagged}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Resolved Cases Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {keyMetrics.resolvedToday}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                High Risk Percentage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {keyMetrics.highRiskPercentage}%
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Visualization Section */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {/* Bar Graph */}
          <div className="md:col-span-2 lg:col-span-3">
            <BarGraph />
          </div>

          {/* Pie Graph */}
          <div className="md:col-span-1 lg:col-span-1">
            <PieGraph />
          </div>
        </div>
        {/* Flagged Transactions Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Flagged Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search & Filter */}
            <div className="mb-4 flex space-x-2">
              <Input
                placeholder="Search by account or amount"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="max-w-sm"
              />
              <Select onValueChange={handleRiskFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Risks</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Account</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.riskScore === 'High'
                            ? 'destructive'
                            : transaction.riskScore === 'Medium'
                            ? 'secondary'
                            : 'secondary'
                        }
                      >
                        {transaction.riskScore}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.status}</TableCell>
                    <TableCell>{transaction.timestamp}</TableCell>
                    <TableCell>{transaction.account}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
