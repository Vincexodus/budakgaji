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
import { Switch } from '@/components/ui/switch';
import { AlertCircle } from 'lucide-react';
import { configTabProps } from '@/lib/configTabProps';

export default function AlertConfigTab({
  activeBank,
  setActiveBank
}: configTabProps) {
  return (
    <Card className="bg-black shadow-lg">
      <CardHeader>
        <CardTitle className="text-white-600 flex items-center gap-2 text-2xl">
          <AlertCircle className="h-6 w-6" />
          Alert Configuration
        </CardTitle>
        <CardDescription>
          Configure alert escalation rules and workflows
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="autoEscalation"
            checked={activeBank.autoEscalation}
            onCheckedChange={(checked) =>
              setActiveBank({ ...activeBank, autoEscalation: checked })
            }
          />
          <Label
            htmlFor="autoEscalation"
            className="text-white-700 text-sm font-medium"
          >
            Automatic Escalation
          </Label>
        </div>
        <div className="space-y-2">
          <Label className="text-white-700 text-sm font-medium">
            High Risk Threshold
          </Label>
          <Input
            type="number"
            placeholder="Risk Score"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-white-700 text-sm font-medium">
            Escalation Delay (minutes)
          </Label>
          <Input
            type="number"
            placeholder="Delay"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </CardContent>
    </Card>
  );
}
