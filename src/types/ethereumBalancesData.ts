export interface BalanceHistoryResponse {
  history: Array<{
    timestamp: number;
    value: string;
  }>;
}

export interface FormattedBalance {
  timestamp: number;
  eth: number;
}
