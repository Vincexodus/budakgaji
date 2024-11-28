import { faker } from '@faker-js/faker';

export interface Transaction {
  id: string;
  timestamp: string;
  amount: number;
  sourceBank: string;
  destinationBank: string;
  fraudIndicator: 'clean' | 'suspicious' | 'likely fraud';
  fraudType?: string;
  riskScore: number;
  alertTriggered: boolean;
  systemProcessingTime: number;
}

const bankNames = [
  'Maybank',
  'CIMB',
  'Public',
  'RHB',
  'Hong Leong',
  'AmBank',
  'UOB',
  'Bank Rakyat',
  'OCBC',
  'HSBC',
  'Bank Islam',
  'Affin',
  'Alliance',
  'Standard Chartered',
  'MBSB',
  'Citibank',
  'BSN',
  'Bank Muamalat',
  'Agrobank',
  'Al Rajhi Bank',
  'Co-op Bank'
];

const fraudTypes = [
  'Phishing',
  'Card Fraud',
  'Identity Theft',
  'Account Takeover',
  'Other'
];

export function generateMockTransaction(): Transaction {
  const fraudIndicator = faker.helpers.arrayElement([
    'clean',
    'suspicious',
    'likely fraud'
  ]);

  let alertTriggered = false;
  if (fraudIndicator === 'suspicious') {
    alertTriggered = faker.datatype.boolean();
  } else if (fraudIndicator === 'likely fraud') {
    alertTriggered = true;
  }

  const transaction: Transaction = {
    id: faker.string.uuid(),
    timestamp: faker.date.recent().toISOString(),
    amount: parseFloat(faker.finance.amount()),
    sourceBank: faker.helpers.arrayElement(bankNames),
    destinationBank: faker.helpers.arrayElement(bankNames),
    fraudIndicator,
    riskScore: faker.number.float({ min: 0.3, max: 1, fractionDigits: 2 }),
    alertTriggered,
    systemProcessingTime: faker.number.int({ min: 50, max: 500 })
  };

  if (fraudIndicator !== 'clean') {
    transaction.fraudType = faker.helpers.arrayElement(fraudTypes);
  }

  return transaction;
}

export function generateMockTransactions(count: number): Transaction[] {
  return Array.from({ length: count }, generateMockTransaction);
}
