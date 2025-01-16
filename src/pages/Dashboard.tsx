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
import { format, subMonths } from "date-fns";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/DateRangePicker";

const mockData = [
  {
    time: 1735948800,
    high: 98757.16,
    low: 97522.47,
    open: 98135.8,
    volumefrom: 9919.49,
    volumeto: 972181437.3,
    close: 98213.69,
  },
  {
    time: 1736121600,
    high: 102530.34,
    low: 97908.09,
    open: 98346.97,
    volumefrom: 46146.96,
    volumeto: 4654078182.67,
    close: 102282.2,
  },
  {
    time: 1736208000,
    high: 102747.54,
    low: 96112.95,
    open: 102282.2,
    volumefrom: 54319.14,
    volumeto: 5348079997.25,
    close: 96942.47,
  },
  {
    time: 1736294400,
    high: 97251.53,
    low: 92488.45,
    open: 96942.47,
    volumefrom: 57721.92,
    volumeto: 5480363249.42,
    close: 95051.06,
  },
  {
    time: 1736380800,
    high: 95345.44,
    low: 91197.56,
    open: 95051.06,
    volumefrom: 50519.28,
    volumeto: 4696698492.32,
    close: 92548.12,
  },
];

const chartConfig = {
  close: {
    label: "Price",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Set default dates only if they're not in URL
  useEffect(() => {
    if (!searchParams.has("startDate") || !searchParams.has("endDate")) {
      const endDate = new Date();
      const startDate = subMonths(endDate, 6);

      const params = new URLSearchParams(searchParams);
      params.set("startDate", format(startDate, "yyyy-MM-dd"));
      params.set("endDate", format(endDate, "yyyy-MM-dd"));
      setSearchParams(params);
    }
  }, []);

  const startDate = searchParams.get("startDate")
    ? new Date(searchParams.get("startDate")!)
    : subMonths(new Date(), 6);

  const endDate = searchParams.get("endDate")
    ? new Date(searchParams.get("endDate")!)
    : new Date();

  const initialDateRange: DateRange = {
    from: startDate,
    to: endDate,
  };

  const handleDateChange = (range: DateRange) => {
    if (!range.from || !range.to) return;

    const params = new URLSearchParams(searchParams);
    params.set("startDate", format(range.from, "yyyy-MM-dd"));
    params.set("endDate", format(range.to, "yyyy-MM-dd"));
    setSearchParams(params);
  };

  const { data, isLoading, error } = useCryptoPrice();

  console.log("data : ", data);

  const prices = mockData.map((d) => d.close);
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
  const getDistributedDates = (data: typeof mockData) => {
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

  const formatVolume = (volume: number) =>
    new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(volume);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const latestData = mockData[mockData.length - 1];
  const previousData = mockData[mockData.length - 2];
  const priceChange =
    ((latestData.close - previousData.close) / previousData.close) * 100;

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <DateRangePicker
          initialDateRange={initialDateRange}
          onDateChange={handleDateChange}
        />
      </div>
      <Card className="h-full">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle>Price Evolution</CardTitle>
            <div className="text-sm font-medium text-muted-foreground">
              {mockData.length} days period
            </div>
          </div>
          <CardDescription>BTC price over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="h-[40vh] min-h-[300px] w-full"
          >
            <LineChart
              data={mockData}
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
                ticks={getDistributedDates(mockData)}
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
              {formatPrice(latestData.close)}
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
            <CardTitle className="text-sm font-medium">24h High</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {formatPrice(latestData.high)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">24h Low</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {formatPrice(latestData.low)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatVolume(latestData.volumeto)}
            </div>
            <p className="text-xs text-muted-foreground">USD</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
