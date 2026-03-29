import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  createMaterialDetail,
  deleteMaterialDetail,
  getRequestById,
  updateMaterialDetail,
  updateRequest,
} from '@/lib/api';
import {
  EMPTY_MATERIAL_LINE,
  materialDetailToPayload,
  normalizeMaterialLineForApi,
} from '@/lib/material-line';
import {
  CreateMaterialDetailPayload,
  MaterialDetail,
  MaterialRequest,
  REQUEST_STATUS_OPTIONS,
  RequestStatusOption,
} from '@/types/request';

export function useEditMaterialRequest() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const requestId = params?.id ? Number(params.id) : NaN;

  const [request, setRequest] = useState<MaterialRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [parentDate, setParentDate] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentStatus, setParentStatus] =
    useState<RequestStatusOption>('pending');
  const [savingParent, setSavingParent] = useState(false);
  const [parentMessage, setParentMessage] = useState('');

  const [editingDetailId, setEditingDetailId] = useState<number | null>(null);
  const [lineDraft, setLineDraft] = useState<CreateMaterialDetailPayload>(
    EMPTY_MATERIAL_LINE,
  );
  const [savingDetailId, setSavingDetailId] = useState<number | null>(null);
  const [deletingDetailId, setDeletingDetailId] = useState<number | null>(null);
  const [detailMessage, setDetailMessage] = useState('');

  const [addingLine, setAddingLine] = useState(false);
  const [newLine, setNewLine] = useState<CreateMaterialDetailPayload>(
    EMPTY_MATERIAL_LINE,
  );
  const [savingNewLine, setSavingNewLine] = useState(false);

  const reload = useCallback(async () => {
    if (!Number.isFinite(requestId)) return;
    const result = await getRequestById(requestId);
    setRequest(result.data);
    setParentDate(result.data.request_date);
    setParentName(result.data.requester_name);
    setParentStatus(normalizeStatus(result.data.status));
  }, [requestId]);

  useEffect(() => {
    const run = async () => {
      if (!params?.id || !Number.isFinite(requestId)) return;

      try {
        setIsLoading(true);
        setError('');
        const result = await getRequestById(requestId);
        setRequest(result.data);
        setParentDate(result.data.request_date);
        setParentName(result.data.requester_name);
        setParentStatus(normalizeStatus(result.data.status));
      } catch {
        setError('Failed to load request.');
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [params?.id, requestId]);

  const saveParent = async () => {
    if (!request || !parentDate.trim() || !parentName.trim()) {
      setParentMessage('Request date and requester name are required.');
      return;
    }
    try {
      setSavingParent(true);
      setParentMessage('');
      await updateRequest(request.id, {
        request_date: parentDate,
        requester_name: parentName.trim(),
        status: parentStatus,
      });
      await reload();
      router.push(`/requests/${request.id}`);
    } catch {
      setParentMessage('Failed to save. Please try again.');
    } finally {
      setSavingParent(false);
    }
  };

  const cancelEditLine = useCallback(() => {
    setEditingDetailId(null);
    setLineDraft(EMPTY_MATERIAL_LINE);
    setDetailMessage('');
  }, []);

  const startEditLine = (row: MaterialDetail) => {
    setDetailMessage('');
    setEditingDetailId(row.id);
    setLineDraft(materialDetailToPayload(row));
  };

  const saveLine = async (detailId: number) => {
    const normalized = normalizeMaterialLineForApi(lineDraft);
    if (
      !normalized.material_description ||
      !normalized.unit ||
      normalized.quantity < 1
    ) {
      setDetailMessage(
        'Each line needs description, unit, and quantity at least 1.',
      );
      return;
    }
    try {
      setSavingDetailId(detailId);
      setDetailMessage('');
      await updateMaterialDetail(requestId, detailId, normalized);
      await reload();
      cancelEditLine();
    } catch {
      setDetailMessage('Failed to save line. Please try again.');
    } finally {
      setSavingDetailId(null);
    }
  };

  const removeLine = async (detailId: number) => {
    const ok = window.confirm('Delete this material line?');
    if (!ok) return;
    try {
      setDeletingDetailId(detailId);
      setDetailMessage('');
      await deleteMaterialDetail(requestId, detailId);
      if (editingDetailId === detailId) {
        cancelEditLine();
      }
      await reload();
    } catch {
      setDetailMessage('Failed to delete line. Please try again.');
    } finally {
      setDeletingDetailId(null);
    }
  };

  const saveNewLine = async () => {
    const normalized = normalizeMaterialLineForApi(newLine);
    if (
      !normalized.material_description ||
      !normalized.unit ||
      normalized.quantity < 1
    ) {
      setDetailMessage(
        'Each line needs description, unit, and quantity at least 1.',
      );
      return;
    }
    try {
      setSavingNewLine(true);
      setDetailMessage('');
      await createMaterialDetail(requestId, normalized);
      setNewLine(EMPTY_MATERIAL_LINE);
      setAddingLine(false);
      await reload();
    } catch {
      setDetailMessage('Failed to add line. Please try again.');
    } finally {
      setSavingNewLine(false);
    }
  };

  const cancelNewLine = () => {
    setAddingLine(false);
    setNewLine(EMPTY_MATERIAL_LINE);
    setDetailMessage('');
  };

  const startAddLine = () => {
    setDetailMessage('');
    setNewLine(EMPTY_MATERIAL_LINE);
    setAddingLine(true);
  };

  return {
    request,
    isLoading,
    error,
    requestId,
    parentDate,
    setParentDate,
    parentName,
    setParentName,
    parentStatus,
    setParentStatus,
    savingParent,
    parentMessage,
    saveParent,
    editingDetailId,
    lineDraft,
    setLineDraft,
    savingDetailId,
    deletingDetailId,
    detailMessage,
    addingLine,
    newLine,
    setNewLine,
    savingNewLine,
    startEditLine,
    cancelEditLine,
    saveLine,
    removeLine,
    saveNewLine,
    cancelNewLine,
    startAddLine,
  };
}

export type EditMaterialRequestState = ReturnType<typeof useEditMaterialRequest>;

function normalizeStatus(value: string): RequestStatusOption {
  return REQUEST_STATUS_OPTIONS.includes(value as RequestStatusOption)
    ? (value as RequestStatusOption)
    : 'pending';
}
