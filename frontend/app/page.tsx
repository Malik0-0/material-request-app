'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { RequestListFilters } from '@/components/requests/list/request-list-filters';
import {
  buildRequestListParams,
  type RequestListFilterState,
} from '@/lib/request-list-query';
import { deleteRequest, getRequests } from '../lib/api';
import { MaterialRequest } from '../types/request';
import shared from '@/styles/shared-tables.module.css';
import styles from './page.module.css';

export default function HomePage() {
  const router = useRouter();
  const [requests, setRequests] = useState<MaterialRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const loadRequests = useCallback(async (f: RequestListFilterState) => {
    try {
      setIsLoading(true);
      setError('');
      const result = await getRequests(buildRequestListParams(f));
      setRequests(result.data);
    } catch {
      setError('Failed to load requests. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests({ search: '', dateFrom: '', dateTo: '' });
  }, [loadRequests]);

  const handleApplyFilters = () => {
    loadRequests({ search, dateFrom, dateTo });
  };

  const handleClearFilters = () => {
    setSearch('');
    setDateFrom('');
    setDateTo('');
    loadRequests({ search: '', dateFrom: '', dateTo: '' });
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Delete this request?');
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteRequest(id);
      await loadRequests({ search, dateFrom, dateTo });
    } catch {
      setError('Failed to delete request. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Material Requests</h1>
          <Link className={styles.createLink} href="/requests/new">
            Create Request
          </Link>
        </div>

        <RequestListFilters
          search={search}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onSearchChange={setSearch}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          isLoading={isLoading}
        />

        {isLoading && <p className={styles.infoText}>Loading requests...</p>}

        {!isLoading && error && <p className={styles.errorText}>{error}</p>}

        {!isLoading && !error && requests.length === 0 && (
          <p className={styles.infoText}>No requests found.</p>
        )}

        {!isLoading && !error && requests.length > 0 && (
          <div className={shared.tableWrapper}>
            <table className={shared.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Request Date</th>
                  <th>Requester Name</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr
                    key={request.id}
                    className={`${shared.tableRowHover} ${styles.clickableRow}`}
                    onClick={() => router.push(`/requests/${request.id}`)}
                  >
                    <td>{request.id}</td>
                    <td>{request.request_date}</td>
                    <td>{request.requester_name}</td>
                    <td>{request.status}</td>
                    <td
                      className={shared.actionsCell}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Link
                        className={shared.actionBtn}
                        href={`/requests/${request.id}/edit`}
                      >
                        Edit
                      </Link>
                      <button
                        className={shared.dangerBtn}
                        type="button"
                        onClick={() => handleDelete(request.id)}
                        disabled={deletingId === request.id}
                      >
                        {deletingId === request.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
