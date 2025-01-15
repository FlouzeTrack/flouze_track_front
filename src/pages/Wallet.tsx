import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WalletStats } from "@/components/charts/WalletChart";
import { WalletChart } from "@/components/charts/WalletChart";
import { useWalletBalance } from "@/hooks/fetch/useWalletBalance";
import { EthereumMapper } from "@/mappers/ethereumMapper";

const WALLET_ID = "0xd0b08671eC13B451823aD9bC5401ce908872e7c5";

const Wallet = () => {
  const { data, isLoading, error } = useWalletBalance(WALLET_ID);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const latestValue = data[data.length - 1]?.eth || 0;
  const previousValue = data[data.length - 2]?.eth || 0;
  const changePercent = EthereumMapper.calculatePercentageChange(
    latestValue,
    previousValue
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>ETH Balance History</CardTitle>
        <CardDescription>Balance evolution over time</CardDescription>
      </CardHeader>
      <CardContent>
        <WalletChart data={data} />
      </CardContent>
      <WalletStats latestValue={latestValue} changePercent={changePercent} />
    </Card>
  );
};

export default Wallet;
