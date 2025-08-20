'use client';

import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 300 * 1000, // 5 minutes
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        theme={{
          colors: {
            'lego-red': ['#FFE3E3', '#FFCDCD', '#FF9999', '#FF6666', '#FF3333', '#E3000B', '#CC000A', '#B00009', '#990008', '#800007'],
            'lego-blue': ['#E3F4FF', '#B3E1FF', '#80CFFF', '#4DBDFF', '#1AABFF', '#0055BF', '#004DA8', '#004291', '#00377A', '#002C63'],
            'lego-yellow': ['#FFFDF0', '#FFF9D4', '#FFF4B8', '#FFEF9C', '#FFE980', '#FFD700', '#E6C200', '#CCAE00', '#B39900', '#998500'],
          },
          primaryColor: 'lego-red',
        }}
      >
        <ModalsProvider>
          <Notifications />
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}