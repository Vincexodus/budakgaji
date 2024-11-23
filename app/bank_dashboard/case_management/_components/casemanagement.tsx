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
import { PaperclipIcon as PaperClipIcon, UserCircleIcon } from 'lucide-react';
import PageContainer from '@/components/layout/page-container';

// Mock data
const cases = [
  {
    id: 'CASE001',
    title: 'Suspicious wire transfer',
    assignedTo: 'Alice Johnson',
    status: 'Open',
    priority: 'High',
    dueDate: '2023-12-01'
  },
  {
    id: 'CASE002',
    title: 'Multiple failed login attempts',
    assignedTo: 'Bob Smith',
    status: 'In Progress',
    priority: 'Medium',
    dueDate: '2023-11-30'
  },
  {
    id: 'CASE003',
    title: 'Unusual account activity',
    assignedTo: 'Charlie Brown',
    status: 'Under Review',
    priority: 'Low',
    dueDate: '2023-12-05'
  },
  {
    id: 'CASE004',
    title: 'Potential identity theft',
    assignedTo: 'Diana Prince',
    status: 'Escalated',
    priority: 'High',
    dueDate: '2023-11-28'
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

export default function CaseManagement() {
  const [selectedCase, setSelectedCase] = useState(caseDetails);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCaseClick = (caseId: string) => {
    // In a real application, this would fetch the case details from an API
    setSelectedCase(caseDetails);
    setIsDialogOpen(true);
  };

  return (
    <PageContainer scrollable>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Case Management</h1>
          <Button>Create New Case</Button>
        </div>

        {/* Case List */}
        <Card>
          <CardHeader>
            <CardTitle>Active Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.map((case_) => (
                  <TableRow key={case_.id}>
                    <TableCell>{case_.id}</TableCell>
                    <TableCell>{case_.title}</TableCell>
                    <TableCell>{case_.assignedTo}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          case_.status === 'Open'
                            ? 'secondary'
                            : case_.status === 'In Progress'
                            ? 'default'
                            : case_.status === 'Under Review'
                            ? 'warning'
                            : 'destructive'
                        }
                      >
                        {case_.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          case_.priority === 'High'
                            ? 'destructive'
                            : case_.priority === 'Medium'
                            ? 'warning'
                            : 'secondary'
                        }
                      >
                        {case_.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{case_.dueDate}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCaseClick(case_.id)}
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
