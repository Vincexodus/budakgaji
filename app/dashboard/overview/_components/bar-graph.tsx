'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

export const description = 'Categorizing fraud types within this month';
const chartData = [
  { date: '2024-04-01', phishing: 22, cardFraud: 15, identityTheft: 10, accountTakeover: 5, other: 8 },
  { date: '2024-04-02', phishing: 25, cardFraud: 18, identityTheft: 12, accountTakeover: 7, other: 10 },
  { date: '2024-04-03', phishing: 20, cardFraud: 12, identityTheft: 15, accountTakeover: 10, other: 5 },
  { date: '2024-04-04', phishing: 30, cardFraud: 20, identityTheft: 18, accountTakeover: 12, other: 15 },
  { date: '2024-04-05', phishing: 35, cardFraud: 25, identityTheft: 20, accountTakeover: 15, other: 18 },
  { date: '2024-04-06', phishing: 28, cardFraud: 22, identityTheft: 17, accountTakeover: 10, other: 12 },
  { date: '2024-04-07', phishing: 25, cardFraud: 18, identityTheft: 15, accountTakeover: 8, other: 10 },
  { date: '2024-04-08', phishing: 32, cardFraud: 28, identityTheft: 22, accountTakeover: 18, other: 20 },
  { date: '2024-04-09', phishing: 18, cardFraud: 12, identityTheft: 10, accountTakeover: 5, other: 8 },
  { date: '2024-04-10', phishing: 27, cardFraud: 20, identityTheft: 15, accountTakeover: 10, other: 12 },
  { date: '2024-04-11', phishing: 30, cardFraud: 25, identityTheft: 20, accountTakeover: 15, other: 18 },
  { date: '2024-04-12', phishing: 22, cardFraud: 18, identityTheft: 15, accountTakeover: 10, other: 12 },
  { date: '2024-04-13', phishing: 35, cardFraud: 28, identityTheft: 25, accountTakeover: 20, other: 22 },
  { date: '2024-04-14', phishing: 20, cardFraud: 15, identityTheft: 12, accountTakeover: 8, other: 10 },
  { date: '2024-04-15', phishing: 18, cardFraud: 12, identityTheft: 10, accountTakeover: 5, other: 8 },
  { date: '2024-04-16', phishing: 22, cardFraud: 18, identityTheft: 15, accountTakeover: 10, other: 12 }
];

const chartConfig = {
  phishing: {
    label: 'Phishing',
    color: 'hsl(var(--chart-1))'
  },
  cardFraud: {
    label: 'Card Fraud',
    color: 'hsl(var(--chart-2))'
  },
  identityTheft: {
    label: 'Identity Theft',
    color: 'hsl(var(--chart-3))'
  },
  accountTakeover: {
    label: 'Account Takeover',
    color: 'hsl(var(--chart-4))'
  },
  other: {
    label: 'Other',
    color: 'hsl(var(--chart-5))'
  }
} satisfies ChartConfig;

export function BarGraph() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('phishing');

  const total = React.useMemo(
    () => ({
      phishing: chartData.reduce((acc, curr) => acc + curr.phishing, 0),
      cardFraud: chartData.reduce((acc, curr) => acc + curr.cardFraud, 0),
      identityTheft: chartData.reduce((acc, curr) => acc + curr.identityTheft, 0),
      accountTakeover: chartData.reduce((acc, curr) => acc + curr.accountTakeover, 0),
      other: chartData.reduce((acc, curr) => acc + curr.other, 0)
    }),
    []
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex">
          {['phishing', 'cardFraud', 'identityTheft', 'accountTakeover', 'other'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text- text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-base font-bold leading-none sm:text-xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
