import { WalletChart, WalletStats } from "@/components/charts/WalletChart";
import { FormattedBalance } from "@/types/ethereumBalancesData";
import { EthereumMapper } from "@/mappers/ethereumMapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface WalletBalanceSectionProps {
  data: FormattedBalance[];
  isLoading: boolean;
  error: string | null;
  walletId: string;
  dateRange: { from: Date; to: Date };
  favoriteWallets: Array<{
    id: string;
    walletAddress: string;
    name: string;
  }>;
  favoritesIsLoading: boolean;
}

export function WalletBalanceSection({
  data,
  isLoading,
  error,
  walletId,
  dateRange,
  favoriteWallets,
  favoritesIsLoading
}: WalletBalanceSectionProps) {
  if (!isLoading && data.length === 0 && !error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ETH Balance History</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex flex-col justify-center">
          <Alert variant="default">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No balance data available</AlertTitle>
            <AlertDescription>
              No ETH balance data found for this wallet between{" "}
              {format(dateRange.from, "PP")} and {format(dateRange.to, "PP")}.
              Try selecting a different date range.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-1.5">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ETH Balance History</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const latestValue = data[data.length - 1]?.eth || 0;
  const previousValue = data[data.length - 2]?.eth || 0;
  const changePercent = EthereumMapper.calculatePercentageChange(
    latestValue,
    previousValue
  );

  return (
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
              • {EthereumMapper.formatDateRange(dateRange.from, dateRange.to)}
            </span>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <WalletChart data={data} />
        <div className="mt-4">
          <WalletStats
            latestValue={latestValue}
            changePercent={changePercent}
          />
        </div>
      </CardContent>
    </Card>
  );
}
