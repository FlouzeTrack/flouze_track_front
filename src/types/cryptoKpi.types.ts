export interface CryptoKpiParams {
  startDate: string;
  endDate: string;
  currency?: string;
}

export interface CryptoKpi {
  currentPrice: number;
  priceChange: number;
  highestPeriodPrice: number;
  highestPeriodPriceTimestamp: number;
  lowestPeriodPrice: number;
  lowestPeriodPriceTimestamp: number;
}

export interface CryptoKpiResult {
  kpiData: CryptoKpi | undefined;
  isKpiLoading: boolean;
  kpiError: string | null;
  refetch: () => Promise<void>;
}
