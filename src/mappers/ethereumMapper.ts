export class EthereumMapper {
  static weiToEth(weiValue: string): number {
    return Number(BigInt(weiValue)) / 1e18;
  }

  static formatEthValue(value: number): string {
    return `${value.toFixed(4)} ETH`;
  }

  static formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  static calculatePercentageChange(current: number, previous: number): number {
    return ((current - previous) / previous) * 100;
  }
}
