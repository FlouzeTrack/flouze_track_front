import API from "@/services/api";
import { Transaction } from "@/types/transactionsData";
import { format } from "date-fns";
import { useEffect, useState, useCallback, useRef } from "react";

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface TransactionsListResult {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTransactionsList = (
  walletId: string,
  dateRange: DateRange
): TransactionsListResult => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);

  const fetchData = useCallback(async () => {
    if (!walletId) return;

    try {
      setIsLoading(true);
      setError(null);

      const formattedStartDate = format(dateRange.startDate, "yyyy-MM-dd");
      const formattedEndDate = format(dateRange.endDate, "yyyy-MM-dd");

      const response = await API.get(
        `/wallet/${walletId}/?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      );

      if (isMounted.current) {
        setTransactions(response.data.transactions);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
      if (isMounted.current) {
        setError("Failed to fetch data");
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [walletId, dateRange]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, walletId, dateRange]);

  return { transactions, isLoading, error, refetch: fetchData };
};
