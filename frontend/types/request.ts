export type MaterialDetail = {
  id: number;
  request_id: number;
  material_description: string;
  quantity: number;
  unit: string;
  price: number | null;
  notes: string | null;
  created_at: string;
};

export type MaterialRequest = {
  id: number;
  request_date: string;
  requester_name: string;
  status: string;
  created_at: string;
  updated_at: string | null;
  material_details: MaterialDetail[];
};

export type CreateMaterialDetailPayload = {
  material_description: string;
  quantity: number;
  unit: string;
  price?: number;
  notes?: string;
};

export type CreateRequestPayload = {
  request_date: string;
  requester_name: string;
  materials: CreateMaterialDetailPayload[];
};

export const REQUEST_STATUS_OPTIONS = [
  'pending',
  'approved',
  'rejected',
] as const;

export type RequestStatusOption = (typeof REQUEST_STATUS_OPTIONS)[number];

export type UpdateParentRequestPayload = {
  request_date?: string;
  requester_name?: string;
  status?: RequestStatusOption;
};
