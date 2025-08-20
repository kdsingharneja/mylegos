'use client';

import { useState } from 'react';
import {
  Container,
  Group,
  Text,
  TextInput,
  Button,
  Select,
  ActionIcon,
  Stack,
  Flex,
} from '@mantine/core';
import { IconSearch, IconPlus, IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import { AddSetModal } from './AddSetModal';

interface AppHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: 'date' | 'name' | 'year' | 'setNumber';
  onSortByChange: (sortBy: 'date' | 'name' | 'year' | 'setNumber') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  totalSets: number;
}

export function AppHeader({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  totalSets,
}: AppHeaderProps) {
  const [addModalOpened, setAddModalOpened] = useState(false);

  const sortOptions = [
    { value: 'date', label: 'Date Added' },
    { value: 'name', label: 'Set Name' },
    { value: 'year', label: 'Year' },
    { value: 'setNumber', label: 'Set Number' },
  ];

  return (
    <>
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <Container size="xl" py="md">
          <Stack gap="md">
            {/* Title and Add Button */}
            <Group justify="space-between" align="center">
              <div>
                <Text 
                  size="xl" 
                  fw={700} 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-lego-red-5 to-lego-blue-5"
                >
                  My Lego Collection
                </Text>
                <Text size="sm" c="dimmed">
                  {totalSets} {totalSets === 1 ? 'set' : 'sets'} in your collection
                </Text>
              </div>
              
              <Button
                leftSection={<IconPlus size={16} />}
                onClick={() => setAddModalOpened(true)}
                color="lego-red"
                variant="filled"
              >
                Add Set
              </Button>
            </Group>

            {/* Search and Sort Controls */}
            <Flex
              gap="md"
              direction={{ base: 'column', sm: 'row' }}
              align={{ base: 'stretch', sm: 'flex-end' }}
            >
              <TextInput
                placeholder="Search by set number or name..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(event) => onSearchChange(event.currentTarget.value)}
                className="flex-1"
                size="sm"
              />
              
              <Group gap="xs" wrap="nowrap">
                <Select
                  placeholder="Sort by"
                  data={sortOptions}
                  value={sortBy}
                  onChange={(value) => onSortByChange(value as typeof sortBy)}
                  size="sm"
                  w={120}
                />
                
                <ActionIcon
                  variant="light"
                  size="sm"
                  onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
                  title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                >
                  {sortOrder === 'asc' ? (
                    <IconSortAscending size={16} />
                  ) : (
                    <IconSortDescending size={16} />
                  )}
                </ActionIcon>
              </Group>
            </Flex>
          </Stack>
        </Container>
      </div>

      <AddSetModal
        opened={addModalOpened}
        onClose={() => setAddModalOpened(false)}
      />
    </>
  );
}