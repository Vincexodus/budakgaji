'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, X, AlertCircle } from 'lucide-react';
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

export default function Page() {
    const [showWarning, setShowWarning] = useState(false);
    const [verificationSuccess, setVerificationSuccess] = useState(false);
    const [progress, setProgress] = useState(0); // State to manage progress
    const [statusText, setStatusText] = useState('Verifying'); // State to manage status text
    const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVerificationSuccess(true);
      setStatusText('Verification Successful');
    }, 5000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100));
    }, 50); // Update progress every 60ms to reach 100% in 6000ms

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  useEffect(() => {
    if (verificationSuccess) {
      const redirectTimer = setTimeout(() => {
        router.push('/customer/transaction-complete');
      }, 1000);

      return () => clearTimeout(redirectTimer);
    }
  }, [verificationSuccess, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex min-h-[800px] w-full max-w-md flex-col rounded-lg bg-white shadow-lg overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between border-b p-4 bg-white z-10">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-semibold">Transaction Verification</h1>
          </div>
          <Button variant="ghost" size="icon">
            <X className="h-6 w-6" />
          </Button>
        </header>

        <div className="pt-2 text-center text-black">
                <h2 className="text-lg font-semibold mb-2">
                  Position your face within the oval
                </h2>
                <p className="text-sm">to verify your identity</p>
              </div>
        {/* Main Content */}
        <div className="flex-1 space-y-6 p-4 relative">
          {/* GIF Background */}
          <div 
          className="absolute inset-0 z-0" 
          style={{
            backgroundImage: "url('https://media.giphy.com/media/SWnpGx4HGb1SNKdiMF/giphy.gif')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            clipPath: 'circle(32% at 50% 40%)',
          }}
        ></div>

          {/* Red Ring */}
          <div className="relative z-10 flex items-center justify-center h-full pt-[2.125rem]">
            <div className="w-96 h-96 rounded-full border-8 border-red-500 flex items-center justify-center">
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center mt-4">
            <div className="w-4/5 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="mt-2 text-lg">{statusText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

