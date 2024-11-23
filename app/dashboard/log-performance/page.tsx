'use client';

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
import React, { useState, useEffect, Suspense } from 'react';
import { TransactionView } from './_components/transaction-view';

type pageProps = {
  searchParams: SearchParams;
};

export default function Page({ searchParams }: pageProps) {
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  const key = serialize({ ...searchParams });

  return (
    <PageContainer>
      <Heading
        title="Logs and Performance"
        description="Monitor and manage transactions"
      />
      <Separator />
      <div className="flex items-center justify-between py-4">
        <Link
          href="/dashboard/log-performance/new"
          className={cn(
            buttonVariants({ variant: 'default' }),
            'flex items-center'
          )}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Transaction
        </Link>
      </div>
      <Suspense fallback={<DataTableSkeleton />}>
        <TransactionView />
      </Suspense>
    </PageContainer>
  );
}
