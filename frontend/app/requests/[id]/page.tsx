'use client';

import { RequestDetailView } from '@/components/requests/detail/request-detail-view';
import {
  RequestErrorBanner,
  RequestLoading,
  RequestNotFound,
} from '@/components/requests/shared/request-page-shell';
import { useRequestById } from '@/hooks/use-request-by-id';

export default function RequestDetailPage() {
  const { request, isLoading, error, requestId } = useRequestById();

  if (isLoading) return <RequestLoading />;
  if (error) return <RequestErrorBanner message={error} />;
  if (!request || !Number.isFinite(requestId)) return <RequestNotFound />;

  return <RequestDetailView request={request} />;
}
