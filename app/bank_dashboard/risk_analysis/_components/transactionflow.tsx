'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Node {
  id: string;
  type: 'sender' | 'intermediary' | 'receiver';
  name: string;
  flagged: boolean;
}

interface TransactionFlowProps {
  nodes: Node[];
  onNodeClick: (nodeId: string) => void;
}

export function TransactionFlow({ nodes, onNodeClick }: TransactionFlowProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Flow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          {nodes.map((node, index) => (
            <React.Fragment key={node.id}>
              <div
                onClick={() => onNodeClick(node.id)}
                className={cn(
                  'relative flex cursor-pointer flex-col items-center rounded-lg p-4 transition-colors',
                  node.flagged ? 'bg-red-50' : 'bg-muted',
                  'hover:bg-opacity-80'
                )}
              >
                <div
                  className={cn(
                    'text-sm font-medium',
                    node.flagged ? 'text-red-700' : 'text-foreground'
                  )}
                >
                  {node.name}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {node.type}
                </div>
                {node.flagged && (
                  <AlertCircle className="absolute -right-2 -top-2 h-4 w-4 text-red-500" />
                )}
              </div>
              {index < nodes.length - 1 && (
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              )}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
