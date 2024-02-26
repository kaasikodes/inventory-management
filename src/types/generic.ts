export type TFileType =
  | "text/csv"
  | "application/vnd.ms-excel"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  | "image/jpeg"
  | "image/jpg"
  | "image/png"
  | "image/PNG"
  | "image/webp";

export type TPaginationQuery = Partial<{
  lastItemIndex: string;
  pageSize: number;
}>;
export type TSearchQuery = {
  search?: string;
};

export type TPaginationData<T> = {
  result: T[];
  lastItemIndex: string;
  total: number;
  hasNextPage: boolean;
};

export type TMonthNumericValue =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12;
