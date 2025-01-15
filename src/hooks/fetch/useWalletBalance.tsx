import { useState, useEffect } from "react";
import { API } from "@/services/api";
import { BalanceHistoryResponse, FormattedBalance } from "@/types/ethereumBalancesData";
import { EthereumMapper } from "@/mappers/ethereumMapper";

export const useWalletBalance = (walletId: string) => {
  const [data, setData] = useState<FormattedBalance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await API.get<BalanceHistoryResponse>(
          `/wallet/${walletId}/balances`
        );

        const formattedData = response.data.history.map((item) => ({
          timestamp: item.timestamp,
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

    fetchData();
  }, [walletId]);

  return { data, isLoading, error };
};
