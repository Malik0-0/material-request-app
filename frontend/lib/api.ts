import {
  CreateMaterialDetailPayload,
  CreateRequestPayload,
  MaterialDetail,
  MaterialRequest,
  UpdateParentRequestPayload,
} from '../types/request';

type ApiResponse<T> = {
  message: string;
  data: T;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Request failed');
  }

  return response.json() as Promise<T>;
}

export async function getRequests(params?: {
  search?: string;
  date_from?: string;
  date_to?: string;
}) {
  const query = new URLSearchParams();

  if (params?.search) query.set('search', params.search);
  if (params?.date_from) query.set('date_from', params.date_from);
  if (params?.date_to) query.set('date_to', params.date_to);

  const queryString = query.toString();
  const path = queryString ? `/requests?${queryString}` : '/requests';

  return apiFetch<ApiResponse<MaterialRequest[]>>(path);
}

export async function getRequestById(id: number) {
  return apiFetch<ApiResponse<MaterialRequest>>(`/requests/${id}`);
}

export async function createRequest(payload: CreateRequestPayload) {
  return apiFetch<ApiResponse<MaterialRequest>>('/requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateRequest(
  id: number,
  payload: UpdateParentRequestPayload,
) {
  return apiFetch<ApiResponse<MaterialRequest>>(`/requests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function createMaterialDetail(
  requestId: number,
  payload: CreateMaterialDetailPayload,
) {
  return apiFetch<ApiResponse<MaterialDetail>>(
    `/requests/${requestId}/details`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
}

export async function updateMaterialDetail(
  requestId: number,
  detailId: number,
  payload: CreateMaterialDetailPayload,
) {
  return apiFetch<ApiResponse<MaterialDetail>>(
    `/requests/${requestId}/details/${detailId}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
  );
}

export async function deleteMaterialDetail(
  requestId: number,
  detailId: number,
) {
  return apiFetch<ApiResponse<null>>(
    `/requests/${requestId}/details/${detailId}`,
    {
      method: 'DELETE',
    },
  );
}

export async function deleteRequest(id: number) {
  return apiFetch<ApiResponse<null>>(`/requests/${id}`, {
    method: 'DELETE',
  });
}
