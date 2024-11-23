import React, { useState } from 'react';
import { User, Shield, Smartphone, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from '@/components/ui/dialog';

// Sample fake data

interface UserProfileProps {
  user: {
    name: string;
    accountAge: string;
    devices: number;
    riskHistory: Array<{ date: string; score: number }> | undefined;
    linkedBanks: string[] | undefined;
  };
  onSuspend: () => void;
  onVerify: () => void;
  onFlagBank: (bank: string) => void;
}

export function UserProfile({
  user,
  onSuspend,
  onVerify,
  onFlagBank
}: UserProfileProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Handling the risk history height
  const renderRiskHistory = () => {
    if (
      !user.riskHistory ||
      !Array.isArray(user.riskHistory) ||
      user.riskHistory.length === 0
    ) {
      return <p>No risk history available</p>;
    }

    return (
      <div className="flex justify-between space-x-2">
        {user.riskHistory.map((item, index) => {
          let riskLevel = '';
          let bgColor = '';

          if (item.score > 70) {
            riskLevel = 'High';
            bgColor = 'bg-red-500';
          } else if (item.score > 40) {
            riskLevel = 'Moderate';
            bgColor = 'bg-yellow-500';
          } else {
            riskLevel = 'Low';
            bgColor = 'bg-green-500';
          }

          return (
            <div key={index} className="flex w-16 flex-col items-center">
              <div
                className={`w-full ${bgColor} rounded-t-lg`}
                style={{ height: `${item.score}%`, maxHeight: '100%' }}
              />
              <span className="mt-1 text-xs text-gray-700">{item.date}</span>
              <span
                className={`mt-1 text-xs ${
                  bgColor === 'bg-red-500' ? 'text-white' : 'text-gray-700'
                }`}
              >
                {riskLevel}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Profile</CardTitle>
        <User className="h-5 w-5 text-blue-600" />
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">Account Age</span>
            </div>
            <span className="text-sm font-medium">{user.accountAge}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Smartphone className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">Linked Devices</span>
            </div>
            <span className="text-sm font-medium">{user.devices}</span>
          </div>
        </div>

        {/* Risk History Section */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-700">
            Risk History
          </h4>
          <div className="flex h-24 justify-center space-x-2">
            {renderRiskHistory()}
          </div>
        </div>

        {/* Banks and Flagging Section */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-700">
            Linked Banks
          </h4>
          <Button
            onClick={() => setIsDialogOpen(true)}
            variant="outline"
            className="border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-500"
          >
            View Linked Banks
          </Button>
        </div>

        {/* User Actions */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onSuspend}
            className="flex-1 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-500"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Suspend User
          </Button>
          <Button onClick={onVerify} className="flex-1">
            <Shield className="mr-2 h-4 w-4" />
            Request Verification
          </Button>
        </div>
      </CardContent>

      {/* Dialog for Linked Banks */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Linked Banks</DialogTitle>
            <DialogDescription>
              The following banks are linked to this user.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {/* Safe check for undefined banks */}
            {(user.linkedBanks ?? []).map((bank, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {bank}
                </span>
                <Button
                  onClick={() => onFlagBank(bank)}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-500"
                >
                  Flag Bank
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Button
              onClick={() => setIsDialogOpen(false)}
              variant="outline"
              className="w-full"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
