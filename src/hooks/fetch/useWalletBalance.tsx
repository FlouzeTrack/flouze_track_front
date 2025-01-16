import { useState, useEffect } from "react";
import { API } from "@/services/api";
import {
  BalanceHistoryResponse,
  FormattedBalance,
} from "@/types/ethereumBalancesData";
import ApiErrorResponse from "@/types/api";
import { EthereumMapper } from "@/mappers/ethereumMapper";

interface WalletBalanceParams {
  startDate: string;
  endDate: string;
}

interface WalletBalanceResult {
  data: FormattedBalance[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useWalletBalance = (
  walletId: string,
  params: WalletBalanceParams
): WalletBalanceResult => {
  const [data, setData] = useState<FormattedBalance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
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
    } catch (err: any) {
      console.error("Failed to fetch data:", err);
      const errorResponse = err.response?.data as ApiErrorResponse;

      const errorMessage = errorResponse
        ? `${errorResponse.error}${
            errorResponse.errors
              ? " - " + errorResponse.errors.map((e) => e.message).join(", ")
              : ""
          }`
        : "Failed to fetch data";

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [walletId, params.startDate, params.endDate]);

  return { data, isLoading, error, refetch: fetchData };
};
