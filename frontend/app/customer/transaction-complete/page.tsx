'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  X,
  AlertTriangle,
  AlertCircle,
  CircleCheck,
  Download,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const isTransactionClean = searchParams.get('isTransactionClean') === 'true';

  const [showWarning, setShowWarning] = useState(false);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex min-h-[800px] w-full max-w-md flex-col rounded-lg bg-white shadow-lg">
        {/* Header */}
        <header className="flex items-center justify-between border-b p-4">
          <div className="flex items-center space-x-4">
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/customer/transfer-amount')}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button> */}
            <h1 className="text-xl font-semibold">Transaction Successful</h1>
          </div>
          {/* <Button variant="ghost" size="icon">
            <X className="h-6 w-6" />
          </Button> */}
        </header>

        {/* Main Content */}
        <div className="flex-1 space-y-6 p-4">
          {/* Bank Logo and Title */}
          <div className="flex items-center justify-center">
            <CircleCheck className="h-20 w-20 text-green-500" />
          </div>
          <hr className="border-t border-gray-300" />

          {/* Transfer Details */}
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="flex justify-between">
                <p className="text-gray-600">Transfer to</p>
                <div className="flex items-center justify-end space-x-2">
                  <div className="text-right">
                    <div className="flex justify-end">
                      {!isTransactionClean && (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      )}{' '}
                      <p className="pl-2 font-semibold">JOHN DOE</p>
                    </div>
                    <p className="text-gray-600">
                      1234567890 | CIMB Bank Berhad
                    </p>
                  </div>
                </div>
              </div>
              <hr className="border-t border-gray-300" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <p className="text-gray-600">Amount</p>
                <div className="text-right">
                  <p className="font-semibold">RM100.00</p>
                  <p className="text-gray-600">Service Charge: RM 1.00</p>
                </div>
              </div>
              <hr className="border-t border-gray-300" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <p className="text-gray-600">Date</p>
                <div className="text-right">
                  <p className="font-semibold">Transfer Now</p>
                  <p className="text-gray-600">Today, 24 Nov 2024</p>
                </div>
              </div>
              <hr className="border-t border-gray-300" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <p className="text-gray-600">Recipient Reference</p>
                <p className="text-right font-semibold">Sent from AmOnline</p>
              </div>
              <hr className="border-t border-gray-300" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <p className="text-gray-600">From</p>
                <div className="text-right">
                  <p className="font-semibold">MY Savings Account</p>
                  <p className="text-gray-600">9876543210</p>
                  <p className="text-gray-600">Available Balance: RM497.13</p>
                </div>
              </div>
            </div>
            <hr className="border-t border-gray-300" />
          </div>
        </div>
        {/* Bottom Buttons */}
        <div className="flex justify-center space-x-4 p-4">
          <Button
            className="w-2/3 bg-red-500 py-6 text-white hover:bg-red-600"
            onClick={() => router.push('/customer/transfer-account')}
          >
            <Download className="mr-2 h-5 w-5" />
            Download Receipt
          </Button>
          <Button
            className="w-2/3 border bg-white py-6 text-black hover:bg-gray-100"
            onClick={() => router.push('/dashboard/overview')}
          >
            <Share2 className="mr-2 h-5 w-5" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
