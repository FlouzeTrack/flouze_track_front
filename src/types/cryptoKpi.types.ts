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
