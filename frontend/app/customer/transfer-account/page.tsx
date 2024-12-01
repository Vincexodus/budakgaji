'use client';

import { useState, useEffect } from 'react';
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
import { useTheme } from 'next-themes';

export default function Page() {
  const [showWarning, setShowWarning] = useState(false);
  const { setTheme } = useTheme();
  const router = useRouter();
  const [accountNumber, setAccountNumber] = useState("712345678901");
  const [amount, setAmount] = useState("250");
  const [prediction, setPrediction] = useState("");

  useEffect(() => {
    // Set the theme to light when the component mounts
    setTheme('light');
  }, [setTheme]);

  const handleTransferNow = async () => {
    const transactionData = {
      TransactionAmount: 250,
      in_degree: 15, // Replace with actual value
      out_degree: 12, // Replace with actual value
      in_weight: 15000.0, // Replace with actual value
      out_weight: 12000.0, // Replace with actual value
      AvailableBalance: 1200.0 // Replace with actual value
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      const result = await response.json();
      console.log('Prediction result:', result);

      const encodedResult = encodeURIComponent(JSON.stringify(result));
      // Navigate to the review-confirm page with the amount and accountNumber
      router.push(`/customer/review-confirm?amount=${amount}&accountNumber=${accountNumber}&result=${encodedResult}`);
    } catch (error) {
      console.error('Error making prediction request:', error);
    }
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
            <h2 className="text-black-800 text-2xl font-semibold">
              Maybank
            </h2>
          </div>

          <div className="space-y-1">
            <div className="">
              <p className="pb-2 text-gray-600">Account Bank Number</p>
              <div className="w-full">
                <div className="flex items-center">
                  <Input
                    type="text"
                    value={accountNumber}
                    className="w-full bg-transparent text-base font-semibold"
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="">
              <p className="pb-2 text-gray-600">Amount</p>
              <div className="w-full">
                <div className="flex items-center">
                  <BadgeDollarSign className="mr-2 h-6 w-6 text-gray-600" />
                  <Input
                    type="text"
                    value={amount}
                    className="w-full bg-transparent text-base font-semibold"
                    onChange={(e) => setAmount(e.target.value)}
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
          >
            Transfer Later
          </Button>
          <Button
            className="w-2/3 bg-red-500 py-6 text-base font-bold text-white hover:bg-red-600"
            onClick={handleTransferNow}
          >
            Transfer Now
          </Button>
        </div>
      </div>
    </div>
  );
}