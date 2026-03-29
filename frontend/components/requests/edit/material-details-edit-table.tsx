import { formatPrice } from '@/lib/format';
import { LineEditCells } from './line-edit-cells';
import {
  CreateMaterialDetailPayload,
  MaterialDetail,
} from '@/types/request';
import shared from '@/styles/shared-tables.module.css';
import styles from '@/app/requests/[id]/page.module.css';

export type MaterialDetailsEditTableProps = {
  detailMessage: string;
  rows: MaterialDetail[];
  editingDetailId: number | null;
  lineDraft: CreateMaterialDetailPayload;
  onLineDraftChange: (v: CreateMaterialDetailPayload) => void;
  savingDetailId: number | null;
  deletingDetailId: number | null;
  addingLine: boolean;
  newLine: CreateMaterialDetailPayload;
  onNewLineChange: (v: CreateMaterialDetailPayload) => void;
  savingNewLine: boolean;
  onStartEdit: (row: MaterialDetail) => void;
  onCancelEdit: () => void;
  onSaveLine: (detailId: number) => void;
  onRemoveLine: (detailId: number) => void;
  onSaveNewLine: () => void;
  onCancelNewLine: () => void;
  onAddLine: () => void;
};

export function MaterialDetailsEditTable({
  detailMessage,
  rows,
  editingDetailId,
  lineDraft,
  onLineDraftChange,
  savingDetailId,
  deletingDetailId,
  addingLine,
  newLine,
  onNewLineChange,
  savingNewLine,
  onStartEdit,
  onCancelEdit,
  onSaveLine,
  onRemoveLine,
  onSaveNewLine,
  onCancelNewLine,
  onAddLine,
}: MaterialDetailsEditTableProps) {
  return (
    <>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionHeading}>Material details</h2>
        {!addingLine && (
          <button
            type="button"
            className={styles.secondaryBtn}
            disabled={editingDetailId !== null}
            onClick={onAddLine}
          >
            Add line
          </button>
        )}
      </div>

      {detailMessage ? (
        <p className={styles.inlineError}>{detailMessage}</p>
      ) : null}

      <div className={shared.tableWrapper}>
        <table className={shared.table}>
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Price</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) =>
              editingDetailId === row.id ? (
                <tr key={row.id} className={styles.tableEditRow}>
                  <LineEditCells
                    idPrefix={`line-${row.id}`}
                    value={lineDraft}
                    onChange={onLineDraftChange}
                    disabled={savingDetailId === row.id}
                    inputClassName={shared.tableInput}
                  />
                  <td className={shared.actionsCell}>
                    <button
                      type="button"
                      className={shared.actionBtn}
                      onClick={onCancelEdit}
                      disabled={savingDetailId === row.id}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={shared.tablePrimaryBtn}
                      onClick={() => onSaveLine(row.id)}
                      disabled={savingDetailId === row.id}
                    >
                      {savingDetailId === row.id ? 'Saving...' : 'Save'}
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={row.id} className={shared.tableRowHover}>
                  <td>{row.material_description}</td>
                  <td>{row.quantity}</td>
                  <td>{row.unit}</td>
                  <td>{formatPrice(row.price)}</td>
                  <td>{row.notes?.trim() ? row.notes : '-'}</td>
                  <td className={shared.actionsCell}>
                    <button
                      type="button"
                      className={shared.actionBtn}
                      onClick={() => onStartEdit(row)}
                      disabled={deletingDetailId === row.id || addingLine}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className={shared.dangerBtn}
                      onClick={() => onRemoveLine(row.id)}
                      disabled={deletingDetailId === row.id || addingLine}
                    >
                      {deletingDetailId === row.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ),
            )}

            {addingLine && (
              <tr className={styles.tableEditRow}>
                <LineEditCells
                  idPrefix="new-line"
                  value={newLine}
                  onChange={onNewLineChange}
                  disabled={savingNewLine}
                  inputClassName={shared.tableInput}
                />
                <td className={shared.actionsCell}>
                  <button
                    type="button"
                    className={shared.actionBtn}
                    onClick={onCancelNewLine}
                    disabled={savingNewLine}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={shared.tablePrimaryBtn}
                    onClick={onSaveNewLine}
                    disabled={savingNewLine}
                  >
                    {savingNewLine ? 'Saving...' : 'Save'}
                  </button>
                </td>
              </tr>
            )}

            {rows.length === 0 && !addingLine && (
              <tr>
                <td colSpan={6} className={styles.noItems}>
                  No line items yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
