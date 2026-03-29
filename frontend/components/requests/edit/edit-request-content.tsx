import Link from 'next/link';
import type { EditMaterialRequestState } from '@/hooks/use-edit-material-request';
import { MaterialRequest } from '@/types/request';
import styles from '@/app/requests/[id]/page.module.css';
import { EditRequestParentFields } from './edit-request-parent-fields';
import { MaterialDetailsEditTable } from './material-details-edit-table';

type Props = {
  e: EditMaterialRequestState;
  request: MaterialRequest;
};

export function EditRequestContent({ e, request }: Props) {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Edit Material Request #{request.id}</h1>

        <EditRequestParentFields
          requestDate={e.parentDate}
          requesterName={e.parentName}
          status={e.parentStatus}
          message={e.parentMessage || null}
          onDateChange={e.setParentDate}
          onNameChange={e.setParentName}
          onStatusChange={e.setParentStatus}
        />

        <MaterialDetailsEditTable
          detailMessage={e.detailMessage}
          rows={request.material_details}
          editingDetailId={e.editingDetailId}
          lineDraft={e.lineDraft}
          onLineDraftChange={e.setLineDraft}
          savingDetailId={e.savingDetailId}
          deletingDetailId={e.deletingDetailId}
          addingLine={e.addingLine}
          newLine={e.newLine}
          onNewLineChange={e.setNewLine}
          savingNewLine={e.savingNewLine}
          onStartEdit={e.startEditLine}
          onCancelEdit={e.cancelEditLine}
          onSaveLine={e.saveLine}
          onRemoveLine={e.removeLine}
          onSaveNewLine={e.saveNewLine}
          onCancelNewLine={e.cancelNewLine}
          onAddLine={e.startAddLine}
        />

        <div className={styles.footerActions}>
          <Link className={styles.secondaryBtn} href={`/requests/${request.id}`}>
            Back
          </Link>
          <button
            type="button"
            className={styles.footerSaveBtn}
            onClick={e.saveParent}
            disabled={e.savingParent}
          >
            {e.savingParent ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
