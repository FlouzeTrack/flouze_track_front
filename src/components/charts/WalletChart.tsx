import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { EthereumMapper } from "@/mappers/ethereumMapper";
import { FormattedBalance } from "@/types/ethereumBalancesData";
import { TrendingUp, TrendingDown } from "lucide-react";
import { CardFooter } from "@/components/ui/card";

interface WalletBalanceChartProps {
  data: FormattedBalance[];
}

interface WalletBalanceStatsProps {
  latestValue: number;
  changePercent: number;
}

const chartConfig = {
  eth: {
    label: "ETH Balance",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const WalletChartTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;
  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid gap-2">
        <div className="font-medium">
          {EthereumMapper.formatEthValue(data.eth)}
        </div>
        <div className="text-xs text-muted-foreground">
          {EthereumMapper.formatDateTime(data.date)}
        </div>
      </div>
    </div>
  );
};

export function WalletChart({ data }: WalletBalanceChartProps) {
  const domain = EthereumMapper.calculateChartDomain(data);

  return (
    <ChartContainer className="h-[300px] w-full" config={chartConfig}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
        accessibilityLayer
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="timestamp"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={EthereumMapper.formatDate}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={EthereumMapper.formatEthValue}
          domain={[domain.min, domain.max]}
        />
        <ChartTooltip content={<WalletChartTooltip />} />
        <Line
          type="stepAfter"
          dataKey="eth"
          stroke="var(--color-eth)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}

export function WalletStats({
  latestValue,
  changePercent,
}: WalletBalanceStatsProps) {
  return (
    <CardFooter className="flex-col items-start gap-2 text-sm">
      <div className="flex items-center gap-2 font-medium leading-none">
        {changePercent >= 0 ? (
          <>
            Trending up by {Math.abs(changePercent).toFixed(2)}%
            <TrendingUp className="h-4 w-4 text-green-500" />
          </>
        ) : (
          <>
            Trending down by {Math.abs(changePercent).toFixed(2)}%
            <TrendingDown className="h-4 w-4 text-red-500" />
          </>
        )}
      </div>
      <div className="leading-none text-muted-foreground">
        Current balance: {EthereumMapper.formatEthValue(latestValue)}
      </div>
    </CardFooter>
  );
}
