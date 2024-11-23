import React, { useState, useEffect } from 'react';
import {
  Transaction,
  generateMockTransactions
} from '../../../../lib/mockData';
import { TransactionModal } from '../../../../components/modal/transaction-modal';

export function TransactionView() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  useEffect(() => {
    // Initial load of transactions
    setTransactions(generateMockTransactions(10));

    // Simulating real-time updates
    const interval = setInterval(() => {
      setTransactions((prev) => [
        generateMockTransactions(1)[0],
        ...prev.slice(0, 49)
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-black text-white">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Timestamp</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Source Bank</th>
              <th className="px-4 py-2">Destination Bank</th>
              <th className="px-4 py-2">Fraud Indicator</th>
              <th className="px-4 py-2">Risk Score</th>
              <th className="px-4 py-2">Alert Triggered</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="cursor-pointer hover:bg-gray-700"
                onClick={() => handleRowClick(transaction)}
              >
                <td className="border px-4 py-2">
                  {transaction.id.slice(0, 8)}
                </td>
                <td className="border px-4 py-2">
                  {new Date(transaction.timestamp).toLocaleString()}
                </td>
                <td className="border px-4 py-2">
                  {transaction.amount.toFixed(2)}
                </td>
                <td className="border px-4 py-2">{transaction.sourceBank}</td>
                <td className="border px-4 py-2">
                  {transaction.destinationBank}
                </td>
                <td className="border px-4 py-2 text-black">
                  <span
                    className={`rounded px-2 py-1 ${
                      transaction.fraudIndicator === 'clean'
                        ? 'bg-green-200'
                        : transaction.fraudIndicator === 'suspicious'
                        ? 'bg-yellow-200'
                        : 'bg-red-200'
                    }`}
                  >
                    {transaction.fraudIndicator}
                  </span>
                </td>
                <td className="border px-4 py-2">
                  {transaction.riskScore.toFixed(2)}
                </td>
                <td className="border px-4 py-2">
                  {transaction.alertTriggered ? 'Yes' : 'No'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedTransaction && (
        <TransactionModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}
