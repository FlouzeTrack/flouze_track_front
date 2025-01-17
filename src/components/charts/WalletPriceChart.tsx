import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BalanceHistoryWithPriceItem } from "@/types/ethereumWalletPricesData";

interface WalletPriceChartProps {
  data: BalanceHistoryWithPriceItem[]; // Update this line
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

  const formattedData = data.map((item) => ({
    time: new Date(item.date).getTime() / 1000,
    price: parseFloat(item.price),
    value: parseFloat(item.valueUsd),
  }));

  // Calculer les domaines pour chaque axe Y
  const prices = formattedData.map((d) => d.price);
  const values = formattedData.map((d) => d.value);

  const priceMin = Math.min(...prices);
  const priceMax = Math.max(...prices);
  const valueMin = Math.min(...values);
  const valueMax = Math.max(...values);

  // Ajouter un buffer pour l'affichage
  const priceBuffer = (priceMax - priceMin) * 0.1;
  const valueBuffer = (valueMax - valueMin) * 0.1;

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <LineChart
        data={formattedData}
        margin={{ top: 5, right: 50, left: 50, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="time"
          tickFormatter={formatDate}
          tickLine={false}
          axisLine={false}
        />
        {/* Axe Y pour le prix ETH */}
        <YAxis
          yAxisId="price"
          orientation="left"
          tickFormatter={formatValue}
          domain={[priceMin - priceBuffer, priceMax + priceBuffer]}
          tickLine={false}
          axisLine={false}
          stroke="hsl(var(--chart-1))"
        />
        {/* Axe Y pour la valeur du wallet */}
        <YAxis
          yAxisId="value"
          orientation="right"
          tickFormatter={formatValue}
          domain={[valueMin - valueBuffer, valueMax + valueBuffer]}
          tickLine={false}
          axisLine={false}
          stroke="hsl(var(--chart-2))"
        />
        <Legend
          verticalAlign="top"
          height={36}
          formatter={(value) => {
            return value === "price" ? "ETH Price" : "Wallet Value";
          }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          yAxisId="price"
          type="monotone"
          dataKey="price"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          dot={false}
        />
        <Line
          yAxisId="value"
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
