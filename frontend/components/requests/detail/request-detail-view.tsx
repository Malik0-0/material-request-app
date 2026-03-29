import Link from 'next/link';
import { MaterialRequest } from '@/types/request';
import styles from '@/app/requests/[id]/page.module.css';
import { MaterialDetailsReadonlyTable } from './material-details-readonly-table';

type Props = {
  request: MaterialRequest;
};

export function RequestDetailView({ request }: Props) {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Material Request #{request.id}</h1>
        <dl className={styles.meta}>
          <div>
            <dt>Request date</dt>
            <dd>{request.request_date}</dd>
          </div>
          <div>
            <dt>Requester</dt>
            <dd>{request.requester_name}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{request.status}</dd>
          </div>
        </dl>

        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionHeading}>Material details</h2>
        </div>
        <MaterialDetailsReadonlyTable rows={request.material_details} />

        <div className={styles.footerActions}>
          <Link className={styles.secondaryBtn} href="/">
            Back
          </Link>
          <Link className={styles.primaryBtn} href={`/requests/${request.id}/edit`}>
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}
