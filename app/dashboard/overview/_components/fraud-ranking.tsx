import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface FraudData {
  bank: string;
  occurrences: number;
  fraudTypes: string[];
}

const fraudData: FraudData[] = [
  { bank: 'Maybank', occurrences: 120, fraudTypes: ['Phishing', 'Card Fraud'] },
  { bank: 'CIMB', occurrences: 95, fraudTypes: ['Identity Theft'] },
  {
    bank: 'Public',
    occurrences: 80,
    fraudTypes: ['Account Takeover', 'Other']
  },
  { bank: 'RHB', occurrences: 75, fraudTypes: ['Phishing'] },
  {
    bank: 'Hong Leong',
    occurrences: 60,
    fraudTypes: ['Card Fraud', 'Identity Theft']
  },
  { bank: 'AmBank', occurrences: 55, fraudTypes: ['Account Takeover'] },
  { bank: 'UOB', occurrences: 50, fraudTypes: ['Phishing', 'Other'] },
  { bank: 'Bank Rakyat', occurrences: 45, fraudTypes: ['Card Fraud'] }
  // { bank: 'OCBC', occurrences: 40, fraudTypes: ['Identity Theft', 'Account Takeover'] },
  // { bank: 'HSBC', occurrences: 35, fraudTypes: ['Phishing', 'Card Fraud'] },
];

const fraudTypeColors: { [key: string]: string } = {
  Phishing: 'bg-blue-200 text-blue-800',
  'Card Fraud': 'bg-red-200 text-red-800',
  'Identity Theft': 'bg-yellow-200 text-yellow-800',
  'Account Takeover': 'bg-green-200 text-green-800',
  Other: 'bg-gray-200 text-gray-800'
};

export function FraudRankingTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fraudulent Activities by Bank (November 2024)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>

              <TableHead>Bank</TableHead>
              <TableHead>Occurrences</TableHead>
              <TableHead>Fraud Types</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fraudData.map((data, index) => (
              <TableRow key={data.bank}>
                <TableCell>{index + 1}</TableCell>

                <TableCell>{data.bank}</TableCell>
                <TableCell>{data.occurrences}</TableCell>
                <TableCell>
                  {data.fraudTypes.map((type: string) => (
                    <Badge
                      key={type}
                      className={`mr-2 ${fraudTypeColors[type]}`}
                    >
                      {type}
                    </Badge>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
