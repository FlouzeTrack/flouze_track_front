import { WalletSearch } from "./WalletSearch";
import { WalletSelector } from "./WalletSelector";

interface WalletHeaderProps {
  isSearchVisible: boolean;
  walletId: string;
  favoriteWallets: Array<{ id: string; name: string }>;
  onSearchSubmit: (walletId: string) => void;
  onSearchVisibilityChange: (visible: boolean) => void;
  onWalletSelect: (walletId: string) => void;
}

export function WalletHeader({
  isSearchVisible,
  walletId,
  favoriteWallets,
  onSearchSubmit,
  onSearchVisibilityChange,
  onWalletSelect,
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
    </div>
  );
}
