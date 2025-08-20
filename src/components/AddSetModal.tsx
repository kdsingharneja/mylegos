'use client';

import { useState } from 'react';
import {
  Modal,
  TextInput,
  Button,
  Stack,
  Text,
  Group,
  Image,
  Card,
  Badge,
  Alert,
  Center,
  Loader
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconSearch, IconAlertCircle, IconBoxMultiple, IconCalendar } from '@tabler/icons-react';
import { useValidateSet, useAddSet } from '@/hooks/useSets';
import { notifications } from '@mantine/notifications';
import { LegoSet } from '@/types/lego';

interface AddSetModalProps {
  opened: boolean;
  onClose: () => void;
}

export function AddSetModal({ opened, onClose }: AddSetModalProps) {
  const [validatedSet, setValidatedSet] = useState<LegoSet | null>(null);
  const [validationStep, setValidationStep] = useState<'input' | 'preview'>('input');
  
  const validateSet = useValidateSet();
  const addSet = useAddSet();

  const form = useForm({
    initialValues: {
      setNumber: '',
    },
    validate: {
      setNumber: (value: string) => 
        value.trim().length === 0 ? 'Set number is required' : null,
    },
  });

  const handleValidate = async (values: { setNumber: string }) => {
    try {
      const result = await validateSet.mutateAsync(values.setNumber.trim());
      
      if (result.valid && result.setData) {
        setValidatedSet(result.setData);
        setValidationStep('preview');
      } else {
        notifications.show({
          title: 'Set Not Found',
          message: result.error || 'This LEGO set number was not found',
          color: 'red',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Validation Error',
        message: error instanceof Error ? error.message : 'Failed to validate set',
        color: 'red',
      });
    }
  };

  const handleConfirmAdd = async () => {
    if (!validatedSet) return;

    try {
      await addSet.mutateAsync(form.values.setNumber.trim());
      
      notifications.show({
        title: 'Set Added!',
        message: `${validatedSet.name} has been added to your collection`,
        color: 'green',
      });

      handleClose();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to add set',
        color: 'red',
      });
    }
  };

  const handleClose = () => {
    form.reset();
    setValidatedSet(null);
    setValidationStep('input');
    onClose();
  };

  const handleBack = () => {
    setValidatedSet(null);
    setValidationStep('input');
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Text fw={600} size="lg">
          Add LEGO Set to Collection
        </Text>
      }
      size="md"
      centered
    >
      {validationStep === 'input' && (
        <form onSubmit={form.onSubmit(handleValidate)}>
          <Stack gap="md">
            <TextInput
              label="LEGO Set Number"
              placeholder="e.g. 21034, 75192, 10280"
              description="Enter the set number found on the box or in official documentation"
              leftSection={<IconSearch size={16} />}
              {...form.getInputProps('setNumber')}
              data-autofocus
            />

            {validateSet.isError && (
              <Alert 
                icon={<IconAlertCircle size={16} />} 
                color="red"
                variant="light"
              >
                {validateSet.error instanceof Error 
                  ? validateSet.error.message 
                  : 'Failed to validate set'
                }
              </Alert>
            )}

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                loading={validateSet.isPending}
                leftSection={validateSet.isPending ? <Loader size={16} /> : <IconSearch size={16} />}
              >
                Validate Set
              </Button>
            </Group>
          </Stack>
        </form>
      )}

      {validationStep === 'preview' && validatedSet && (
        <Stack gap="md">
          <Alert color="green" variant="light">
            Set found! Please confirm the details below before adding to your collection.
          </Alert>

          <Card withBorder>
            <Group gap="md" align="flex-start">
              <div className="w-24 h-24 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                {validatedSet.set_img_url ? (
                  <Image
                    src={validatedSet.set_img_url}
                    alt={validatedSet.name}
                    fit="contain"
                    width={96}
                    height={96}
                  />
                ) : (
                  <IconBoxMultiple size={32} className="text-gray-400" />
                )}
              </div>

              <Stack gap="xs" className="flex-1 min-w-0">
                <Text fw={500} size="lg" lineClamp={2}>
                  {validatedSet.name}
                </Text>
                <Text size="sm" c="dimmed">
                  Set #{validatedSet.set_num}
                </Text>
                
                <Group gap="xs">
                  {validatedSet.year > 0 && (
                    <Badge variant="light" color="lego-blue" size="sm" leftSection={<IconCalendar size={12} />}>
                      {validatedSet.year}
                    </Badge>
                  )}
                  {validatedSet.num_parts > 0 && (
                    <Badge variant="light" color="lego-yellow" size="sm" leftSection={<IconBoxMultiple size={12} />}>
                      {validatedSet.num_parts} pieces
                    </Badge>
                  )}
                </Group>
              </Stack>
            </Group>
          </Card>

          <Group justify="space-between" mt="md">
            <Button variant="subtle" onClick={handleBack}>
              Back
            </Button>
            <Button 
              onClick={handleConfirmAdd}
              loading={addSet.isPending}
              color="lego-red"
            >
              Add to Collection
            </Button>
          </Group>
        </Stack>
      )}
    </Modal>
  );
}