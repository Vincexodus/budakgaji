'use client';

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
const chartData = [
  { month: 'January', phishing: 30, cardFraud: 20, identityTheft: 25, accountTakeover: 15, other: 10 },
  { month: 'February', phishing: 32, cardFraud: 22, identityTheft: 28, accountTakeover: 18, other: 12 },
  { month: 'March', phishing: 35, cardFraud: 27, identityTheft: 30, accountTakeover: 22, other: 15 },
  { month: 'April', phishing: 40, cardFraud: 29, identityTheft: 33, accountTakeover: 25, other: 18 },
  { month: 'May', phishing: 42, cardFraud: 35, identityTheft: 38, accountTakeover: 28, other: 20 },
  { month: 'June', phishing: 50, cardFraud: 40, identityTheft: 45, accountTakeover: 35, other: 25 }
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

export function AreaGraph() {
  return (
    <Card>
      <CardHeader>
      <CardTitle>Fraud Occurrences Over Time</CardTitle>
      <CardDescription>
          November 2024
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[310px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="phishing"
              type="natural"
              fill="hsl(var(--chart-1))"
              fillOpacity={0.4}
              stroke="hsl(var(--chart-1))"
              stackId="a"
            />
            <Area
              dataKey="cardFraud"
              type="natural"
              fill="hsl(var(--chart-2))"
              fillOpacity={0.4}
              stroke="hsl(var(--chart-2))"
              stackId="a"
            />
            <Area
              dataKey="identityTheft"
              type="natural"
              fill="hsl(var(--chart-3))"
              fillOpacity={0.4}
              stroke="hsl(var(--chart-3))"
              stackId="a"
            />
            <Area
              dataKey="accountTakeover"
              type="natural"
              fill="hsl(var(--chart-4))"
              fillOpacity={0.4}
              stroke="hsl(var(--chart-4))"
              stackId="a"
            />
            <Area
              dataKey="other"
              type="natural"
              fill="hsl(var(--chart-5))"
              fillOpacity={0.4}
              stroke="hsl(var(--chart-5))"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Increases by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
