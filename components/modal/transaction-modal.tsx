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
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl rounded-lg bg-black p-6">
        <h2 className="mb-4 text-xl font-bold">Transaction Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>
              <strong>ID:</strong> {transaction.id}
            </p>
            <p>
              <strong>Timestamp:</strong>{' '}
              {new Date(transaction.timestamp).toLocaleString()}
            </p>
            <p>
              <strong>Amount:</strong> {transaction.amount.toFixed(2)}
            </p>
            <p>
              <strong>Source Bank:</strong> {transaction.sourceBank}
            </p>
            <p>
              <strong>Destination Bank:</strong> {transaction.destinationBank}
            </p>
          </div>
          <div>
            <p>
              <strong>Fraud Indicator:</strong> {transaction.fraudIndicator}
            </p>
            <p>
              <strong>Risk Score:</strong> {transaction.riskScore.toFixed(2)}
            </p>
            <p>
              <strong>Alert Triggered:</strong>{' '}
              {transaction.alertTriggered ? 'Yes' : 'No'}
            </p>
            <p>
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
