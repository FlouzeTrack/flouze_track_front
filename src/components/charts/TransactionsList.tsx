import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ArrowRight, ArrowLeft, AlertCircle } from "lucide-react";
import { useTransactionsList } from "@/hooks/fetch/useTransactionsList";
import {
  CalculateFeesProps,
  FormatAddressProps,
  Transaction,
} from "@/types/transactionsData";
import { EthereumMapper } from "@/mappers/ethereumMapper";

interface TransactionsListProps {
  walletId: string;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
}

function TransactionsList({ walletId, dateRange }: TransactionsListProps) {
  const { transactions, isLoading, error } = useTransactionsList(
    walletId,
    dateRange
  );

  const formatAddress = ({ address }: FormatAddressProps) =>
    `${address.slice(0, 6)}...${address.slice(-6)}`;
  const calculateFees = ({ gasUsed, gasPrice }: CalculateFeesProps) =>
    ((parseInt(gasUsed) * parseInt(gasPrice)) / 1e18).toFixed(8);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>
          <span className="font-bold">
            Wallet {EthereumMapper.formatWalletAddress(walletId)}
          </span>
          <span>
            {" "}
            •{" "}
            {EthereumMapper.formatDateRange(
              dateRange.startDate,
              dateRange.endDate
            )}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        )}
        {error && (
          <Alert
            variant="destructive"
            className="w-[500px] border-destructive/50"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="mt-2 text-sm">
              {error}
            </AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && (
          <ScrollArea className="h-[calc(100vh-420px)]">
            <div className="space-y-4">
              {transactions.map((transaction: Transaction) => (
                <Card key={transaction.hash} className="fill-card-foreground">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-foreground">
                        <p>{formatAddress({ address: transaction.hash })}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {format(
                            new Date(transaction.date),
                            "dd MMM yyyy, HH:mm"
                          )}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                      <div>
                        <p className="font-medium text-foreground">Amount</p>
                        <p>
                          {transaction.value} {transaction.symbol}
                        </p>
                      </div>

                      <div>
                        <p className="font-medium text-foreground">Fees</p>
                        <p>
                          {calculateFees({
                            gasUsed: transaction.gasUsed,
                            gasPrice: transaction.gasPrice,
                          })}{" "}
                          ETH
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
                      <div>
                        <p className="font-medium text-foreground">From</p>
                        <p>{formatAddress({ address: transaction.from })}</p>
                      </div>
                      <div>
                        {walletId.toLowerCase() ==
                        transaction.from.toLowerCase() ? (
                          <ArrowRight size={24} />
                        ) : (
                          <ArrowLeft size={24} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">To</p>
                        <p>{formatAddress({ address: transaction.to })}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

export default TransactionsList;
