'use client';
import { useEffect, useState } from 'react';
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
import { useRouter, useSearchParams } from 'next/navigation';
import OpenAI from 'openai';
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  dangerouslyAllowBrowser: true
});
import { supabase } from '@/lib/supabaseClient';

const fraudulentReasons = [
  'Unauthorized Use of Payment Method',
  'Fake or Suspicious Merchant Website',
  'Fake Buyer or Seller',
  'Suspiciously High Transaction Volume'
];

const fetchCompletion = async (): Promise<string[]> => {
  const prompt = `Generate one question for each reason related to suspicious transactions in JSON format. 
  Use this structure:
  {
    "fake_buyer_or_seller": "Question here",
    "fake_or_suspicious_merchant_website": "Question here",
    "suspiciously_high_transaction_volume": "Question here",
    "unauthorized_use_of_payment_method": "Question here"
  }`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [{ role: 'user', content: prompt }],
    });

    const content = completion.choices[0].message.content;
    const parsedContent = JSON.parse(content!); // Parse JSON from response
    return Object.values(parsedContent); // Extract question texts as an array
  } catch (error) {
    console.error('Error fetching questions:', error);
    return []; // Return an empty array on error
  }
};

interface AccountData {
  Account_ID: string;
  Status: string;
  Account_Holder_Full_Name: string;
  Account_Number : number;
  Provider_Name: string;
}

export default function Page() {
  const [showWarning, setShowWarning] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [isTransactionClean, setIsTransactionClean] = useState(true); // Add this state
  const [output, setOutput] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount');
  const accountNumber = searchParams.get('accountNumber');
  const [fraudWarning, setFraudWarning] = useState(false);
  const [accountName , setAccountName] = useState("");
  const [providerName , setProviderName] = useState("");


  const handleContinue = () => {
    // Mock check for high-risk recipient
    if (isTransactionClean) {
      router.push(`/customer/transaction-complete?isTransactionClean=${isTransactionClean}`);
    } else {
      setShowWarning(true);
    }
  };

  // Function to check account status
  const checkAccountStatus = async (accountNumber: string) => {
    try {
      // Remove .single() and handle multiple/zero results
      const { data, error } = await supabase
        .from('blacklist_graylist')
        .select('*')
        .eq('Account_Number', accountNumber);  // Removed .single()
  
      if (error) {
        console.error('Supabase Error:', error);
        return null;
      }
  
      if (data && data.length > 0) {
        return data[0] as AccountData;  // Return first matching record
      }
  
      console.warn(`No account found for number: ${accountNumber}`);
      return null;
    } catch (error) {
      console.error('Unexpected error:', error);
      return null;
    }
  };
   // Effect to check account status on component mount
   useEffect(() => {
    const verifyAccount = async () => {
      const accountData = await checkAccountStatus(accountNumber!);
  
      if (accountData) {
        setAccountName(accountData.Account_Holder_Full_Name);
        setProviderName(accountData.Provider_Name);
        
        if (accountData.Status === 'Blacklisted') {
          setFraudWarning(true);
        } else if (accountData.Status === 'Greylisted') {
          setIsTransactionClean(false);
          const questions = await fetchCompletion();
          setQuestions(questions);
          console.log(questions);
        }
      }
    };
  
    verifyAccount();
  }, [accountNumber]);


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
    router.push('/customer/transfer-account');
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
              onClick={() => router.push('/customer/transfer-account')}
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
        <div className="flex-1 space-y-2.5 p-3">
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
                      {!isTransactionClean && (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      )}{' '}
                      <p className="pl-2 font-semibold">{accountName}</p>
                    </div>
                    <p className="text-gray-600">
                      {accountNumber} | {providerName}
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
                  <p className="font-semibold">{amount}</p>
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

            <div className="rounded-lg bg-gray-50 p-3">
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
                    suspicious. Due to:
                  </p>
                  <ul className="list-disc space-y-1 pl-4">
                    {fraudulentReasons.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="mt-4">
                  {questions && questions[currentQuestionIndex - 1]}
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

      {/* Block Transaction */}
      <AlertDialog open={fraudWarning}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-yellow-600">
            Transaction Blocked
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
            The sender has been identified and blacklisted as a high-risk entity based on information from the official fraud portal. For your protection, this transaction cannot proceed. Please contact support for further assistance
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className="w-full bg-red-500 hover:bg-red-600 sm"
              onClick={handleCancel}
            >
             Finish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
