'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hash, User, DollarSign, CreditCard, Clock } from 'lucide-react';

interface TransactionDetailsProps {
  transaction: {
    id: string;
    userId: string;
    amount: number;
    paymentMethod: string;
    timestamp: string;
  };
}

export function TransactionDetails({ transaction }: TransactionDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DetailRow
            icon={<Hash />}
            label="Transaction ID"
            value={transaction.id}
          />
          <DetailRow
            icon={<User />}
            label="User ID"
            value={transaction.userId}
          />
          <DetailRow
            icon={<DollarSign />}
            label="Amount"
            value={`$${transaction.amount.toLocaleString()}`}
          />
          <DetailRow
            icon={<CreditCard />}
            label="Payment Method"
            value={transaction.paymentMethod}
          />
          <DetailRow
            icon={<Clock />}
            label="Timestamp"
            value={transaction.timestamp}
          />
        </div>
      </CardContent>
    </Card>
  );
}

const DetailRow = ({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      {icon}
      <span className="ml-2 text-sm text-muted-foreground">{label}</span>
    </div>
    <span className="text-sm font-medium">{value}</span>
  </div>
);
