// src/hooks/fetch/useCryptoPrice.tsx
import { useState, useEffect } from "react";
import { API } from "@/services/api";
import { CryptoPrice, CryptoPriceResponse } from "@/types/cryptoPrice.types";

interface CryptoPriceParams {
  currency: string;
  startDate?: string;
  endDate?: string;
}

export const useCryptoPrice = (params?: CryptoPriceParams) => {
  const [data, setData] = useState<CryptoPrice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  if (!params) {
    return null;
  }

  console.log("USECRYPTOPRICE");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const urlParams = new URLSearchParams();
      urlParams.append("currency", params.currency || "ETH");
      if (params?.startDate) urlParams.append("startDate", params.startDate);
      if (params?.endDate) urlParams.append("endDate", params.endDate);
      console.log("PARAMS", params);

      const response = await API.get<CryptoPriceResponse>(
        `/prices?${urlParams.toString()}`
      );

      const formattedData: CryptoPrice[] = response.data.prices.map((item) => ({
        time: item.timestamp,
        high: item.high,
        low: item.low,
        open: item.open,
        close: item.close,
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
    console.log("FETCHING DATA");

    fetchData();
  }, []);

  return { data, isLoading, error, refetch: fetchData };
};
