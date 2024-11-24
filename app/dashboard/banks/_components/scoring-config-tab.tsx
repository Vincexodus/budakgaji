import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Settings } from 'lucide-react';
import { configTabProps } from '@/lib/configTabProps';

export default function ScoringConfigTab({
  activeBank,
  setActiveBank
}: configTabProps) {
  return (
    <Card className="bg-black shadow-lg">
      <CardHeader>
        <CardTitle className="text-white-600 flex items-center gap-2 text-2xl">
          <Settings className="h-6 w-6" />
          Risk Scoring
        </CardTitle>
        <CardDescription>
          Adjust transaction risk thresholds and scoring parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-white-700 text-sm font-medium">
            Risk Threshold
          </Label>
          <Slider
            defaultValue={[activeBank.riskThreshold]}
            max={100}
            step={1}
            className="w-full"
            onValueChange={(value) =>
              setActiveBank({ ...activeBank, riskThreshold: value[0] })
            }
          />
          <div className="grid grid-cols-3 gap-4">
            {['Online Transactions', 'In-Store', 'International'].map(
              (label) => (
                <div key={label} className="space-y-2">
                  <Label className="text-white-700 text-sm font-medium">
                    {label}
                  </Label>
                  <Input
                    type="number"
                    placeholder="Threshold"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
