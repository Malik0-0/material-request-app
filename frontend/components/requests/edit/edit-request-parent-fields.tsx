import { REQUEST_STATUS_OPTIONS, RequestStatusOption } from '@/types/request';
import styles from '@/app/requests/[id]/page.module.css';

type Props = {
  requestDate: string;
  requesterName: string;
  status: RequestStatusOption;
  message: string | null;
  onDateChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onStatusChange: (value: RequestStatusOption) => void;
};

export function EditRequestParentFields({
  requestDate,
  requesterName,
  status,
  message,
  onDateChange,
  onNameChange,
  onStatusChange,
}: Props) {
  return (
    <>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionHeading}>Request</h2>
      </div>
      <div className={styles.editBlock}>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label htmlFor="parent-date">Request date</label>
            <input
              id="parent-date"
              type="date"
              value={requestDate}
              onChange={(e) => onDateChange(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="parent-name">Requester</label>
            <input
              id="parent-name"
              type="text"
              value={requesterName}
              onChange={(e) => onNameChange(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label htmlFor="parent-status">Status</label>
            <select
              id="parent-status"
              value={status}
              onChange={(e) =>
                onStatusChange(e.target.value as RequestStatusOption)
              }
            >
              {REQUEST_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
        {message ? <p className={styles.inlineError}>{message}</p> : null}
      </div>
    </>
  );
}
