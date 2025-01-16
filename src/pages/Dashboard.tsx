import { TrendingUp, TrendingDown, BarChart } from "lucide-react";
import { CartesianGrid, XAxis, YAxis, Line, LineChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useCryptoPrice } from "@/hooks/fetch/useCryptoPrice";
import { format } from "date-fns";
import { FormattedCryptoPrice } from "@/types/cryptoPrice.types";
import { useCryptoKpi } from "@/hooks/fetch/useCryptoKpi";
import { useDateRange } from "@/providers/DateRangeProvider";

const chartConfig = {
  close: {
    label: "Price",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function Dashboard() {
  const { dateRange } = useDateRange();

  const { data, isLoading, error } = useCryptoPrice({
    startDate: format(dateRange.from!, "yyyy-MM-dd"),
    endDate: format(dateRange.to!, "yyyy-MM-dd"),
  });

  const { kpiData, isKpiLoading, kpiError } = useCryptoKpi({
    startDate: format(dateRange.from!, "yyyy-MM-dd"),
    endDate: format(dateRange.to!, "yyyy-MM-dd"),
  });

  const prices = data.map((d: FormattedCryptoPrice) => d.close);
  const minValue = Math.min(...prices);
  const maxValue = Math.max(...prices);
  const buffer = (maxValue - minValue) * 0.05;

  const getPriceTicks = () => {
    const min = Math.floor(minValue - buffer);
    const max = Math.ceil(maxValue + buffer);
    const step = (max - min) / 5; // 6 ticks = 5 intervals
    return Array.from({ length: 6 }, (_, i) => min + step * i);
  };

  // Add distributed dates helper
  const getDistributedDates = (data: FormattedCryptoPrice[]) => {
    if (!data || data.length < 2) return [];
    const interval = Math.max(1, Math.floor(data.length / 7));
    return data
      .filter(
        (_, index) =>
          index === 0 || index === data.length - 1 || index % interval === 0
      )
      .map((d) => d.time);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const highestPeriodPrice = kpiData?.highestPeriodPrice || 0;
  const lowestPeriodPrice = kpiData?.lowestPeriodPrice || 0;
  const currentPrice = kpiData?.currentPrice || 0;
  const priceChange = kpiData?.priceChange || 0;

  return (
    <div className="space-y-6">
      <Card className="h-full">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle>Price Evolution</CardTitle>
            <div className="text-sm font-medium text-muted-foreground">
              {data.length} days period
            </div>
          </div>
          <CardDescription>ETH price over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="h-[40vh] min-h-[300px] w-full"
          >
            <LineChart
              data={data}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              accessibilityLayer
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                domain={[minValue, maxValue]}
                ticks={getPriceTicks()}
                tickFormatter={(value) =>
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(value)
                }
              />
              <XAxis
                dataKey="time"
                tickFormatter={formatDate}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                ticks={getDistributedDates(data)}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="close"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Price</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(currentPrice)}
            </div>
            <div className="flex items-center gap-2 mt-2">
              {priceChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-sm ${
                  priceChange >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {Math.abs(priceChange).toFixed(2)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Period High</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {formatPrice(highestPeriodPrice)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Period Low</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {formatPrice(lowestPeriodPrice)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
