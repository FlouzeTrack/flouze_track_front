import { useState, useEffect } from "react";
import { API } from "@/services/api";
import { CryptoKpi, CryptoKpiParams, CryptoKpiResult } from "@/types/cryptoKpi.types";

export const useCryptoKpi = (params: CryptoKpiParams): CryptoKpiResult => {
  const [kpiData, setKpiData] = useState<CryptoKpi>();
  const [isKpiLoading, setIsKpiLoading] = useState<boolean>(true);
  const [kpiError, setKpiError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsKpiLoading(true);
      const urlParams = new URLSearchParams();
      urlParams.append("currency", params.currency || "ETH");
      urlParams.append("startDate", params.startDate);
      urlParams.append("endDate", params.endDate);

      const response = await API.get<CryptoKpi>(
        `/prices/kpis?${urlParams.toString()}`
      );

      setKpiData(response.data);
      setKpiError(null);
    } catch (err: any) {
      console.error("Failed to fetch data:", err);
      setKpiError(err.message || "Failed to fetch data");
    } finally {
      setIsKpiLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params?.currency, params.startDate, params.endDate]);

  return { kpiData, isKpiLoading, kpiError, refetch: fetchData };
};
