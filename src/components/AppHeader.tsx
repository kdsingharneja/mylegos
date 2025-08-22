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
import Image from 'next/image';

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
      {/* Header with yellow background */}
      <div className="sticky top-0 z-10 relative overflow-hidden header-background max-h-[150px]">
        {/* Background Logo Container */}
        <div className="absolute right-0 top-0 bottom-0 header-logo-background" />
        
        <Container size="xl" px="md" className="relative z-10">
          <div className="flex items-center justify-between py-6 min-h-[150px]">
            {/* Title and Counter on Left */}
            <div className="flex-1 pr-4">
              <Text 
                size="40px" 
                fw={700} 
                className="header-title"
              >
                My Lego Collection
              </Text>
              <Text 
                size="24px" 
                fw={600}
                className="header-counter"
              >
                {totalSets} {totalSets === 1 ? 'set' : 'sets'} in your collection
              </Text>
            </div>
            
            {/* Empty space for logo background */}
            <div className="flex-shrink-0 w-[300px]">
              {/* This space allows the background logo to show */}
            </div>
          </div>
        </Container>
      </div>

      {/* Navigation Bar Below Header */}
      <div className="bg-transparent py-4">
        <Container size="xl">
          <Flex
            gap="md"
            direction={{ base: 'column', sm: 'row' }}
            align={{ base: 'stretch', sm: 'center' }}
            justify="space-between"
          >
            <TextInput
              placeholder="Search by set number or name..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(event) => onSearchChange(event.currentTarget.value)}
              className="flex-1"
              size="md"
              styles={{
                input: {
                  backgroundColor: 'white',
                  border: '1px solid #374151'
                }
              }}
            />
            
            <Group gap="md" wrap="nowrap">
              <Select
                placeholder="Sort by"
                data={sortOptions}
                value={sortBy}
                onChange={(value) => onSortByChange(value as typeof sortBy)}
                size="md"
                w={140}
                styles={{
                  input: {
                    backgroundColor: 'white',
                    border: '1px solid #374151'
                  }
                }}
              />
              
              <ActionIcon
                variant="light"
                size="lg"
                onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
                title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                className="header-nav-input"
              >
                {sortOrder === 'asc' ? (
                  <IconSortAscending size={20} />
                ) : (
                  <IconSortDescending size={20} />
                )}
              </ActionIcon>

              <Button
                leftSection={<IconPlus size={16} />}
                onClick={() => setAddModalOpened(true)}
                color="red"
                variant="filled"
                size="md"
              >
                Add Set
              </Button>
            </Group>
          </Flex>
        </Container>
      </div>

      <AddSetModal
        opened={addModalOpened}
        onClose={() => setAddModalOpened(false)}
      />
    </>
  );
}