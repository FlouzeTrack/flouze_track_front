export interface Transaction {
  hash: string;
  symbol: string;
  value: string;
  date: string;
  from: string;
  to: string;
  gasUsed: string;
  gasPrice: string;
}

export interface FormatAddressProps {
  address: string;
}

export interface CalculateFeesProps {
  gasUsed: string;
  gasPrice: string;
}
