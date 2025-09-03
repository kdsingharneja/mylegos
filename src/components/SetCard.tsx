'use client';

import { Card, Image, Text, Badge, Group, ActionIcon, Stack, Skeleton } from '@mantine/core';
import { IconTrash, IconCalendar, IconBoxMultiple, IconSearch, IconWorldWww } from '@tabler/icons-react';
import { SetWithStoredData } from '@/types/lego';
import { useDeleteSet } from '@/hooks/useSets';
import { notifications } from '@mantine/notifications';

interface SetCardProps {
  set: SetWithStoredData;
  isEditMode?: boolean;
}

export function SetCard({ set, isEditMode = false }: SetCardProps) {
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
      className="card-background card-hover min-h-96 flex flex-col"
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
              className="text-lg leading-tight card-title" 
              lineClamp={2}
            >
              {set.name}
            </Text>
          </div>
          {isEditMode && (
            <ActionIcon
              variant="subtle"
              onClick={handleDelete}
              loading={deleteSet.isPending}
              size="sm"
              className="card-delete-icon hover:bg-red-100"
            >
              <IconTrash size={16} />
            </ActionIcon>
          )}
        </Group>

        {/* Set number with web search pill */}
        <Group gap="xs" align="center" className="mb-3">
          <Text 
            size="sm" 
            className="card-set-number"
          >
            Set #{set.set_num || set.setNumber}
          </Text>
          {set.source === 'web_search' && (
            <Badge 
              variant="filled" 
              size="xs" 
              leftSection={<IconSearch size={10} />}
              className="card-web-search-badge"
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
              className="card-year-badge"
            >
              {set.year}
            </Badge>
          )}
          {set.num_parts > 0 && (
            <Text 
              size="sm" 
              className="card-pieces-text"
            >
              {set.num_parts} pieces
            </Text>
          )}
        </Group>

        {/* Footer at bottom */}
        <div className="mt-auto">
          <Text size="xs" className="card-date-text">
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
      className="min-h-96 flex flex-col card-background"
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