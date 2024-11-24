import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Building, Save } from 'lucide-react';

export default function BankConfigTab({ activeBank, setActiveBank }) {
  return (
    <Card className="bg-black shadow-lg">
      <CardHeader>
        <CardTitle className="text-white-600 flex items-center gap-2 text-2xl">
          <Building className="h-6 w-6" />
          Bank Profile
        </CardTitle>
        <CardDescription>
          Configure bank-specific settings and integration options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid w-full gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="bankName"
              className="text-white-700 text-sm font-medium"
            >
              Bank Name
            </Label>
            <Input
              id="bankName"
              value={activeBank.name}
              onChange={(e) =>
                setActiveBank({ ...activeBank, name: e.target.value })
              }
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="apiIntegration" />
            <Label
              htmlFor="apiIntegration"
              className="text-white-700 text-sm font-medium"
            >
              Enable API Integration
            </Label>
          </div>
          <Button className="w-full bg-blue-500 text-white hover:bg-blue-600">
            <Save className="mr-2 h-4 w-4" />
            Save Bank Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
