'use client';

import type { CreateMaterialDetailPayload } from '@/types/request';

type LineEditCellsProps = {
  idPrefix: string;
  value: CreateMaterialDetailPayload;
  onChange: (v: CreateMaterialDetailPayload) => void;
  disabled: boolean;
  inputClassName: string;
};

export function LineEditCells({
  idPrefix,
  value,
  onChange,
  disabled,
  inputClassName,
}: LineEditCellsProps) {
  const patch = (partial: Partial<CreateMaterialDetailPayload>) => {
    onChange({ ...value, ...partial });
  };

  const pid = (name: string) => `${idPrefix}-${name}`;

  return (
    <>
      <td>
        <input
          id={pid('desc')}
          className={inputClassName}
          type="text"
          value={value.material_description}
          onChange={(e) => patch({ material_description: e.target.value })}
          disabled={disabled}
          aria-label="Description"
        />
      </td>
      <td>
        <input
          id={pid('qty')}
          className={inputClassName}
          type="number"
          min={1}
          value={value.quantity}
          onChange={(e) => patch({ quantity: Number(e.target.value) || 1 })}
          disabled={disabled}
          aria-label="Quantity"
        />
      </td>
      <td>
        <input
          id={pid('unit')}
          className={inputClassName}
          type="text"
          value={value.unit}
          onChange={(e) => patch({ unit: e.target.value })}
          disabled={disabled}
          aria-label="Unit"
        />
      </td>
      <td>
        <input
          id={pid('price')}
          className={inputClassName}
          type="number"
          min={0}
          value={value.price ?? ''}
          onChange={(e) =>
            patch({
              price: e.target.value === '' ? undefined : Number(e.target.value),
            })
          }
          disabled={disabled}
          aria-label="Price"
        />
      </td>
      <td>
        <input
          id={pid('notes')}
          className={inputClassName}
          type="text"
          value={value.notes ?? ''}
          onChange={(e) => patch({ notes: e.target.value })}
          disabled={disabled}
          aria-label="Notes"
        />
      </td>
    </>
  );
}
