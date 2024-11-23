'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Download } from 'lucide-react';
import PageContainer from '@/components/layout/page-container';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

import MalaysiaGeoChart from './geochart';

// TypeScript interfaces
interface LocationData {
  id: number;
  location: string;
  state: string;
  coordinates: { x: number; y: number };
  riskLevel: 'High' | 'Medium' | 'Low';
  transactions: number;
}

interface PatternCluster {
  id: number;
  pattern: string;
  accounts: number;
  totalAmount: string;
}

interface TimelineData {
  name: string;
  transactions: number;
}

interface FraudIndicator {
  id: number;
  indicator: string;
  occurrences: number;
}

// Mock data
const locationData: LocationData[] = [
  {
    id: 1,
    location: 'Kuala Lumpur',
    state: 'KL',
    coordinates: { x: 400, y: 250 },
    riskLevel: 'High',
    transactions: 150
  },
  {
    id: 2,
    location: 'Johor Bahru',
    state: 'Johor',
    coordinates: { x: 380, y: 400 },
    riskLevel: 'Medium',
    transactions: 100
  },
  {
    id: 3,
    location: 'Penang',
    state: 'Penang',
    coordinates: { x: 320, y: 150 },
    riskLevel: 'Low',
    transactions: 75
  },
  {
    id: 4,
    location: 'Kuching',
    state: 'Sarawak',
    coordinates: { x: 680, y: 280 },
    riskLevel: 'High',
    transactions: 125
  },
  {
    id: 5,
    location: 'Kota Kinabalu',
    state: 'Sabah',
    coordinates: { x: 780, y: 200 },
    riskLevel: 'Medium',
    transactions: 90
  },
  {
    id: 6,
    location: 'Malacca',
    state: 'Malacca',
    coordinates: { x: 380, y: 320 },
    riskLevel: 'High',
    transactions: 115
  },
  {
    id: 7,
    location: 'Ipoh',
    state: 'Perak',
    coordinates: { x: 350, y: 200 },
    riskLevel: 'Medium',
    transactions: 85
  },
  {
    id: 8,
    location: 'Kuantan',
    state: 'Pahang',
    coordinates: { x: 450, y: 250 },
    riskLevel: 'Low',
    transactions: 65
  }
];

const patternClusters: PatternCluster[] = [
  {
    id: 1,
    pattern: 'Rapid small transactions',
    accounts: 25,
    totalAmount: '$50,000'
  },
  {
    id: 2,
    pattern: 'Large international transfers',
    accounts: 10,
    totalAmount: '$500,000'
  },
  {
    id: 3,
    pattern: 'Multiple failed login attempts',
    accounts: 50,
    totalAmount: 'N/A'
  },
  {
    id: 4,
    pattern: 'Unusual cryptocurrency activity',
    accounts: 15,
    totalAmount: '$75,000'
  }
];

const timelineData: TimelineData[] = [
  { name: 'Jan', transactions: 65 },
  { name: 'Feb', transactions: 59 },
  { name: 'Mar', transactions: 80 },
  { name: 'Apr', transactions: 81 },
  { name: 'May', transactions: 56 },
  { name: 'Jun', transactions: 55 },
  { name: 'Jul', transactions: 40 }
];

const commonIndicators: FraudIndicator[] = [
  { id: 1, indicator: 'Repeated IP Address', occurrences: 500 },
  { id: 2, indicator: 'Identical QR Codes', occurrences: 250 },
  { id: 3, indicator: 'Suspicious User Agent', occurrences: 350 },
  { id: 4, indicator: 'Unusual Transaction Times', occurrences: 200 }
];

export const data = [
  ['Country', 'Popularity'],
  ['Germany', 200],
  ['United States', 300],
  ['Brazil', 400],
  ['Canada', 500],
  ['France', 600],
  ['RU', 700]
];

/// Malaysia Map component
function MalaysiaMap({ data }: { data: LocationData[] }) {
  return (
    <TooltipProvider>
      <svg viewBox="0 0 1000 500" className="h-[400px] w-full">
        {/* West Malaysia (Peninsular) */}
        <path
          d="M300 100 
               L450 100 
               L480 150 
               L500 200 
               L480 250 
               L500 300 
               L450 350 
               L400 400 
               L350 450 
               L300 400 
               L280 350 
               L300 300 
               L280 250 
               L300 200 
               L280 150 
               Z"
          fill="#f0f0f0"
          stroke="#d0d0d0"
          strokeWidth="2"
        />

        {/* East Malaysia (Sabah and Sarawak) */}
        <path
          d="M600 150
               L800 150
               L850 200
               L820 250
               L850 300
               L800 350
               L750 300
               L700 350
               L650 300
               L600 350
               L580 300
               L600 250
               L580 200
               Z"
          fill="#f0f0f0"
          stroke="#d0d0d0"
          strokeWidth="2"
        />

        {/* Plot cities as circles */}
        {data.map((city) => (
          <Tooltip key={city.id}>
            <TooltipTrigger>
              <g>
                <circle
                  cx={city.coordinates.x}
                  cy={city.coordinates.y}
                  r={Math.sqrt(city.transactions) / 2}
                  fill={
                    city.riskLevel === 'High'
                      ? '#ef4444'
                      : city.riskLevel === 'Medium'
                      ? '#f59e0b'
                      : '#22c55e'
                  }
                  opacity={0.6}
                  className="transition-all duration-200 hover:opacity-100"
                />
              </g>
            </TooltipTrigger>
            <TooltipContent>
              <div className="p-2">
                <p className="font-semibold">
                  {city.location}, {city.state}
                </p>
                <p className="text-sm">Transactions: {city.transactions}</p>
                <p className="text-sm">Risk Level: {city.riskLevel}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}

        {/* Add text labels for regions */}
        <text x="380" y="80" className="text-sm font-medium" fill="#666">
          Peninsular Malaysia
        </text>
        <text x="700" y="120" className="text-sm font-medium" fill="#666">
          East Malaysia
        </text>
      </svg>
    </TooltipProvider>
  );
}

export default function FraudPatternInsights() {
  const [timeRange, setTimeRange] = useState<string>('7d');

  const handleExport = () => {
    console.log('Exporting fraud pattern insights...');
  };

  return (
    <PageContainer scrollable>
      <div className="container mx-auto space-y-6 py-6">
        <div className="flex items-center justify-between">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Fraud Pattern Insights
          </h1>
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExport} variant="secondary">
              <Download className="mr-2 h-4 w-4" /> Export Report
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Heatmaps */}
          <Card>
            <CardHeader>
              <CardTitle>High-Risk Geolocations</CardTitle>
              <CardDescription>
                Geographic distribution of flagged transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead className="text-right">
                      Flagged Transactions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locationData.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell className="font-medium">
                        {location.location}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                            location.riskLevel === 'High'
                              ? 'bg-red-100 text-red-700'
                              : location.riskLevel === 'Medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {location.riskLevel}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {location.transactions}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pattern Clusters */}
          <Card>
            <CardHeader>
              <CardTitle>Fraud Pattern Clusters</CardTitle>
              <CardDescription>
                Common patterns identified across transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pattern</TableHead>
                    <TableHead className="text-right">
                      Affected Accounts
                    </TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patternClusters.map((cluster) => (
                    <TableRow key={cluster.id}>
                      <TableCell className="font-medium">
                        {cluster.pattern}
                      </TableCell>
                      <TableCell className="text-right">
                        {cluster.accounts}
                      </TableCell>
                      <TableCell className="text-right">
                        {cluster.totalAmount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Map Card */}

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                Geographic Distribution of Flagged Transactions in Malaysia
              </CardTitle>
              <CardDescription>
                Circle size indicates transaction volume, color indicates risk
                level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MalaysiaGeoChart></MalaysiaGeoChart>
            </CardContent>
          </Card>

          {/* Common Indicators */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Common Fraud Indicators</CardTitle>
              <CardDescription>
                Frequently observed suspicious patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Indicator</TableHead>
                    <TableHead className="text-right">Occurrences</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commonIndicators.map((indicator) => (
                    <TableRow key={indicator.id}>
                      <TableCell className="font-medium">
                        {indicator.indicator}
                      </TableCell>
                      <TableCell className="text-right">
                        {indicator.occurrences.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
