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
  children?: Node[];
}

interface TransactionFlowProps {
  nodes: Node[];
  onNodeClick: (nodeId: string) => void;
}

export function TransactionFlow({ nodes, onNodeClick }: TransactionFlowProps) {
  const renderNode = (node: Node) => (
    <div key={node.id} className="flex flex-col items-center">
      <div
        onClick={() => onNodeClick(node.id)}
        className={cn(
          'relative flex cursor-pointer flex-col items-center rounded-lg p-4 transition-colors',
          node.flagged ? 'bg-red-500 text-white' : 'bg-gray-200 text-black'
        )}
      >
        {node.flagged && <AlertCircle className="absolute top-0 right-0 h-4 w-4 text-red-500" />}
        <div>{node.name}</div>
      </div>
      {node.children && (
        <div className="ml-4 mt-2 flex flex-col space-y-2">
          {node.children.map((child) => renderNode(child))}
        </div>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Network</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          {nodes.map((node) => renderNode(node))}
        </div>
      </CardContent>
    </Card>
  );
}