import { useState, useEffect } from "react";
import { API } from "@/services/api";
import { FormattedCryptoPrice } from "@/types/cryptoPrice.types";
import { WalletPriceResponse } from "@/types/ethereumWalletPricesData";

interface WalletPriceParams {
  startDate: string;
  endDate: string;
}

interface WalletPriceOptions {
  enabled?: boolean;
}
interface WalletPriceResult {
  data: WalletPriceResponse | null;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  refetch: () => Promise<void>;
}

export const useWalletPrice = (
  walletId: string,
  params: WalletPriceParams,
  options: WalletPriceOptions = {}
): WalletPriceResult => {
  const [data, setData] = useState<WalletPriceResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    setIsSuccess(false);
  }, [walletId, params.startDate, params.endDate]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setIsSuccess(false);

      const urlParams = new URLSearchParams();
      urlParams.append("startDate", params.startDate);
      urlParams.append("endDate", params.endDate);

      const response = await API.get<WalletPriceResponse>(
        `/wallet/${walletId}/prices?${urlParams.toString()}`
      );

      setData(response.data);
      setError(null);
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Failed to fetch wallet prices:", err);
      setError(err.message || "Failed to fetch wallet prices");
      setData(null);
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
