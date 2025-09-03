'use client';

import { useState } from 'react';
import { Container } from '@mantine/core';
import { AppHeader } from '@/components/AppHeader';
import dynamic from 'next/dynamic';
import { useSets } from '@/hooks/useSets';
import { useEditMode } from '@/hooks/useEditMode';

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
  const isEditMode = useEditMode();

  return (
    <div className="min-h-screen page-background">
      <AppHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        totalSets={sets.length}
        isEditMode={isEditMode}
      />

      <Container size="xl" py="xl" className="page-background">
        <SetsGrid
          searchQuery={searchQuery}
          sortBy={sortBy}
          sortOrder={sortOrder}
          isEditMode={isEditMode}
        />
      </Container>
    </div>
  );
}