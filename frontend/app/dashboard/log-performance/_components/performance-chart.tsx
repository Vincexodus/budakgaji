import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AArrowUp, ArrowDownUp, ArrowUp, Goal } from 'lucide-react';
import React from 'react';

export function PerformanceCharts() {
  return (
    <div className="py-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Most Frequent Fruad Type (last 24 hours)
            </CardTitle>
            <ArrowDownUp></ArrowDownUp>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Card Fraud</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Transaction Risk Score
            </CardTitle>
            <Goal></Goal>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.65</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Model Prediction Accuracy
            </CardTitle>
            <AArrowUp></AArrowUp>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.85</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
