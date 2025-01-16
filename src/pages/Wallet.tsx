import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { DateRange } from "react-day-picker";
import { format, subMonths } from "date-fns";

const WALLET_ID = "0xd0b08671eC13B451823aD9bC5401ce908872e7c5";

const Wallet = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

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

  const { data, isLoading, error } = useWalletBalance(WALLET_ID, {
    startDate: format(startDate, "yyyy-MM-dd"),
    endDate: format(endDate, "yyyy-MM-dd"),
  });

  const handleDateChange = (range: DateRange) => {
    if (!range.from || !range.to) return;

    const params = new URLSearchParams(searchParams);
    params.set("startDate", format(range.from, "yyyy-MM-dd"));
    params.set("endDate", format(range.to, "yyyy-MM-dd"));
    setSearchParams(params);
  };

  // Refetch when dates change
  // useEffect(() => {
  //   refetch();
  // }, [searchParams]);

  if (error) return <div>Error: {error}</div>;

  const latestValue = data[data.length - 1]?.eth || 0;
  const previousValue = data[data.length - 2]?.eth || 0;
  const changePercent = EthereumMapper.calculatePercentageChange(
    latestValue,
    previousValue
  );

  return (
    <>
      <div className="mb-4">
        <DateRangePicker
          initialDateRange={initialDateRange}
          onDateChange={handleDateChange}
        />
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>ETH Balance History</CardTitle>
            <CardDescription>
              Balance evolution{" "}
              {EthereumMapper.formatDateRange(startDate, endDate)}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? "loading..." : <WalletChart data={data} />}
        </CardContent>
        <WalletStats latestValue={latestValue} changePercent={changePercent} />
      </Card>
    </>
  );
};

export default Wallet;
