'use client';

import { EditRequestContent } from '@/components/requests/edit/edit-request-content';
import {
  RequestErrorBanner,
  RequestLoading,
  RequestNotFound,
} from '@/components/requests/shared/request-page-shell';
import { useEditMaterialRequest } from '@/hooks/use-edit-material-request';

export default function EditRequestPage() {
  const e = useEditMaterialRequest();

  if (e.isLoading) return <RequestLoading />;
  if (e.error) return <RequestErrorBanner message={e.error} />;
  if (!e.request || !Number.isFinite(e.requestId)) return <RequestNotFound />;

  return <EditRequestContent e={e} request={e.request} />;
}
