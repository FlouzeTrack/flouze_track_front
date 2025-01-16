import { useState, useEffect } from "react";
import { API } from "@/services/api";
import {
  CryptoPriceApiType,
  FormattedCryptoPrice,
} from "@/types/cryptoPrice.types";

interface CryptoPriceParams {
  startDate: string;
  endDate: string;
  currency?: string;
}

interface CryptoPriceResult {
  data: FormattedCryptoPrice[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCryptoPrice = (
  params: CryptoPriceParams
): CryptoPriceResult => {
  const [data, setData] = useState<FormattedCryptoPrice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const urlParams = new URLSearchParams();
      urlParams.append("currency", params.currency || "ETH");
      urlParams.append("startDate", params.startDate);
      urlParams.append("endDate", params.endDate);

      const response = await API.get<CryptoPriceApiType[]>(
        `/prices?${urlParams.toString()}`
      );

      const formattedData: FormattedCryptoPrice[] = response.data.map(
        (item) => ({
          time: item.timestamp,
          high: Math.floor(item.high * 100) / 100,
          low: Math.floor(item.low * 100) / 100,
          open: Math.floor(item.open * 100) / 100,
          close: Math.floor(item.close * 100) / 100,
          // high: item.high,
          // low: item.low,
          // open: item.open,
          // close: item.close,
        })
      );

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
  }, [params?.currency, params.startDate, params.endDate]);

  return { data, isLoading, error, refetch: fetchData };
};
