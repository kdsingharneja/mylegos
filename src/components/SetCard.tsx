'use client';

import { Card, Image, Text, Badge, Group, ActionIcon, Stack, Skeleton } from '@mantine/core';
import { IconTrash, IconCalendar, IconBoxMultiple, IconSearch, IconWorldWww } from '@tabler/icons-react';
import { SetWithStoredData } from '@/types/lego';
import { useDeleteSet } from '@/hooks/useSets';
import { notifications } from '@mantine/notifications';

interface SetCardProps {
  set: SetWithStoredData;
}

export function SetCard({ set }: SetCardProps) {
  const deleteSet = useDeleteSet();

  const handleDelete = () => {
    deleteSet.mutate(set.id, {
      onSuccess: () => {
        notifications.show({
          title: 'Set Removed',
          message: `${set.name} has been removed from your collection`,
          color: 'green',
        });
      },
      onError: (error) => {
        notifications.show({
          title: 'Error',
          message: error.message,
          color: 'red',
        });
      },
    });
  };

  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder 
      className="hover:shadow-xl hover:scale-[1.02] transition-all duration-200 min-h-96 flex flex-col"
      style={{ 
        backgroundColor: '#1F2937',
        borderColor: '#374151',
        border: '1px solid #374151'
      }}
      styles={{
        root: {
          '&:hover': {
            borderColor: '#60A5FA',
            transform: 'translateY(-2px)'
          }
        }
      }}
    >
      <Card.Section>
        <div className="set-image-container relative w-full h-48 md:h-44 lg:h-56 xl:h-60 overflow-hidden rounded-t-md bg-white">
          {set.set_img_url ? (
            <img
              src={set.set_img_url}
              alt={set.name}
              className="set-image w-full h-full object-cover object-center"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`flex items-center justify-center h-full text-gray-500 ${set.set_img_url ? 'hidden' : ''}`}>
            <IconBoxMultiple size={48} />
          </div>
        </div>
      </Card.Section>

      <div className="flex flex-col h-full mt-4 px-4 pb-4">
        {/* Header with title and delete button */}
        <Group justify="space-between" align="flex-start" className="mb-2">
          <div className="flex-1 min-w-0">
            <Text 
              fw={500} 
              className="text-lg leading-tight" 
              lineClamp={2}
              style={{ color: '#FACC15', height: '3.5rem' }}
            >
              {set.name}
            </Text>
          </div>
          <ActionIcon
            variant="subtle"
            onClick={handleDelete}
            loading={deleteSet.isPending}
            size="sm"
            style={{ color: '#F87171' }}
            className="hover:bg-red-100"
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>

        {/* Set number with web search pill */}
        <Group gap="xs" align="center" className="mb-3">
          <Text 
            size="sm" 
            style={{ color: '#60A5FA' }}
          >
            Set #{set.set_num || set.setNumber}
          </Text>
          {set.source === 'web_search' && (
            <Badge 
              variant="filled" 
              size="xs" 
              leftSection={<IconSearch size={10} />}
              style={{ 
                backgroundColor: '#EC4899',
                color: 'white'
              }}
              title={`Web Search Result (${set.confidence}% confidence)`}
            >
              Web Search
            </Badge>
          )}
        </Group>

        {/* Fixed position metadata - year and pieces */}
        <Group gap="xs" align="center" className="mb-4">
          {set.year > 0 && (
            <Badge 
              variant="filled" 
              size="sm" 
              leftSection={<IconCalendar size={12} />}
              style={{ 
                backgroundColor: '#60A5FA',
                color: 'white'
              }}
            >
              {set.year}
            </Badge>
          )}
          {set.num_parts > 0 && (
            <Text 
              size="sm" 
              style={{ color: '#9CA3AF' }}
            >
              {set.num_parts} pieces
            </Text>
          )}
        </Group>

        {/* Footer at bottom */}
        <div className="mt-auto">
          <Text size="xs" style={{ color: '#6B7280' }}>
            Added {new Date(set.dateAdded).toLocaleDateString()}
          </Text>
        </div>
      </div>
    </Card>
  );
}

export function SetCardSkeleton() {
  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder 
      className="min-h-96 flex flex-col"
      style={{ 
        backgroundColor: '#1F2937',
        borderColor: '#374151',
        border: '1px solid #374151'
      }}
    >
      <Card.Section>
        <div className="set-image-container w-full h-48 md:h-44 lg:h-56 xl:h-60 bg-white">
          <Skeleton className="w-full h-full" />
        </div>
      </Card.Section>
      
      <Stack gap="sm" mt="md" className="flex-1">
        <Group justify="space-between">
          <div className="flex-1">
            <Skeleton height={24} width="80%" />
            <Skeleton height={16} width="60%" mt={4} />
          </div>
          <Skeleton height={24} width={24} />
        </Group>
        
        <Group gap="xs">
          <Skeleton height={20} width={60} />
          <Skeleton height={20} width={80} />
        </Group>
        
        <div className="mt-auto">
          <Skeleton height={14} width="50%" />
        </div>
      </Stack>
    </Card>
  );
}