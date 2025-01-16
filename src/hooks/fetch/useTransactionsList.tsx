import { Transaction } from "@/components/charts/TransactionsList";
import API from "@/services/api";
import { useEffect, useState } from "react";

interface TransactionsListResult {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTransactionsList = (
  walletId: string
): TransactionsListResult => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await API.get(`/wallet/${walletId}`);
      console.log(response);
      setTransactions(response.data.transactions);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [walletId]);

  return { transactions, isLoading, error, refetch: fetchData };
};
