import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SetWithStoredData } from '@/types/lego';
import { WebSearchResult } from '@/services/legoSearchService';

const SETS_QUERY_KEY = ['sets'];

export function useSets() {
  return useQuery({
    queryKey: SETS_QUERY_KEY,
    queryFn: async (): Promise<SetWithStoredData[]> => {
      const response = await fetch('/api/sets');
      if (!response.ok) {
        throw new Error('Failed to fetch sets');
      }
      return response.json();
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    gcTime: 24 * 60 * 60 * 1000, // 24 hours in milliseconds (formerly cacheTime)
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on component mount if data is fresh
  });
}

export function useAddSet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (setNumber: string): Promise<SetWithStoredData> => {
      const response = await fetch('/api/sets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ setNumber }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add set');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETS_QUERY_KEY });
    },
  });
}

export function useDeleteSet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (setId: number): Promise<void> => {
      const response = await fetch(`/api/sets/${setId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete set');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETS_QUERY_KEY });
    },
  });
}

export function useValidateSet() {
  return useMutation({
    mutationFn: async (setNumber: string) => {
      const response = await fetch('/api/sets/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ setNumber }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to validate set');
      }
      
      return response.json();
    },
  });
}

export function useConfirmWebSearchSet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (webSearchData: WebSearchResult): Promise<SetWithStoredData> => {
      const response = await fetch('/api/sets/web-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          setNumber: webSearchData.set_num.replace('-1', ''),
          name: webSearchData.name,
          year: webSearchData.year,
          num_parts: webSearchData.num_parts,
          theme: webSearchData.theme,
          set_img_url: webSearchData.set_img_url,
          confidence: webSearchData.confidence,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save web search result');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETS_QUERY_KEY });
    },
  });
}