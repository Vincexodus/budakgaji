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

const fraudulentReasons = [
  'Why did you transfer money to this account?',
  'Do you know the person you transferred money to?',
  'Was the transfer amount correct?',
  'Did you verify the account details before transferring?',
  'Was this transfer authorized by you?'
];

export default function Page() {
  const [showWarning, setShowWarning] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
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

  const handleNext = () => {
    if (currentQuestionIndex < fraudulentReasons.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      router.push('/customer/transaction-complete');
      setShowWarning(false);
      // Proceed with the transfer
      console.log('Transfer completed despite warning:');
    }
  };

  const handleCancel = () => {
    setShowWarning(false);
    setCurrentQuestionIndex(0);
    router.push('/customer/transfer-amount');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex min-h-[800px] w-full max-w-md flex-col rounded-lg bg-white shadow-lg">
        {/* Header */}
        <header className="flex items-center justify-between border-b p-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/customer/transfer-amount')}
            >
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
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white">
              ap
            </div>
            <h2 className="text-xl font-semibold">Review & Confirm</h2>
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
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
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

          {/* Terms and Important Note */}
          <div className="space-y-4">
            <p className="text-sm">
              By proceeding I acknowledge that I have read and agreed to the{' '}
              <span className="text-blue-600">Terms and Conditions</span>.
            </p>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="font-semibold">Important Note:</p>
              <p className="text-sm text-gray-600">
                Money withdrawn from your insured deposit(s) is not protected by
                PIDM if transferred to overseas branches / banks or to a
                non-deposit account.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Button */}
        <div className="flex justify-center p-4">
          <Button
            className="w-2/3 bg-red-500 py-6 text-white hover:bg-red-600"
            onClick={handleContinue}
          >
            Agree & Continue
          </Button>
        </div>
      </div>

      {/* High Risk Warning Dialog */}
      <AlertDialog open={showWarning}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-yellow-600">
              {currentQuestionIndex === 0
                ? ' Medium-Risk Recipient Detected'
                : ` Question ${currentQuestionIndex}`}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              {currentQuestionIndex === 0 ? (
                <>
                  <p>
                    This recipient account has been flagged as potentially
                    suspicious. Please verify:
                  </p>
                  <ul className="list-disc space-y-1 pl-4">
                    <li>You know and trust the recipient</li>
                    <li>You have verified the account details</li>
                    <li>You understand this transfer cannot be reversed</li>
                  </ul>
                </>
              ) : (
                <p className="mt-4">
                  {fraudulentReasons[currentQuestionIndex - 1]}
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="w-full sm:w-auto"
              onClick={handleCancel}
            >
              Cancel Transfer
            </AlertDialogCancel>
            <AlertDialogAction
              className="w-full bg-red-500 hover:bg-red-600 sm:w-auto"
              onClick={handleNext}
            >
              {currentQuestionIndex === 0
                ? 'I wish to proceed by answering a few questions'
                : currentQuestionIndex < fraudulentReasons.length - 1
                ? 'Next'
                : 'Finish'}{' '}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
