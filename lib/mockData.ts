import { faker } from '@faker-js/faker';

export interface Transaction {
  id: string;
  timestamp: string;
  amount: number;
  sourceBank: string;
  destinationBank: string;
  fraudIndicator: 'clean' | 'suspicious' | 'likely fraud';
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

export function generateMockTransaction(): Transaction {
  return {
    id: faker.string.uuid(),
    timestamp: faker.date.recent().toISOString(),
    amount: parseFloat(faker.finance.amount()),
    sourceBank: faker.helpers.arrayElement(bankNames),
    destinationBank: faker.helpers.arrayElement(bankNames),
    fraudIndicator: faker.helpers.arrayElement([
      'clean',
      'suspicious',
      'likely fraud'
    ]),
    riskScore: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
    alertTriggered: faker.datatype.boolean(),
    systemProcessingTime: faker.number.int({ min: 50, max: 500 })
  };
}

export function generateMockTransactions(count: number): Transaction[] {
  return Array.from({ length: count }, generateMockTransaction);
}
