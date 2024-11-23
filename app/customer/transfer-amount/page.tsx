'use client';

import { useState } from 'react';
import { ArrowLeft, X, AlertCircle, BadgeDollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [showWarning, setShowWarning] = useState(false);
  const router = useRouter();
  const handleContinue = () => {
    // Mock check for high-risk recipient
    const isHighRisk = true; // Set to true for demo
    if (isHighRisk) {
      setShowWarning(true);
    } else {
      // Proceed with transfer
      console.log('Transfer completed');
    }
  };
  const handleConfirmTransfer = () => {
    setShowWarning(false);
    // Proceed with the transfer
    console.log('Transfer completed despite warning:');
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex min-h-[800px] w-full max-w-md flex-col rounded-lg bg-white shadow-lg">
        {/* Header */}
        <header className="flex items-center justify-between border-b p-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-semibold">Transfer Money</h1>
          </div>
          <Button variant="ghost" size="icon">
            <X className="h-6 w-6" />
          </Button>
        </header>

        {/* Main Content */}
        <div className="flex-1 space-y-6 p-4">
          {/* Bank Logo and Title */}
          <div className="flex items-center space-x-3">
            <h2 className="text-base font-semibold">
              Fill in the amount you want to transfer:{' '}
            </h2>
          </div>

          <div className="space-y-1">
            <div className="">
              <p className="pb-2 text-gray-600">Amount</p>
              <div className="w-full">
                <div className="flex items-center">
                  <BadgeDollarSign className="h-6 w-6 text-gray-600 mr-2" />
                  <Input
                    type="text"
                    value="RM 100.00"
                    className="w-full bg-transparent font-semibold text-base"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Button */}
        <div className="flex justify-center space-x-4 p-4">
          <Button
            className="w-2/3 bg-white py-6 text-base font-bold text-black hover:bg-white"
            onClick={handleContinue}
          >
            Transfer Later
          </Button>
          <Button
            className="w-2/3 bg-red-500 py-6 text-base font-bold text-white hover:bg-red-600"
            onClick={() => router.push('/customer/review-confirm')}
          >
            Transfer Now
          </Button>
        </div>

        {/* High Risk Warning Dialog */}
        <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
          <AlertDialogContent className="max-w-sm">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center text-red-600">
                <AlertCircle className="mr-2 h-5 w-5" /> High-Risk Receipent
                Detected
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>
                  This recipient account has been flagged as potentially
                  suspicious. Please verify:
                </p>
                <ul className="list-disc space-y-1 pl-4">
                  <li>You know and trust the recipient</li>
                  <li>You have verified the account details</li>
                  <li>You understand this transfer cannot be reversed</li>
                </ul>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="w-full sm:w-auto">
                Cancel Transfer
              </AlertDialogCancel>
              <AlertDialogAction
                className="w-full bg-red-500 hover:bg-red-600 sm:w-auto"
                onClick={() => {
                  setShowWarning(false);
                  console.log('Transfer completed despite warning');
                  router.push('/customer/transfer-amount');
                }}
              >
                Proceed Anyway
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
