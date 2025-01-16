import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ArrowRight, ArrowLeft, AlertCircle } from "lucide-react";
import { DEFAULT_WALLET_ID } from "@/pages/Wallet";
import { useTransactionsList } from "@/hooks/fetch/useTransactionsList";

export interface Transaction {
  hash: string;
  symbol: string;
  value: string;
  date: string;
  from: string;
  to: string;
  gasUsed: string;
  gasPrice: string;
}

interface FormatAddressProps {
  address: string;
}

interface CalculateFeesProps {
  gasUsed: string;
  gasPrice: string;
}

function TransactionsList() {
  const { transactions, isLoading, error } =
    useTransactionsList(DEFAULT_WALLET_ID);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-[300px] w-full mb-6" />
        <div className="flex flex-col items-start gap-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-destructive/5">
        <Alert
          variant="destructive"
          className="w-[500px] border-destructive/50"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="mt-2 text-sm">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const formatAddress = ({ address }: FormatAddressProps) =>
    `${address.slice(0, 6)}...${address.slice(-6)}`;
  const calculateFees = ({ gasUsed, gasPrice }: CalculateFeesProps) =>
    ((parseInt(gasUsed) * parseInt(gasPrice)) / 1e18).toFixed(8);

  return (
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
                    {format(new Date(transaction.date), "dd MMM yyyy, HH:mm")}
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
                  {DEFAULT_WALLET_ID === transaction.from ? (
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
  );
}

export default TransactionsList;
