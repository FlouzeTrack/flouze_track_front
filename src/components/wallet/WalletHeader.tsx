import { WalletSearch } from "./WalletSearch";
import { WalletSelector } from "./WalletSelector";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { DateRange } from "react-day-picker";

interface WalletHeaderProps {
  isSearchVisible: boolean;
  walletId: string;
  favoriteWallets: Array<{ id: string; name: string }>;
  dateRange: DateRange;
  onSearchSubmit: (walletId: string) => void;
  onSearchVisibilityChange: (visible: boolean) => void;
  onWalletSelect: (walletId: string) => void;
  onDateChange: (range: DateRange) => void;
}

export function WalletHeader({
  isSearchVisible,
  walletId,
  favoriteWallets,
  dateRange,
  onSearchSubmit,
  onSearchVisibilityChange,
  onWalletSelect,
  onDateChange,
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
      <DateRangePicker initialDateRange={dateRange} onDateChange={onDateChange} />
    </div>
  );
}
