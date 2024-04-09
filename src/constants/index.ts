import { TMonthNumericValue } from "../types/generic";

export const MONTHS_IN_YEAR: Record<string, TMonthNumericValue> = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
};

export const DEFAULT_PAGE_SIZE_4_REPORTS = 100;

export const NOTIFICATION_SETTINGS_UNIQUE_ID_IN_DB = "notification_settings";

// dont edit as this will cos bugs
export const PERMISSION_LABELS = [
  "MANAGE INVENTORY ITEMS",
  "MANAGE USERS",
  "MANAGE CREDIT LIMITS",
  "MANAGE PAYMENT TERMS",
  "MANAGE SUPPLIERS",
  "MANAGE SETTINGS",
  "MANAGE INVENTORY SUPPLY",
  "MANAGE INVENTORY CONSUMPTION",
  "VIEW AUDIT REPORTS",
  "CREATE REPORTS",
  "VIEW REPORT ANALYTICS",
  "MANAGE INVENTORY CONDITIONS",
  "MANAGE MEASUREMENT UNITS",
];
