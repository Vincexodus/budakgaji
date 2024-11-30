import React, { useState, useEffect } from 'react';
// import {
//   Transaction,
//   generateMockTransactions
// } from '../../../../lib/mockData';
import { TransactionModal } from '../../../../components/modal/transaction-modal';
import { PerformanceCharts } from './performance-chart';
import { supabase } from '@/lib/supabaseClient';

interface CreditorAccount {
  AccountId: string;
  AccountNumber: string;
  AccountHolderFullName: string;
}

interface Transaction {
  AccountType: string;
  PaymentScheme: string;
  CreditDebitIndicator: string;
  TransactionID: string;
  TransactionType: string;
  CategoryPurposeCode: string;
  Status: string;
  BookingDateTime: string;
  ValueDateTime: string;
  TransactionAmount: number;
  AccountCurrencyAmount: number;
  AccountCurrency: string;
  CreditorAccount: CreditorAccount;
  FraudType: string;
}
export function TransactionView() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

    useEffect(() => {
      const fetchTransactions = async () => {
        const { data, error } = await supabase
          .from('valid_transactions')
          .select(`
            AccountType,
            PaymentScheme,
            CreditDebitIndicator,
            TransactionID,
            TransactionType,
            CategoryPurposeCode,
            Status,
            BookingDateTime,
            ValueDateTime,
            TransactionAmount,
            AccountCurrencyAmount,
            AccountCurrency,
            CreditorAccount,
            FraudType
          `)
          .limit(50); // Adjust the limit as needed
    
        if (error) {
          console.error('Error fetching transactions:', error);
        } else {
          setTransactions(data as Transaction[]);
        }
      };
    
      fetchTransactions();
    }, []);
  // useEffect(() => {
  //   // Initial load of transactions
  //   setTransactions(generateMockTransactions(100));

  //   // Simulating real-time updates
  //   const interval = setInterval(() => {
  //     setTransactions((prev) => [
  //       generateMockTransactions(1)[0],
  //       ...prev.slice(0, 49)
  //     ]);
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  return (
    <div className=" mx-auto">
      <PerformanceCharts />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-black text-white">
          <thead className="bg-gray-800 ">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Booking Date Time</th>
              <th className="px-4 py-2">Value Date Time</th>
              <th className="px-4 py-2">Account Type</th>
              <th className="px-4 py-2">Payment Scheme</th>
              <th className="px-4 py-2">Indicator</th>
              <th className="px-4 py-2">Category Purpose Code</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Transaction Amount</th>
              <th className="px-4 py-2">Currency Amount</th>
              <th className="px-4 py-2">Currency</th>
              <th className="px-4 py-2">Creditor Account</th>
              <th className="px-4 py-2">Fraud Type</th>
            </tr>
          </thead>
          <tbody className="">
            {transactions.map((transaction) => (
              <tr
                key={transaction.TransactionID}
                className="cursor-pointer hover:bg-gray-700"
                onClick={() => handleRowClick(transaction)}
              >
                <td className="border px-4 py-2">
                  {transaction.TransactionID.slice(0, 8)}
                </td>
                <td className="border px-4 py-2">
                  {new Date(transaction.BookingDateTime).toLocaleString()}
                </td>
                <td className="border px-4 py-2">
                  {new Date(transaction.ValueDateTime).toLocaleString()}
                </td>
                <td className="border px-4 py-2">{transaction.AccountType}</td>
                <td className="border px-4 py-2">
                  {transaction.PaymentScheme}
                </td>
                <td className="border px-4 py-2 text-black">
                  <span
                    className={`rounded px-2 py-1 ${
                      transaction.CreditDebitIndicator === 'DEBIT'
                        ? 'bg-blue-200'
                        : 'bg-red-200'
                    }`}
                  >
                  
                    {transaction.CreditDebitIndicator}
                  </span>
                </td>
                <td className="border px-4 py-2">
                  {transaction.CategoryPurposeCode}
                </td>
                <td className="border px-4 py-2">
                  <span
                      className={`rounded px-2 py-1 text-black ${
                        transaction.Status === 'Completed'
                          ? 'bg-green-200'
                          : 'bg-red-200'
                      }`}
                    >
                    
                      {transaction.Status}
                    </span>
                </td>
                <td className="border px-4 py-2">
                  {transaction.TransactionAmount.toFixed(2)}
                </td>
                <td className="border px-4 py-2">
                  {transaction.AccountCurrencyAmount.toFixed(2)}
                </td>
                <td className="border px-4 py-2">
                  {transaction.AccountCurrency}
                </td>
                <td className="border px-4 py-2">
                  {transaction.CreditorAccount.AccountId}
                </td>
                <td className="border px-4 py-2 text-black">
                  <span
                    className={`rounded px-2 py-1 ${
                      !transaction.FraudType
                        ? 'bg-transparent text-white'
                        : transaction.FraudType === 'fraud ring'
                        ? 'bg-yellow-200'
                        : transaction.FraudType === 'smurfing'
                        ? 'bg-green-200'
                        : transaction.FraudType === 'account_takeover'
                        ? 'bg-purple-200'
                        : 'bg-gray-200'
                    }`}
                  >
                    {transaction.FraudType ? transaction.FraudType : '-'}
                  </span>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* {selectedTransaction && (
        <TransactionModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )} */}
    </div>
  );
}
