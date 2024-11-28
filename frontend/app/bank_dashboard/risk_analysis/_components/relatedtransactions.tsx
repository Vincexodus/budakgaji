'use client';

import React from 'react';
import { AlertCircle, Link } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  amount: number;
  date: string;
  type: string;
  flagged: boolean;
}

interface RelatedTransactionsProps {
  transactions: Transaction[];
  onViewTransaction: (id: string) => void;
}

export function RelatedTransactions({
  transactions,
  onViewTransaction
}: RelatedTransactionsProps) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Related Transactions</CardTitle>
        <Link className="h-5 w-5 text-blue-600" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              onClick={() => onViewTransaction(transaction.id)}
              className={cn(
                'flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors',
                transaction.flagged
                  ? 'bg-red-50 hover:bg-red-100'
                  : 'bg-muted hover:bg-muted-foreground'
              )}
            >
              <div className="flex items-center space-x-3">
                {transaction.flagged && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <div>
                  <div className="text-sm font-medium text-foreground">
                    ${transaction.amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {transaction.type}
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {transaction.date}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
