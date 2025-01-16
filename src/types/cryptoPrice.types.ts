export interface CryptoPriceApiType {
  created_at: Date;
  updated_at: Date;
  timestamp: number;
  high: number;
  low: number;
  open: number;
  close: number;
}

export interface FormattedCryptoPrice {
  time: number;
  high: number;
  low: number;
  open: number;
  close: number;
}
