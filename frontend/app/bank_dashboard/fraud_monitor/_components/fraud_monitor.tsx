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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PaperclipIcon as PaperClipIcon, Router, UserCircleIcon } from 'lucide-react';
import PageContainer from '@/components/layout/page-container';
import { useRouter } from 'next/navigation';
const cases = [
  {
    AccountId: '000318DE-1C1',
    AccountNumber: '38379801089',
    AccountHolderFullName: 'Vijay Patel',
    AccountType: 'E-Wallet (Individual)',
    Priority: 'High', // Placeholder value
    FraudType: 'Phishing', // Placeholder value
    FraudAmount: '1000', // Placeholder value
  },
  {
    AccountId: '0006838A-6A8',
    AccountNumber: '20721297463',
    AccountHolderFullName: 'Ah Hock Tan',
    AccountType: 'E-Wallet (Individual)',
    Priority: 'Medium', // Placeholder value
    FraudType: 'Identity Theft', // Placeholder value
    FraudAmount: '2000', // Placeholder value
  },
  {
    AccountId: '000D44F3-97D',
    AccountNumber: '20901814561',
    AccountHolderFullName: 'Anand Nair',
    AccountType: 'Savings',
    Priority: 'Low', // Placeholder value
    FraudType: 'Account Takeover', // Placeholder value
    FraudAmount: '3000', // Placeholder value
  },
  {
    AccountId: '000F4AFB-0BF',
    AccountNumber: '15643987694',
    AccountHolderFullName: 'Ah Hock Ng',
    AccountType: 'E-Wallet (Individual)',
    Priority: 'High', // Placeholder value
    FraudType: 'Phishing', // Placeholder value
    FraudAmount: '4000', // Placeholder value
  }
];

const investigators = [
  { id: 1, name: 'Alice Johnson' },
  { id: 2, name: 'Bob Smith' },
  { id: 3, name: 'Charlie Brown' },
  { id: 4, name: 'Diana Prince' }
];

const caseDetails = {
  id: 'CASE001',
  title: 'Suspicious wire transfer',
  description: 'Large wire transfer to an unknown account flagged for review.',
  assignedTo: 'Alice Johnson',
  status: 'Open',
  priority: 'High',
  dueDate: '2023-12-01',
  notes: [
    {
      id: 1,
      author: 'Alice Johnson',
      content: 'Initiated investigation on the wire transfer details.',
      timestamp: '2023-11-24 09:30:00'
    },
    {
      id: 2,
      author: 'Bob Smith',
      content: 'Contacted the account holder for verification.',
      timestamp: '2023-11-24 11:45:00'
    }
  ],
  documents: [
    {
      id: 1,
      name: 'Transaction_Log.pdf',
      uploadedBy: 'Alice Johnson',
      timestamp: '2023-11-24 10:15:00'
    },
    {
      id: 2,
      name: 'Account_Statement.xlsx',
      uploadedBy: 'Bob Smith',
      timestamp: '2023-11-24 14:30:00'
    }
  ],
  auditTrail: [
    {
      id: 1,
      action: 'Case Created',
      performedBy: 'System',
      timestamp: '2023-11-23 15:00:00'
    },
    {
      id: 2,
      action: 'Assigned to Alice Johnson',
      performedBy: 'John Doe (Manager)',
      timestamp: '2023-11-23 15:05:00'
    },
    {
      id: 3,
      action: 'Status changed to Open',
      performedBy: 'Alice Johnson',
      timestamp: '2023-11-24 09:00:00'
    }
  ]
};

export default function FraudMonitor() {
  const [selectedCase, setSelectedCase] = useState(caseDetails);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  
  const handleCaseClick = (caseId: string) => {
    router.push('/bank_dashboard/risk_analysis');
  };

  return (
    <PageContainer scrollable>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Fraud Monitor</h1>
          <Button>File Report Manually</Button>
        </div>

        {/* Case List */}
        <Card>
          <CardHeader>
            <CardTitle>Fraud Accounts (4)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Id</TableHead>
                  <TableHead>Account Number</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Account Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Fraud Type</TableHead>
                  <TableHead>Fraud Amount (MYR)</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.map((case_) => (
                  <TableRow key={case_.AccountId}>
                    <TableCell>{case_.AccountId}</TableCell>
                    <TableCell>{case_.AccountNumber}</TableCell>
                    <TableCell>{case_.AccountHolderFullName}</TableCell>
                    <TableCell>{case_.AccountType}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          case_.Priority === 'High'
                            ? 'bg-red-500 text-black'
                            : case_.Priority === 'Medium'
                            ? 'bg-yellow-500 text-black'
                            : 'bg-green-500 text-black'
                        }
                      >
                        {case_.Priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{case_.FraudType}</TableCell>
                    <TableCell>{case_.FraudAmount}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCaseClick(case_.AccountId)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Case Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedCase.title}</DialogTitle>
              <DialogDescription>Case ID: {selectedCase.id}</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Case Details</TabsTrigger>
                <TabsTrigger value="notes">Notes & Comments</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="audit">Audit Trail</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Assigned To</Label>
                      <Select defaultValue={selectedCase.assignedTo}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select investigator" />
                        </SelectTrigger>
                        <SelectContent>
                          {investigators.map((investigator) => (
                            <SelectItem
                              key={investigator.id}
                              value={investigator.name}
                            >
                              {investigator.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select defaultValue={selectedCase.status}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Open">Open</SelectItem>
                          <SelectItem value="In Progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="Under Review">
                            Under Review
                          </SelectItem>
                          <SelectItem value="Escalated">Escalated</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Priority</Label>
                      <Select defaultValue={selectedCase.priority}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Due Date</Label>
                      <Input type="date" defaultValue={selectedCase.dueDate} />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      defaultValue={selectedCase.description}
                      rows={4}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="notes">
                <div className="space-y-4">
                  {selectedCase.notes.map((note) => (
                    <div key={note.id} className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src="/avatar.png" alt={note.author} />
                        <AvatarFallback>
                          <UserCircleIcon />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-semibold">
                          {note.author}
                        </div>
                        <div className="text-xs text-gray-500">
                          {note.timestamp}
                        </div>
                        <div>{note.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="documents">
                <div className="space-y-4">
                  {selectedCase.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center space-x-2">
                      <PaperClipIcon className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm">{doc.name}</div>
                        <div className="text-xs text-gray-500">
                          {doc.uploadedBy} - {doc.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="audit">
                <div className="space-y-4">
                  {selectedCase.auditTrail.map((action) => (
                    <div key={action.id}>
                      <div className="font-semibold">{action.action}</div>
                      <div className="text-xs text-gray-500">
                        Performed by: {action.performedBy} on {action.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
}
