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
import { Switch } from '@/components/ui/switch';
import { Brain } from 'lucide-react';

export default function ModelTuningTab({ activeBank, setActiveBank }) {
  return (
    <Card className="bg-black shadow-lg">
      <CardHeader>
        <CardTitle className="text-white-600 flex items-center gap-2 text-2xl">
          <Brain className="h-6 w-6" />
          Model Parameters
        </CardTitle>
        <CardDescription>
          Adjust machine learning model settings and features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="mlEnabled"
            checked={activeBank.enableML}
            onCheckedChange={(checked) =>
              setActiveBank({ ...activeBank, enableML: checked })
            }
          />
          <Label
            htmlFor="mlEnabled"
            className="text-white-700 text-sm font-medium"
          >
            Enable ML Model
          </Label>
        </div>
        <div className="space-y-2">
          <Label className="text-white-700 text-sm font-medium">
            Learning Rate
          </Label>
          <Slider
            defaultValue={[0.01]}
            max={1}
            step={0.01}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-white-700 text-sm font-medium">
            Feature Weights
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Transaction Amount"
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              placeholder="Geographic Risk"
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
