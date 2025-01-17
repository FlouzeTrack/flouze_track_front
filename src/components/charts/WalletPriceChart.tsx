import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface WalletPriceChartProps {
  data?: {
    date: string;
    price: string;
    valueUsd: string;
  }[];
}

const chartConfig = {
  price: {
    label: "ETH Price",
    color: "hsl(var(--chart-1))",
  },
  value: {
    label: "Wallet Value",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function WalletPriceChart({ data = [] }: WalletPriceChartProps) {
  if (!data.length) return null;

  const formattedData = data.map((item) => ({
    time: new Date(item.date).getTime() / 1000,
    price: parseFloat(item.price),
    value: parseFloat(item.valueUsd),
  }));

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatValue = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <LineChart
        data={formattedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="time"
          tickFormatter={formatDate}
          tickLine={false}
          axisLine={false}
        />
        <YAxis tickFormatter={formatValue} tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="price"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
