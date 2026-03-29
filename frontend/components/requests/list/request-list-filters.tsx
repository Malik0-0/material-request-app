import { type FormEvent } from 'react';
import styles from './request-list-filters.module.css';

type Props = {
  search: string;
  dateFrom: string;
  dateTo: string;
  onSearchChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
  isLoading: boolean;
};

export function RequestListFilters({
  search,
  dateFrom,
  dateTo,
  onSearchChange,
  onDateFromChange,
  onDateToChange,
  onApply,
  onClear,
  isLoading,
}: Props) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onApply();
  };

  return (
    <form
      className={styles.filterBar}
      onSubmit={handleSubmit}
      role="search"
      aria-label="Filter material requests"
    >
      <div className={styles.filterBarGrid}>
        <div className={styles.filterField}>
          <label htmlFor="filter-search">Search requester</label>
          <input
            id="filter-search"
            type="search"
            placeholder="Name contains…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className={styles.filterField}>
          <label htmlFor="filter-date-from">From date</label>
          <input
            id="filter-date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
          />
        </div>
        <div className={styles.filterField}>
          <label htmlFor="filter-date-to">To date</label>
          <input
            id="filter-date-to"
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
          />
        </div>
        <div className={styles.filterActions}>
          <button
            className={styles.applyButton}
            type="submit"
            disabled={isLoading}
          >
            Apply
          </button>
          <button
            className={styles.clearButton}
            type="button"
            onClick={onClear}
            disabled={isLoading}
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
}
