import Link from 'next/link';
import styles from '@/app/requests/[id]/page.module.css';

export function RequestLoading() {
  return (
    <div className={styles.page}>
      <p className={styles.muted}>Loading...</p>
    </div>
  );
}

export function RequestErrorBanner({ message }: { message: string }) {
  return (
    <div className={styles.page}>
      <p className={styles.error}>{message}</p>
      <Link className={styles.link} href="/">
        Back to list
      </Link>
    </div>
  );
}

export function RequestNotFound() {
  return (
    <div className={styles.page}>
      <p className={styles.muted}>Request not found.</p>
      <Link className={styles.link} href="/">
        Back to list
      </Link>
    </div>
  );
}
