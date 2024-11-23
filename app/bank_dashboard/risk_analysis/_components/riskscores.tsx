'use client';

import React from 'react';
import { AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface RiskScoreProps {
  score: number;
  reasons: Array<{ code: string; confidence: number }>;
}

export function RiskScore({ score, reasons }: RiskScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Risk Assessment
          <Shield className="h-5 w-5 text-blue-600" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center">
          <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
            {score}
          </div>
          <div className="ml-3 text-sm text-muted-foreground">Risk Score</div>
        </div>

        <div className="space-y-3">
          {reasons.map((reason, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                {reason.confidence > 70 ? (
                  <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                )}
                <span className="text-sm text-foreground">{reason.code}</span>
              </div>
              <div className="text-sm font-medium">{reason.confidence}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
