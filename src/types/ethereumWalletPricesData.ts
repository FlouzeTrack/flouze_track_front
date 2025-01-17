export interface BalanceHistoryWithPriceItem {
  date: string;
  balance: string;
  price: string;
  valueUsd: string;
}

export interface WalletPriceResponse {
  currentBalance: string;
  currentValueUsd: string;
  history: BalanceHistoryWithPriceItem[];
}