// app/dashboard/banks/page.tsx
'use client';
import React, { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/parsers';
import { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Building, Settings, Brain, Bell } from 'lucide-react';
import BankConfigTab from './_components/bank-config-tab';
import ScoringConfigTab from './_components/scoring-config-tab';
import ModelTuningTab from './_components/model-tuning-tab';
import AlertConfigTab from './_components/alert-config-tab';

type PageProps = {
  searchParams: SearchParams;
};

export default function Page({ searchParams }: PageProps) {
  const [activeBank, setActiveBank] = useState({
    name: 'Example Bank',
    riskThreshold: 75,
    enableML: true,
    autoEscalation: true
  });

  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="container mx-auto space-y-8 p-6">
          <Tabs defaultValue="banks" className="w-full">
            <TabsList className="grid w-full grid-cols-4 gap-4 bg-transparent">
              <TabsTrigger
                value="banks"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <Building className="mr-2 h-4 w-4" />
                Banks
              </TabsTrigger>
              <TabsTrigger
                value="scoring"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <Settings className="mr-2 h-4 w-4" />
                Scoring
              </TabsTrigger>
              <TabsTrigger
                value="model"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <Brain className="mr-2 h-4 w-4" />
                Model
              </TabsTrigger>
              <TabsTrigger
                value="alerts"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <Bell className="mr-2 h-4 w-4" />
                Alerts
              </TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <TabsContent value="banks">
                <BankConfigTab
                  activeBank={activeBank}
                  setActiveBank={setActiveBank}
                />
              </TabsContent>
              <TabsContent value="scoring">
                <ScoringConfigTab
                  activeBank={activeBank}
                  setActiveBank={setActiveBank}
                />
              </TabsContent>
              <TabsContent value="model">
                <ModelTuningTab
                  activeBank={activeBank}
                  setActiveBank={setActiveBank}
                />
              </TabsContent>
              <TabsContent value="alerts">
                <AlertConfigTab
                  activeBank={activeBank}
                  setActiveBank={setActiveBank}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </PageContainer>
  );
}
