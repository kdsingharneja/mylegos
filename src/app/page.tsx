'use client';

import { useState } from 'react';
import { Container } from '@mantine/core';
import { AppHeader } from '@/components/AppHeader';
import dynamic from 'next/dynamic';
import { useSets } from '@/hooks/useSets';

// Dynamically import SetsGrid to prevent hydration issues
const SetsGrid = dynamic(() => import('@/components/SetsGrid').then(mod => ({ default: mod.SetsGrid })), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center py-16">
      <div className="text-gray-500">Loading your LEGO collection...</div>
    </div>
  )
});

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'year' | 'setNumber'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data: sets = [] } = useSets();

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        totalSets={sets.length}
      />

      <Container size="xl" py="xl">
        <SetsGrid
          searchQuery={searchQuery}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      </Container>
    </div>
  );
}