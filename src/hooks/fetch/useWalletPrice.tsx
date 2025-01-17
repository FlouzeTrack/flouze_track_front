import { useState, useEffect } from "react";
import { API } from "@/services/api";
import { FormattedCryptoPrice } from "@/types/cryptoPrice.types";

interface WalletPriceParams {
  startDate: string;
  endDate: string;
}

interface WalletPriceOptions {
  enabled?: boolean;
}
interface WalletPriceResult {
  data: FormattedCryptoPrice[];
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  refetch: () => Promise<void>;
}

export const DEFAULT_WALLET_ID = "0xd0b08671eC13B451823aD9bC5401ce908872e7c5";

export const useWalletPrice = (
  walletId: string = DEFAULT_WALLET_ID,
  params: WalletPriceParams,
  options: WalletPriceOptions = {}
): WalletPriceResult => {
  const [data, setData] = useState<FormattedCryptoPrice[]>([]);
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

      const response = await API.get<FormattedCryptoPrice[]>(
        `/wallet/${walletId}/prices?${urlParams.toString()}`
      );

      setData(response.data);
      setError(null);
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Failed to fetch wallet prices:", err);
      setError(err.message || "Failed to fetch wallet prices");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
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
