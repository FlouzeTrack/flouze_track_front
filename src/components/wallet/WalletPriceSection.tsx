import { WalletPriceChart } from "@/components/charts/WalletPriceChart";
import { WalletPriceResponse } from "@/types/ethereumWalletPricesData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface WalletPriceSectionProps {
  data: WalletPriceResponse | null;
  isLoading: boolean;
  error: string | null;
}

export function WalletPriceSection({
  data,
  isLoading,
  error,
}: WalletPriceSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Value vs ETH Price</CardTitle>
        <CardDescription>
          Compare your wallet value with ETH price over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <Skeleton className="h-[300px] w-full" />
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <WalletPriceChart data={data.history} />
        )}
      </CardContent>
    </Card>
  );
}
