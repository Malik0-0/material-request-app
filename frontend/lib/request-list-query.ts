export type RequestListFilterState = {
  search: string;
  dateFrom: string;
  dateTo: string;
};

export function buildRequestListParams(f: RequestListFilterState) {
  const params: {
    search?: string;
    date_from?: string;
    date_to?: string;
  } = {};
  if (f.search.trim()) {
    params.search = f.search.trim();
  }
  if (f.dateFrom) {
    params.date_from = f.dateFrom;
  }
  if (f.dateTo) {
    params.date_to = f.dateTo;
  }
  return Object.keys(params).length ? params : undefined;
}
