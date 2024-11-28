'use client';

import React from 'react';
import { TransactionDetails } from './transactiondetails';
import { RiskScore } from './riskscores';
import { UserProfile } from './userprofile';
import { TransactionFlow } from './transactionflow';
import { RelatedTransactions } from './relatedtransactions';
import { CaseNotes } from './casenotes';
import { Card } from '@/components/ui/card';

// Mock data interfaces
interface Transaction {
  id: string;
  userId: string;
  amount: number;
  paymentMethod: string;
  timestamp: string;
}

interface RiskScoreData {
  score: number;
  reasons: Array<{
    code: string;
    confidence: number;
  }>;
}

interface User {
  name: string;
  accountAge: string;
  devices: number;
  riskHistory: Array<{
    date: string;
    score: number;
  }>;
  linkedBanks: string[];
}

interface FlowNode {
  id: string;
  type: 'sender' | 'intermediary' | 'receiver';
  name: string;
  flagged: boolean;
}

interface RelatedTransaction {
  id: string;
  amount: number;
  date: string;
  type: string;
  flagged: boolean;
}

interface CaseNote {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

// Mock data
const mockTransaction: Transaction = {
  id: 'TXN-123456789',
  userId: 'USR-987654321',
  amount: 15000,
  paymentMethod: 'Credit Card',
  timestamp: '2024-03-14 15:30:45 UTC'
};

const mockRiskScore: RiskScoreData = {
  score: 85,
  reasons: [
    { code: 'Unusual Location', confidence: 90 },
    { code: 'Amount Mismatch', confidence: 75 },
    { code: 'Device Change', confidence: 60 }
  ]
};

const mockFlow: FlowNode[] = [
  { id: '1', type: 'sender', name: 'John Doe', flagged: true },
  {
    id: '2',
    type: 'intermediary',
    name: 'Payment Processor',
    flagged: false
  },
  { id: '3', type: 'receiver', name: 'Unknown Merchant', flagged: true }
];

const mockRelatedTransactions: RelatedTransaction[] = [
  {
    id: '1',
    amount: 12000,
    date: '2024-03-13',
    type: 'Card Payment',
    flagged: true
  },
  {
    id: '2',
    amount: 8000,
    date: '2024-03-12',
    type: 'Transfer',
    flagged: false
  },
  {
    id: '3',
    amount: 15000,
    date: '2024-03-11',
    type: 'Card Payment',
    flagged: true
  }
];

const mockNotes: CaseNote[] = [
  {
    id: '1',
    text: 'User contacted support claiming this was an authorized transaction.',
    author: 'Sarah (Support)',
    timestamp: '2024-03-14 16:00 UTC'
  },
  {
    id: '2',
    text: 'Investigating unusual location pattern.',
    author: 'Mike (Risk)',
    timestamp: '2024-03-14 15:45 UTC'
  }
];

const fakeUser: User = {
  name: 'John Doe',
  accountAge: '3 years',
  devices: 2,
  riskHistory: [
    { date: '2024-11-01', score: 80 },
    { date: '2024-10-15', score: 45 },
    { date: '2024-09-30', score: 60 }
  ],
  linkedBanks: ['Public Bank', 'OCBC Bank', 'RHB Bank']
};

// Dummy handlers for suspend, verify, and flag bank actions
const handleSuspend = () => alert('User Suspended');
const handleVerify = () => alert('Verification Requested');
const handleFlagBank = (bank: string) => alert(`Flagged ${bank}`);

export default function RiskAnalysis() {
  // Event handlers
  const handleNodeClick = (nodeId: string) => {
    console.log('Node clicked:', nodeId);
  };

  const handleViewTransaction = (id: string) => {
    console.log('View transaction:', id);
  };

  const handleAddNote = (note: string) => {
    console.log('Add note:', note);
  };

  const handleSuspendUser = () => {
    console.log('Suspend user');
  };

  const handleVerifyUser = () => {
    console.log('Verify user');
  };

  const handleEscalate = () => {
    console.log('Escalate case');
  };

  const handleMarkSafe = () => {
    console.log('Mark as safe');
  };

  const handleAssign = (userId: string) => {
    console.log('Assign to:', userId);
  };

  return (
    <div className="container mx-auto space-y-6 py-6">
      <header className="flex items-center justify-between">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Transaction Risk Analysis
        </h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <TransactionDetails transaction={mockTransaction} />
          <RiskScore
            score={mockRiskScore.score}
            reasons={mockRiskScore.reasons}
          />
        </div>

        <div className="space-y-6">
          <UserProfile
            user={fakeUser}
            onSuspend={handleSuspend}
            onVerify={handleVerify}
            onFlagBank={handleFlagBank}
          />
          <TransactionFlow nodes={mockFlow} onNodeClick={handleNodeClick} />
        </div>

        <div className="space-y-6">
          <RelatedTransactions
            transactions={mockRelatedTransactions}
            onViewTransaction={handleViewTransaction}
          />
          <CaseNotes
            notes={mockNotes}
            onAddNote={handleAddNote}
            onEscalate={handleEscalate}
            onMarkSafe={handleMarkSafe}
            onAssign={handleAssign}
          />
        </div>
      </div>
    </div>
  );
}
