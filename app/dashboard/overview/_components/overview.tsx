'use client';

'use client';
import { AreaGraph } from './area-graph';
import { BarGraph } from './bar-graph';
import { PieGraph } from './pie-graph';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import PageContainer from '@/components/layout/page-container';
import { RecentSales } from './recent-sales';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle
} from '@radix-ui/react-alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import {
  Network,
  Shield,
  AlertTriangle,
  Clock,
  UserX,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialogFooter,
  AlertDialogHeader
} from '@/components/ui/alert-dialog';

export default function OverViewPage() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [linkedAccounts, setLinkedAccounts] = useState<
    { id: number; name: string; riskLevel: string }[]
  >([]);
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  interface LinkedAccount {
    id: number;
    name: string;
    riskLevel: string;
  }

  const handleUserClick = (user: string) => {
    // Fetch linked accounts for the selected user
    setSelectedUser(user);
    setLinkedAccounts([
      // Mock data for linked accounts
      { id: 1, name: 'Account 1', riskLevel: 'High' },
      { id: 2, name: 'Account 2', riskLevel: 'Medium' }
    ]);
  };

  const handleAlertBank = () => {
    // Handle alerting the bank
    setShowAlertDialog(true);
  };

  const suspiciousUsers = [
    {
      id: 1,
      riskScore: 85,
      cluster: 'A',
      linkedAccounts: ['user123', 'user456', 'user789'],
      transactions: 45,
      flaggedAmount: 25000
    },
    {
      id: 2,
      riskScore: 92,
      cluster: 'B',
      linkedAccounts: ['user234', 'user567'],
      transactions: 67,
      flaggedAmount: 35000
    },
    {
      id: 3,
      riskScore: 78,
      cluster: 'C',
      linkedAccounts: ['user345', 'user678', 'user901'],
      transactions: 39,
      flaggedAmount: 18000
    }
  ];

  return (
    <PageContainer scrollable>
      <div className="space-y-2">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Fraud Cases
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">
                    +5.2% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    High-Risk Transactions
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+567</div>
                  <p className="text-xs text-muted-foreground">
                    +3.8% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Amount Lost
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$1,234,567.89</div>
                  <p className="text-xs text-muted-foreground">
                    +10.4% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Fraud Detection Rate
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85%</div>
                  <p className="text-xs text-muted-foreground">
                    +2.1% from last month
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* Bar Graph - Spanning 4 Columns */}
              <div className="col-span-4">
                <BarGraph />
              </div>

              {/* Pie Graph - Spanning 3 Columns */}
              <div className="col-span-3">
                <PieGraph />
              </div>

              {/* Area Graph - Spanning Full Row */}
              <div className="col-span-7">
                <AreaGraph />
              </div>
            </div>
          </TabsContent>
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Suspicious User Clusters</CardTitle>
              <CardDescription>
                Users with high-risk scores and unusual activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                {suspiciousUsers.map((user) => (
                  <Card key={user.id} className="mb-4 last:mb-0">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          Cluster {user.cluster}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setSelectedUser(
                              selectedUser?.id === user.id ? null : user
                            )
                          }
                        >
                          {selectedUser?.id === user.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <CardDescription>
                        Risk Score: {user.riskScore}% | Transactions:{' '}
                        {user.transactions}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2 flex items-center space-x-4">
                        <Progress
                          value={user.riskScore}
                          className="flex-grow"
                        />
                        <span className="text-sm font-medium">
                          {user.riskScore}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Flagged Amount: ${user.flaggedAmount.toLocaleString()}
                        </span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleAlertBank(user.id)}
                        >
                          Alert Bank
                        </Button>
                      </div>

                      {selectedUser?.id === user.id && (
                        <div className="mt-4 rounded-lg bg-muted p-4">
                          <h4 className="mb-2 font-semibold">
                            Linked Accounts
                          </h4>
                          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            {user.linkedAccounts.map((account) => (
                              <div
                                key={account}
                                className="flex items-center space-x-2"
                              >
                                <UserX className="h-4 w-4 text-destructive" />
                                <span className="text-sm">{account}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </Tabs>
      </div>
      {showAlertDialog && (
        <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Alert Bank</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to alert the bank about this suspicious
                activity?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => setShowAlertDialog(false)}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </PageContainer>
  );
}
