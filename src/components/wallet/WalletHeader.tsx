import { Button } from "../ui/button";
import { WalletSearch } from "./WalletSearch";
import { WalletSelector } from "./WalletSelector";
import { ChevronRight } from "lucide-react";

interface WalletHeaderProps {
  isSearchVisible: boolean;
  walletId: string;
  favoriteWallets: Array<{ id: string; name: string }>;
  onSearchSubmit: (walletId: string) => void;
  onSearchVisibilityChange: (visible: boolean) => void;
  onWalletSelect: (walletId: string) => void;
  onWalletFavoriteClick: (walletId: string) => void;
}

export function WalletHeader({
  isSearchVisible,
  walletId,
  favoriteWallets,
  onSearchSubmit,
  onSearchVisibilityChange,
  onWalletSelect,
  onWalletFavoriteClick,
}: WalletHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      {isSearchVisible ? (
        <WalletSearch
          defaultValue={walletId}
          onSubmit={onSearchSubmit}
          onClose={() => onSearchVisibilityChange(false)}
        />
      ) : (
        <WalletSelector
          wallets={favoriteWallets}
          selectedWalletId={walletId}
          onWalletSelect={onWalletSelect}
          onSearchClick={() => onSearchVisibilityChange(true)}
        />
      )}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onWalletFavoriteClick(walletId)}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
