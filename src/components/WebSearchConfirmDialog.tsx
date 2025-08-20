'use client';

import { Modal, Button, Text, Group, Stack, Badge, Image, Alert } from '@mantine/core';
import { IconSearch, IconAlertTriangle, IconBoxMultiple, IconCalendar } from '@tabler/icons-react';
import { WebSearchResult } from '@/services/legoSearchService';

interface WebSearchConfirmDialogProps {
  isOpen: boolean;
  searchResult: WebSearchResult | null;
  onConfirm: (result: WebSearchResult) => void;
  onReject: () => void;
  onManualEntry: () => void;
}

export function WebSearchConfirmDialog({ 
  isOpen, 
  searchResult, 
  onConfirm, 
  onReject,
  onManualEntry 
}: WebSearchConfirmDialogProps) {
  if (!searchResult) return null;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'green';
    if (confidence >= 70) return 'yellow';
    return 'orange';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 85) return 'High Confidence';
    if (confidence >= 70) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onReject}
      title={
        <Group gap="xs">
          <IconSearch size={20} />
          <Text fw={600}>Set Found via Web Search</Text>
        </Group>
      }
      size="md"
      centered
    >
      <Stack gap="md">
        <Alert
          icon={<IconAlertTriangle size={16} />}
          color={getConfidenceColor(searchResult.confidence)}
          title="Information from Web Search"
        >
          This data was automatically extracted from web search results. Please verify the details before adding to your collection.
        </Alert>

        <div className="search-result-preview border rounded-lg p-4 bg-gray-50">
          <Group gap="md" align="flex-start">
            <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center">
              {searchResult.set_img_url ? (
                <Image
                  src={searchResult.set_img_url}
                  alt={searchResult.name}
                  fit="contain"
                  className="w-full h-full"
                />
              ) : (
                <IconBoxMultiple size={32} className="text-gray-400" />
              )}
            </div>

            <div className="flex-1">
              <Text fw={600} size="lg" lineClamp={2}>
                {searchResult.name}
              </Text>
              
              <Text size="sm" c="dimmed" mt={4}>
                Set #{searchResult.set_num.replace('-1', '')}
              </Text>

              <Group gap="xs" mt="sm">
                {searchResult.year > 0 && (
                  <Badge
                    variant="light"
                    color="blue"
                    size="sm"
                    leftSection={<IconCalendar size={12} />}
                  >
                    {searchResult.year}
                  </Badge>
                )}
                {searchResult.num_parts > 0 && (
                  <Badge
                    variant="light"
                    color="green"
                    size="sm"
                    leftSection={<IconBoxMultiple size={12} />}
                  >
                    {searchResult.num_parts} pieces
                  </Badge>
                )}
                {searchResult.theme && (
                  <Badge variant="light" color="violet" size="sm">
                    {searchResult.theme}
                  </Badge>
                )}
              </Group>

              <Group gap="xs" mt="sm">
                <Badge
                  variant="filled"
                  color={getConfidenceColor(searchResult.confidence)}
                  size="sm"
                >
                  {getConfidenceLabel(searchResult.confidence)} ({searchResult.confidence}%)
                </Badge>
              </Group>
            </div>
          </Group>
        </div>

        <Group justify="space-between" mt="md">
          <Button
            variant="subtle"
            color="gray"
            onClick={onManualEntry}
          >
            Enter Manually
          </Button>

          <Group gap="xs">
            <Button
              variant="light"
              color="red"
              onClick={onReject}
            >
              Cancel
            </Button>
            <Button
              variant="filled"
              color="green"
              onClick={() => onConfirm(searchResult)}
            >
              Add This Set
            </Button>
          </Group>
        </Group>
      </Stack>
    </Modal>
  );
}