import { formatPrice } from '@/lib/format';
import { MaterialDetail } from '@/types/request';
import shared from '@/styles/shared-tables.module.css';
import styles from '@/app/requests/[id]/page.module.css';

type Props = {
  rows: MaterialDetail[];
};

export function MaterialDetailsReadonlyTable({ rows }: Props) {
  return (
    <div className={shared.tableWrapper}>
      <table className={shared.table}>
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Price</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className={styles.noItems}>
                No line items yet.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className={shared.tableRowHover}>
                <td>{row.material_description}</td>
                <td>{row.quantity}</td>
                <td>{row.unit}</td>
                <td>{formatPrice(row.price)}</td>
                <td>{row.notes?.trim() ? row.notes : '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
