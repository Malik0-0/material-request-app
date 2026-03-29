'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CreateMaterialDetailPayload,
  CreateRequestPayload,
} from '@/types/request';
import { createRequest } from '@/lib/api';
import {
  EMPTY_MATERIAL_LINE,
  normalizeMaterialsForApi,
} from '@/lib/material-line';
import styles from './request-form.module.css';

export default function RequestForm() {
  const router = useRouter();
  const [requestDate, setRequestDate] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [materials, setMaterials] = useState<CreateMaterialDetailPayload[]>([
    { ...EMPTY_MATERIAL_LINE },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [validationError, setValidationError] = useState('');

  const addMaterial = () => {
    setMaterials((prev) => [...prev, { ...EMPTY_MATERIAL_LINE }]);
  };

  const removeMaterial = (index: number) => {
    setMaterials((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  const updateMaterial = (
    index: number,
    field: keyof CreateMaterialDetailPayload,
    value: string | number | undefined,
  ) => {
    setMaterials((prev) =>
      prev.map((item, itemIndex) => {
        if (itemIndex !== index) return item;
        return { ...item, [field]: value };
      }),
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!requestDate.trim()) {
      setValidationError('Request date is required.');
      return;
    }

    if (!requesterName.trim()) {
      setValidationError('Requester name is required.');
      return;
    }

    const hasInvalidMaterial = materials.some(
      (material) =>
        !material.material_description.trim() ||
        !material.unit.trim() ||
        !Number.isInteger(material.quantity) ||
        material.quantity <= 0,
    );

    if (hasInvalidMaterial) {
      setValidationError(
        'Each material needs description, unit, and quantity greater than 0.',
      );
      return;
    }

    const normalizedLines = normalizeMaterialsForApi(materials);

    try {
      setIsSubmitting(true);
      setSubmitError('');
      setValidationError('');

      const payload: CreateRequestPayload = {
        request_date: requestDate,
        requester_name: requesterName.trim(),
        materials: normalizedLines,
      };
      await createRequest(payload);

      router.push('/');
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : 'Failed to save request. Please try again.';
      setSubmitError(message.length > 400 ? `${message.slice(0, 400)}…` : message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Create Material Request</h1>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="request_date">Request Date</label>
          <input
            id="request_date"
            type="date"
            value={requestDate}
            onChange={(event) => setRequestDate(event.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="requester_name">Requester Name</label>
          <input
            id="requester_name"
            type="text"
            value={requesterName}
            onChange={(event) => setRequesterName(event.target.value)}
            required
          />
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Material Details</h2>

      {materials.map((material, index) => (
        <div className={styles.materialCard} key={`material-${index}`}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor={`description-${index}`}>Description</label>
              <input
                id={`description-${index}`}
                type="text"
                value={material.material_description}
                onChange={(event) =>
                  updateMaterial(index, 'material_description', event.target.value)
                }
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={`quantity-${index}`}>Quantity</label>
              <input
                id={`quantity-${index}`}
                type="number"
                min={1}
                value={material.quantity}
                onChange={(event) =>
                  updateMaterial(index, 'quantity', Number(event.target.value))
                }
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor={`unit-${index}`}>Unit</label>
              <input
                id={`unit-${index}`}
                type="text"
                value={material.unit}
                onChange={(event) => updateMaterial(index, 'unit', event.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={`price-${index}`}>Price</label>
              <input
                id={`price-${index}`}
                type="number"
                min={0}
                value={material.price ?? ''}
                onChange={(event) =>
                  updateMaterial(
                    index,
                    'price',
                    event.target.value === '' ? undefined : Number(event.target.value),
                  )
                }
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor={`notes-${index}`}>Notes</label>
            <input
              id={`notes-${index}`}
              type="text"
              value={material.notes ?? ''}
              onChange={(event) => updateMaterial(index, 'notes', event.target.value)}
            />
          </div>

          <div className={styles.materialActions}>
            <button
              className={styles.button}
              type="button"
              onClick={() => removeMaterial(index)}
              disabled={isSubmitting}
            >
              Remove Item
            </button>
          </div>
        </div>
      ))}

      <div className={styles.actions}>
        <div className={styles.actionsLeft}>
          <button
            className={styles.button}
            type="button"
            onClick={addMaterial}
            disabled={isSubmitting}
          >
            Add Item
          </button>
        </div>
        <div className={styles.actionsRight}>
          <button
            className={`${styles.button} ${styles.buttonBack}`}
            type="button"
            onClick={() => router.push('/')}
            disabled={isSubmitting}
          >
            Back
          </button>
          <button
            className={`${styles.button} ${styles.buttonSave}`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {validationError && <p className={styles.validationText}>{validationError}</p>}
      {submitError && <p className={styles.errorText}>{submitError}</p>}
    </form>
  );
}
