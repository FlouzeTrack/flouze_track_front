// src/hooks/fetch/useWalletBalance.tsx
import { useState, useEffect } from "react";
import { API } from "@/services/api";
import {
  BalanceHistoryResponse,
  FormattedBalance,
} from "@/types/ethereumBalancesData";
import { EthereumMapper } from "@/mappers/ethereumMapper";

interface WalletBalanceParams {
  startDate?: string;
  endDate?: string;
}

export const useWalletBalance = (
  walletId: string,
  params?: WalletBalanceParams
) => {
  const [data, setData] = useState<FormattedBalance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  if(!params) {
    return null;
  }
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const urlParams = new URLSearchParams();
      if (params?.startDate) urlParams.append("startDate", params.startDate);
      if (params?.endDate) urlParams.append("endDate", params.endDate);

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
    } catch (err: any) {
      console.error("Failed to fetch data:", err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [walletId, params?.startDate, params?.endDate]);

  return { data, isLoading, error, refetch: fetchData };
};
