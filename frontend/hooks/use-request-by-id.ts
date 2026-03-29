import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getRequestById } from '@/lib/api';
import { MaterialRequest } from '@/types/request';

export function useRequestById() {
  const params = useParams<{ id: string }>();
  const requestId = params?.id ? Number(params.id) : NaN;

  const [request, setRequest] = useState<MaterialRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      if (!params?.id || !Number.isFinite(requestId)) return;

      try {
        setIsLoading(true);
        setError('');
        const result = await getRequestById(requestId);
        setRequest(result.data);
      } catch {
        setError('Failed to load request.');
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [params?.id, requestId]);

  return { request, isLoading, error, requestId };
}
