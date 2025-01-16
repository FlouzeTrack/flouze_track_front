import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "../ui/card";

function TransactionsList() {
  const transactions = [
    {
      hash: "0x34c05d12f91c35baf88f8e3d0556111909aef048f1c23df0625705e67f4ce837",
      symbol: "ETH",
      currency: "ETH",
      value: "0.000000",
      date: "2025-01-15T13:08:59.000Z",
      from: "0xd0b08671ec13b451823ad9bc5401ce908872e7c5",
      to: "0x4542919c6dfcff7f13f62c6e89b3384ada77816e",
      isError: false,
      gas: "64778",
      gasUsed: "43599",
      gasPrice: "3231051796",
    },
  ];

  interface FormatAddressProps {
    address: string;
  }

  interface CalculateFeesProps {
    gasUsed: string;
    gasPrice: string;
  }

  const formatAddress = ({ address }: FormatAddressProps) =>
    `${address.slice(0, 6)}...${address.slice(-6)}`;
  const calculateFees = ({ gasUsed, gasPrice }: CalculateFeesProps) =>
    ((parseInt(gasUsed) * parseInt(gasPrice)) / 1e18).toFixed(8);

  return (
    <>
      {transactions.map((transaction) => (
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

              <div>
                <p className="font-medium text-foreground">From</p>
                <p>{formatAddress({ address: transaction.from })}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">To</p>
                <p>{formatAddress({ address: transaction.to })}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export default TransactionsList;
