import { FormattedBalance } from "@/types/ethereumBalancesData";

export class EthereumMapper {
  static weiToEth(weiValue: string): number {
    return Number(BigInt(weiValue)) / 1e18;
  }

  static formatEthValue(value: number): string {
    return `${value.toFixed(4)} ETH`;
  }

  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  static formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  static formatDateRange(start: Date | string, end: Date | string): string {
    const formatDate = (date: Date | string) => {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    const startDate = formatDate(start);
    const endDate = formatDate(end);

    return `from ${startDate} to ${endDate}`;
  }

  static getTimestamp(dateString: string): number {
    return new Date(dateString).getTime();
  }

  static calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  static calculateChartDomain(data: FormattedBalance[]) {
    const maxEth = Math.max(...data.map((d) => d.eth));
    const minEth = Math.min(...data.map((d) => d.eth));
    const padding = (maxEth - minEth) * 0.1;

    return {
      min: minEth - padding,
      max: maxEth + padding,
    };
  }
}
