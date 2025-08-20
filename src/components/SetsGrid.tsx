'use client';

import { SimpleGrid, Text, Stack, Center } from '@mantine/core';
import { SetCard, SetCardSkeleton } from './SetCard';
import { useSets } from '@/hooks/useSets';
import { IconBoxMultiple } from '@tabler/icons-react';
import { SetWithStoredData } from '@/types/lego';

interface SetsGridProps {
  searchQuery?: string;
  sortBy?: 'date' | 'name' | 'year' | 'setNumber';
  sortOrder?: 'asc' | 'desc';
}

export function SetsGrid({ searchQuery = '', sortBy = 'date', sortOrder = 'desc' }: SetsGridProps) {
  const { data: sets = [], isLoading, error } = useSets();

  // Filter and sort sets
  const filteredAndSortedSets = sets
    .filter((set: SetWithStoredData) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        set.name?.toLowerCase().includes(query) ||
        set.setNumber.toLowerCase().includes(query) ||
        set.set_num?.toLowerCase().includes(query)
      );
    })
    .sort((a: SetWithStoredData, b: SetWithStoredData) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'year':
          aValue = a.year || 0;
          bValue = b.year || 0;
          break;
        case 'setNumber':
          aValue = a.setNumber || '';
          bValue = b.setNumber || '';
          break;
        default: // 'date'
          aValue = new Date(a.dateAdded).getTime();
          bValue = new Date(b.dateAdded).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  if (isLoading) {
    return (
      <Center py="xl">
        <Stack align="center" gap="md">
          <Text c="dimmed" ta="center">
            Loading your LEGO collection...
          </Text>
          <SimpleGrid
            cols={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
            spacing="md"
            verticalSpacing="md"
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <SetCardSkeleton key={index} />
            ))}
          </SimpleGrid>
        </Stack>
      </Center>
    );
  }

  if (error) {
    return (
      <Center py="xl">
        <Stack align="center" gap="md">
          <IconBoxMultiple size={48} className="text-gray-400" />
          <Text c="dimmed" ta="center">
            Failed to load your LEGO collection.
            <br />
            Please try refreshing the page.
          </Text>
        </Stack>
      </Center>
    );
  }

  if (filteredAndSortedSets.length === 0) {
    return (
      <Center py="xl">
        <Stack align="center" gap="md">
          <IconBoxMultiple size={48} className="text-gray-400" />
          <Text c="dimmed" ta="center">
            {searchQuery 
              ? `No sets found matching "${searchQuery}"`
              : "No LEGO sets in your collection yet. Add your first set to get started!"
            }
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <SimpleGrid
      cols={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
      spacing="md"
      verticalSpacing="md"
    >
      {filteredAndSortedSets.map((set) => (
        <SetCard key={set.id} set={set} />
      ))}
    </SimpleGrid>
  );
}