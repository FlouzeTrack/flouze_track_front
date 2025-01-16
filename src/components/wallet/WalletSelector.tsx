import { Button } from "@/components/ui/button";
import { Wallet2, ChevronDown, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EthereumMapper } from "@/mappers/ethereumMapper";

interface Wallet {
  id: string;
  name: string;
}

interface WalletSelectorProps {
  wallets: Wallet[];
  selectedWalletId: string;
  onWalletSelect: (walletId: string) => void;
  onSearchClick: () => void;
}

export function WalletSelector({
  wallets,
  selectedWalletId,
  onWalletSelect,
  onSearchClick,
}: WalletSelectorProps) {
  const selectedWallet = wallets.find((w) => w.id === selectedWalletId);

  return (
    <div className="flex gap-2 flex-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[200px]">
            <Wallet2 className="mr-2 h-4 w-4" />
            {selectedWallet?.name || EthereumMapper.formatWalletAddress(selectedWalletId)}
            <ChevronDown className="ml-auto h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          {wallets.map((wallet) => (
            <DropdownMenuItem
              key={wallet.id}
              onClick={() => onWalletSelect(wallet.id)}
            >
              <div className="flex flex-col">
                <span className="font-medium">{wallet.name}</span>
                <span className="text-xs text-muted-foreground">
                  {EthereumMapper.formatWalletAddress(wallet.id)}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onSearchClick}
            className="text-muted-foreground"
          >
            <Search className="mr-2 h-4 w-4" />
            Search for a wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
