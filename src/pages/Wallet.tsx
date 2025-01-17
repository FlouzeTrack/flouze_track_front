import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useWalletBalance } from "@/hooks/fetch/useWalletBalance";
import { useWalletPrice } from "@/hooks/fetch/useWalletPrice";
import { format } from "date-fns";
import { WalletHeader } from "@/components/wallet/WalletHeader";
import { useDateRange } from "@/providers/DateRangeProvider";
import { WalletPriceSection } from "@/components/wallet/WalletPriceSection";
import { WalletBalanceSection } from "@/components/wallet/WalletBalanceSection";
import API from "@/services/api";
import TransactionsList from "@/components/charts/TransactionsList";

// export const DEFAULT_WALLET_ID = "0xd0b08671eC13B451823aD9bC5401ce908872e7c5";

// const FAVORITE_WALLETS = [
//   { id: DEFAULT_WALLET_ID, name: "Main Wallet" },
//   {
//     id: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
//     name: "Secondary Wallet",
//   },
// ];

const Wallet = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteWallet[]>([]);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(true);
  const { dateRange } = useDateRange();

  const fetchFavorites = async () => {
    try {
      const response = await API.get<FavoriteWallet[]>("/favorites");
      setFavorites(response.data);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    } finally {
      setIsFavoritesLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const defaultWalletId = favorites[0]?.walletAddress || "0x0";
  const walletId = searchParams.get("walletId") || defaultWalletId;

  const favoriteWallets = favorites.map((favorite) => ({
    id: favorite.id,
    walletAddress: favorite.walletAddress,
    name: favorite.label,
  }));

  // Helper function to update search params
  const updateSearchParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, value);
    });
    setSearchParams(params);
  };

  // First API call - Wallet price
  const {
    data: walletPriceData,
    isLoading: walletPriceIsLoading,
    error: walletPriceError,
    isSuccess: isWalletPriceSuccess,
  } = useWalletPrice(
    walletId,
    {
      startDate: format(dateRange.from!, "yyyy-MM-dd"),
      endDate: format(dateRange.to!, "yyyy-MM-dd"),
    },
    {
      enabled: !isFavoritesLoading && Boolean(walletId),
    }
  );

  // Second API call - Wallet balance (waits for price to load + 1s)
  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    error: balanceError,
  } = useWalletBalance(
    walletId,
    {
      startDate: format(dateRange.from!, "yyyy-MM-dd"),
      endDate: format(dateRange.to!, "yyyy-MM-dd"),
    },
    { enabled: isWalletPriceSuccess, delay: 1000 }
  );

  return (
    <div className="space-y-4">
      <WalletHeader
        isSearchVisible={isSearchVisible}
        walletId={walletId}
        favoriteWallets={favoriteWallets}
        onSearchSubmit={(id) => updateSearchParams({ walletId: id })}
        onSearchVisibilityChange={setIsSearchVisible}
        onWalletSelect={(address) => updateSearchParams({ walletId: address })}
        onFavoritesChange={fetchFavorites}
      />

      <WalletPriceSection
        data={walletPriceData}
        isLoading={walletPriceIsLoading}
        error={walletPriceError}
      />

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3 h-full">
          <WalletBalanceSection
            data={balanceData}
            isLoading={isBalanceLoading}
            error={balanceError}
            walletId={walletId}
            dateRange={{
              from: dateRange.from!,
              to: dateRange.to!,
            }}
          />
        </div>

        {/* <div className="col-span-1 h-full">
          <TransactionsList
            walletId={walletId}
            dateRange={{ startDate: dateRange.from!, endDate: dateRange.to! }}
          />
        </div> */}
      </div>
    </div>
  );
};

export default Wallet;
