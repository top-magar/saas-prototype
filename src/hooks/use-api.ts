import useSWR from 'swr';
import api from '@/lib/api';

// Validate URL to prevent SSRF attacks
const validateUrl = (url: string): boolean => {
  // Only allow relative paths starting with /
  if (!url.startsWith('/')) return false;
  // Prevent protocol schemes
  if (url.includes('://')) return false;
  // Prevent path traversal
  if (url.includes('../') || url.includes('..\\')) return false;
  return true;
};

const fetcher = (url: string) => {
  if (!validateUrl(url)) {
    throw new Error('Invalid URL path');
  }
  return api.get(url).then(res => res.data);
};

export function useApi(path: string | null) {
  const { data, error, mutate } = useSWR(path, fetcher);

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
