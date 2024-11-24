import React from 'react';
import { Transaction } from '../../lib/mockData';

interface TransactionModalProps {
  transaction: Transaction;
  onClose: () => void;
}
export function TransactionModal({
  transaction,
  onClose
}: TransactionModalProps) {
  const getFraudIndicatorColor = (indicator: string) => {
    switch (indicator) {
      case 'clean':
        return 'bg-green-200';
      case 'suspicious':
        return 'bg-yellow-200';
      case 'likely fraud':
        return 'bg-red-200';
      default:
        return '';
    }
  };

  const fraudIndicatorColor = getFraudIndicatorColor(
    transaction.fraudIndicator
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-black p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Transaction Details</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400">
              <strong>ID:</strong> {transaction.id}
            </p>
            <p className="text-sm text-gray-400">
              <strong>Timestamp:</strong>{' '}
              {new Date(transaction.timestamp).toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">
              <strong>Amount:</strong> MYR {transaction.amount.toFixed(2)}
            </p>
            <p className="text-sm text-gray-400">
              <strong>Source Bank:</strong> {transaction.sourceBank}
            </p>
            <p className="text-sm text-gray-400">
              <strong>Destination Bank:</strong> {transaction.destinationBank}
            </p>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-400">
              <strong>Fraud Indicator:</strong>
              <span
                className={`ml-2 rounded px-2 py-1 text-black ${fraudIndicatorColor}`}
              >
                {transaction.fraudIndicator}
              </span>
            </p>
            {transaction.fraudType && (
              <p className="text-sm text-gray-400">
                <strong>Fraud Type:</strong> {transaction.fraudType}
              </p>
            )}
            <p className="text-sm text-gray-400">
              <strong>Risk Score:</strong> {transaction.riskScore.toFixed(2)}
            </p>
            <p className="text-sm text-gray-400">
              <strong>Alert Triggered:</strong>{' '}
              {transaction.alertTriggered ? 'Yes' : 'No'}
            </p>
            {transaction.alertTriggered && (
              <p className="text-sm text-gray-400">
                <strong>Notified Banks:</strong>{' '}
                <span
                  className={`ml-2 rounded px-2 py-1 text-black ${fraudIndicatorColor}`}
                >
                  {transaction.sourceBank}
                </span>
                {transaction.sourceBank !== transaction.destinationBank && (
                  <span
                    className={`ml-2 rounded px-2 py-1 text-black ${fraudIndicatorColor}`}
                  >
                    {transaction.destinationBank}
                  </span>
                )}
              </p>
            )}
            <p className="text-sm text-gray-400">
              <strong>Processing Time:</strong>{' '}
              {transaction.systemProcessingTime}ms
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
