'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [cameraActive, setCameraActive] = useState(false); // State to manage camera
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVerificationSuccess(true);
      setStatusText('Verification Successful');
    }, 7000);

    const progressInterval = setTimeout(() => {
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 1, 100));
      }, 50); // Update progress every 50ms to reach 100% in 5000ms

      return () => clearInterval(interval);
    }, 2000); // Delay progress bar movement for 2 seconds

    return () => {
      clearTimeout(timer);
      clearTimeout(progressInterval);
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

  useEffect(() => {
    setCameraActive(true); // Automatically start the camera when the component mounts
  }, []);

  useEffect(() => {
    if (cameraActive) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error('Error accessing camera: ', err);
          setStatusText('Camera access denied');
        });
    }
  }, [cameraActive]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex min-h-[800px] w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow-lg">
        {/* Header */}
        <header className="z-10 flex items-center justify-between border-b bg-white p-4">
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
          <h2 className="mb-2 text-lg font-semibold">
            Position your face within the circle
          </h2>
          <p className="text-sm">to verify your identity</p>
        </div>

        {/* Main Content */}
        <div className="relative flex-1 space-y-6 p-4">
          {/* Red Ring */}
          <div className="relative z-10 flex h-full items-center justify-center pt-[2.125rem]">
            <div className="flex h-96 w-96 items-center justify-center overflow-hidden rounded-full border-8 border-red-500">
              <video
                ref={videoRef}
                autoPlay
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="relative z-10 mt-4 flex flex-col items-center">
            <div className="h-2.5 w-4/5 rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2.5 rounded-full bg-red-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="mt-2 text-lg">{statusText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
