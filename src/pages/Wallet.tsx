import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WalletStats, WalletChart } from "@/components/charts/WalletChart";
import { useWalletBalance } from "@/hooks/fetch/useWalletBalance";
import { useWalletPrice } from "@/hooks/fetch/useWalletPrice";
import { EthereumMapper } from "@/mappers/ethereumMapper";
import { AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WalletHeader } from "@/components/wallet/WalletHeader";
import { FormattedBalance } from "@/types/ethereumBalancesData";
import TransactionsList from "@/components/charts/TransactionsList";
import { useDateRange } from "@/providers/DateRangeProvider";
import { WalletPriceChart } from "@/components/charts/WalletPriceChart";

export const DEFAULT_WALLET_ID = "0xd0b08671eC13B451823aD9bC5401ce908872e7c5";

const FAVORITE_WALLETS = [
  { id: DEFAULT_WALLET_ID, name: "Main Wallet" },
  {
    id: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    name: "Secondary Wallet",
  },
];

const Wallet = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { dateRange } = useDateRange();

  const {
    data: walletsFavoriteData,
    isLoading,
    error,
  } = useCryptoPrice({
    startDate: format(dateRange.from!, "yyyy-MM-dd"),
    endDate: format(dateRange.to!, "yyyy-MM-dd"),
  });

  const walletId = searchParams.get("walletId") || DEFAULT_WALLET_ID;

  useEffect(() => {
    if (!searchParams.has("walletId")) {
      const params = new URLSearchParams(searchParams);
      params.set("walletId", DEFAULT_WALLET_ID);
      setSearchParams(params);
    }
  }, []);

  const {
    data: walletPriceData,
    isLoading: walletPriceIsLoading,
    error: walletPriceError,
    // isSuccess: isWalletPriceSuccess,
  } = useWalletPrice(
    walletId,
    {
      startDate: format(dateRange.from!, "yyyy-MM-dd"),
      endDate: format(dateRange.to!, "yyyy-MM-dd"),
    }
    // {
    //   enabled: true,
    // }
  );

  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    error: balanceError,
    // isSuccess: isBalanceSuccess,
  } = useWalletBalance(
    walletId,
    {
      startDate: format(dateRange.from!, "yyyy-MM-dd"),
      endDate: format(dateRange.to!, "yyyy-MM-dd"),
    }
    // { enabled: isWalletPriceSuccess }
  );

  const updateSearchParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, value);
    });
    setSearchParams(params);
  };

  const updateFavorite = (updates: Record<string, string>) => {
    console.log("updateFavorite", updates);
  };

  return (
    <div className="space-y-4">
      <WalletHeader
        isSearchVisible={isSearchVisible}
        walletId={walletId}
        favoriteWallets={FAVORITE_WALLETS}
        onSearchSubmit={(newWalletId) =>
          updateSearchParams({ walletId: newWalletId })
        }
        onSearchVisibilityChange={setIsSearchVisible}
        onWalletSelect={(newWalletId) =>
          updateSearchParams({ walletId: newWalletId })
        }
        onWalletFavoriteClick={(newWalletId) =>
          updateFavorite({ address: newWalletId })
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Wallet Value vs ETH Price</CardTitle>
          <CardDescription>
            Compare your wallet value with ETH price over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {walletPriceIsLoading || walletPriceData === null ? (
            <Skeleton className="h-[300px] w-full" />
          ) : walletPriceError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{walletPriceError}</AlertDescription>
            </Alert>
          ) : walletPriceData ? (
            (console.log(
              "walletPriceData",
              walletPriceData,
              walletPriceData.history
            ),
            (<WalletPriceChart data={walletPriceData.history} />))
          ) : null}
        </CardContent>
      </Card>
      {/* <div className="grid grid-flow-row-dense grid-cols-3 grid-rows-3 gap-4">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col space-y-1.5">
                <CardTitle>ETH Balance History</CardTitle>
                <CardDescription>
                  <span className="font-bold">
                    Wallet {EthereumMapper.formatWalletAddress(walletId)}
                  </span>
                  <span>
                    {" "}
                    {EthereumMapper.formatDateRange(
                      dateRange.from!,
                      dateRange.to!
                    )}
                  </span>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <WalletContent isLoading={isLoading} error={error} data={data} />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionsList />
          </CardContent>
        </Card>
      </div> */}

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-1.5">
            <CardTitle>ETH Balance History</CardTitle>
            <CardDescription>
              <span className="font-bold">
                Wallet {EthereumMapper.formatWalletAddress(walletId)}
              </span>
              <span>
                {" "}
                •
                {EthereumMapper.formatDateRange(dateRange.from!, dateRange.to!)}
              </span>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <WalletContent
            isLoading={isBalanceLoading}
            error={balanceError}
            data={balanceData}
          />
        </CardContent>
      </Card>
    </div>
  );
};

const WalletContent = ({
  isLoading,
  error,
  data,
}: {
  isLoading: boolean;
  error: string | null;
  data: FormattedBalance[];
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-[300px] w-full mb-6" />
        <div className="flex flex-col items-start gap-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-destructive/5">
        <Alert
          variant="destructive"
          className="w-[500px] border-destructive/50"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="mt-2 text-sm">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const latestValue = data[data.length - 1]?.eth || 0;
  const previousValue = data[data.length - 2]?.eth || 0;
  const changePercent = EthereumMapper.calculatePercentageChange(
    latestValue,
    previousValue
  );

  return (
    <>
      <WalletChart data={data} />
      <div className="mt-4">
        <WalletStats latestValue={latestValue} changePercent={changePercent} />
      </div>
    </>
  );
};

export default Wallet;
