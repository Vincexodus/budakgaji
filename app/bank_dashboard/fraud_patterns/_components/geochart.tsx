'use client';

import React, { useState } from 'react';
import { Chart } from 'react-google-charts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

// Market data with coordinates and metrics
// Market data with coordinates and metrics
interface MarketData {
  name: string;
  lat: number;
  long: number;
  transactions: number;
  revenue: number;
  riskLevel: 'High' | 'Medium' | 'Low';
}

const marketData: MarketData[] = [
  {
    name: 'Kuala Lumpur City Center',
    lat: 3.1478,
    long: 101.6953,
    transactions: 1500,
    revenue: 250000,
    riskLevel: 'Medium'
  },
  {
    name: 'Penang Georgetown',
    lat: 5.4141,
    long: 100.3288,
    transactions: 800,
    revenue: 150000,
    riskLevel: 'Low'
  },
  {
    name: 'Johor Bahru Central',
    lat: 1.4927,
    long: 103.7414,
    transactions: 1200,
    revenue: 200000,
    riskLevel: 'High'
  },
  {
    name: 'Kuching Waterfront',
    lat: 1.5574,
    long: 110.3446,
    transactions: 600,
    revenue: 100000,
    riskLevel: 'Medium'
  },
  {
    name: 'Kota Kinabalu Center',
    lat: 5.9804,
    long: 116.0735,
    transactions: 500,
    revenue: 80000,
    riskLevel: 'Low'
  }
];

const GeoChart = () => {
  const [checked, setChecked] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<MarketData | null>(null);

  // Prepare chart data with only Lat, Long, and Name
  const chartData = [
    ['Lat', 'Long', 'Name'],
    ...marketData.map((market) => [market.lat, market.long, market.name])
  ];

  // Handle marker customization in the options
  function getRiskColor(riskLevel: 'High' | 'Medium' | 'Low'): string {
    switch (riskLevel) {
      case 'High':
        return '#ef4444'; // red
      case 'Medium':
        return '#f59e0b'; // yellow
      case 'Low':
        return '#22c55e'; // green
    }
  }

  const chartOptions = {
    region: 'MY',
    displayMode: 'markers',
    resolution: 'provinces',
    backgroundColor: '#2e2e2e', // Dark background for the chart
    datalessRegionColor: '#444444', // Darker color for regions without data
    defaultColor: '#ffffff', // Light color for default regions
    legend: 'none',
    tooltip: {
      isHtml: true,
      trigger: 'focus',
      textStyle: {
        color: 'black' // White text for tooltips
      }
    },
    domain: 'MY',
    keepAspectRatio: true,
    magnifyingGlass: { enable: true, zoomFactor: 5 },
    markerOpacity: 0.8,
    sizeAxis: { minSize: 5, maxSize: 20 },
    colorAxis: { colors: ['#22c55e', '#f59e0b', '#ef4444'] }, // High to Low risk level
    chartArea: {
      left: 0,
      top: 0,
      width: '100%',
      height: '100%'
    },
    // Set all text to white
    fontName: 'Arial',
    fontSize: 12,
    textStyle: {
      color: 'white' // White text for all chart text
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Malaysia Market Distribution</CardTitle>
        <CardDescription>
          Interactive map showing market locations and risk levels
        </CardDescription>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              checked={checked}
              onCheckedChange={setChecked}
              id="show-markets"
            />
            <Label htmlFor="show-markets">Show All Markets</Label>
          </div>
          <div className="flex gap-2">
            <Badge variant="destructive">High Risk</Badge>
            <Badge variant="destructive">Medium Risk</Badge>
            <Badge variant="default">Low Risk</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] w-full">
          <Chart
            chartType="GeoChart"
            width="100%"
            height="100%"
            data={chartData}
            options={chartOptions}
            // Add event listeners to handle marker clicks
            chartEvents={[
              {
                eventName: 'select',
                callback: ({ chartWrapper }: any) => {
                  const selectedItem = chartWrapper
                    .getChart()
                    .getSelection()[0];
                  if (selectedItem) {
                    const market = marketData[selectedItem.row];
                    setSelectedMarket(market);
                  }
                }
              }
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GeoChart;
