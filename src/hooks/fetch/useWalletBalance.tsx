import { useState, useEffect } from "react";
import { API } from "@/services/api";
import {
  BalanceHistoryResponse,
  FormattedBalance,
} from "@/types/ethereumBalancesData";
import { EthereumMapper } from "@/mappers/ethereumMapper";

interface WalletBalanceParams {
  startDate: string;
  endDate: string;
}

interface WalletBalanceOptions {
  enabled?: boolean;
}

interface WalletBalanceResult {
  data: FormattedBalance[];
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  refetch: () => Promise<void>;
}

export const useWalletBalance = (
  walletId: string,
  params: WalletBalanceParams,
  options: WalletBalanceOptions = {}
): WalletBalanceResult => {
  const [data, setData] = useState<FormattedBalance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setIsSuccess(false);

      const urlParams = new URLSearchParams();
      urlParams.append("startDate", params.startDate);
      urlParams.append("endDate", params.endDate);

      const response = await API.get<BalanceHistoryResponse>(
        `/wallet/${walletId}/balances?${urlParams.toString()}`
      );

      const formattedData = response.data.history.map((item) => ({
        date: item.date,
        timestamp: EthereumMapper.getTimestamp(item.date),
        eth: EthereumMapper.weiToEth(item.value),
      }));

      setData(formattedData);
      setError(null);
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Failed to fetch data:", err);
      setError(err.message || "Failed to fetch data");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (options.enabled === false) {
      setIsLoading(false);
      return;
    }
    fetchData();
  }, [walletId, params.startDate, params.endDate, options.enabled]);

  return { data, isLoading, error, isSuccess, refetch: fetchData };
};
