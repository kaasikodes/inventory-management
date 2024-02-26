export type TImportInventoryItem = {
  name: string;
  description: string;
  input: number;
  output: number;
  measurementUnit: string;
  minStockThreshold: number;
  growthPeriodInSecs: number;
};
