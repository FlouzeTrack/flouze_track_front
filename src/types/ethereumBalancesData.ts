export interface BalanceHistoryItem {
  date: string;
  value: string;
}

export interface BalanceHistoryResponse {
  history: BalanceHistoryItem[];
}

export interface FormattedBalance {
  date: string;
  timestamp: number;
  eth: number;
}
