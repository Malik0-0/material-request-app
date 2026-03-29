import type {
  CreateMaterialDetailPayload,
  MaterialDetail,
} from '../types/request';

export const EMPTY_MATERIAL_LINE: CreateMaterialDetailPayload = {
  material_description: '',
  quantity: 1,
  unit: '',
  price: undefined,
  notes: '',
};

export function materialDetailToPayload(
  row: MaterialDetail,
): CreateMaterialDetailPayload {
  return {
    material_description: row.material_description,
    quantity:
      typeof row.quantity === 'string'
        ? Number.parseInt(row.quantity, 10)
        : row.quantity,
    unit: row.unit,
    price:
      row.price === null || row.price === undefined
        ? undefined
        : typeof row.price === 'string'
          ? Number(row.price)
          : row.price,
    notes: row.notes ?? undefined,
  };
}

export function normalizeMaterialLineForApi(
  payload: CreateMaterialDetailPayload,
): CreateMaterialDetailPayload {
  const qty = Math.floor(Number(payload.quantity));
  const line: CreateMaterialDetailPayload = {
    material_description: payload.material_description.trim(),
    quantity: Number.isFinite(qty) && qty >= 1 ? qty : 1,
    unit: payload.unit.trim(),
  };
  if (payload.price !== undefined && payload.price !== null) {
    const p =
      typeof payload.price === 'string' ? Number(payload.price) : payload.price;
    if (Number.isFinite(p)) {
      line.price = p;
    }
  }
  const notes = payload.notes?.trim();
  if (notes) {
    line.notes = notes;
  }
  return line;
}

export function normalizeMaterialsForApi(
  materials: CreateMaterialDetailPayload[],
): CreateMaterialDetailPayload[] {
  return materials.map((m) => normalizeMaterialLineForApi(m));
}
