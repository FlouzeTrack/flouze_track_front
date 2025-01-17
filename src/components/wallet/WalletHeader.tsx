import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import { WalletSearch } from "./WalletSearch";
import { WalletSelector } from "./WalletSelector";
import { FavoritesService } from "@/services/createFavorite";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
interface WalletHeaderProps {
  isSearchVisible: boolean;
  walletId: string;
  favoriteWallets: Array<{
    id: string;
    walletAddress: string; // Add this
    name: string;
  }>;
  onSearchSubmit: (walletId: string) => void;
  onSearchVisibilityChange: (visible: boolean) => void;
  onWalletSelect: (walletId: string) => void;
  onFavoritesChange: () => void;
}

export function WalletHeader({
  isSearchVisible,
  walletId,
  favoriteWallets,
  onSearchSubmit,
  onSearchVisibilityChange,
  onWalletSelect,
  onFavoritesChange,
}: WalletHeaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  // Update this check to use walletAddress
  const isFavorite = favoriteWallets.some(
    (wallet) => wallet.walletAddress.toLowerCase() === walletId.toLowerCase()
  );

  const onWalletFavoriteClick = async (walletId: string) => {
    // Find favorite by walletAddress
    const favorite = favoriteWallets.find(
      (w) => w.walletAddress.toLowerCase() === walletId.toLowerCase()
    );
    const isFavorite = Boolean(favorite);

    try {
      setIsProcessing(true);

      if (isFavorite && favorite) {
        await FavoritesService.deleteFavorite(favorite.id);
        onFavoritesChange();
        toast({
          title: "Success",
          description: "Wallet removed from favorites",
        });
      } else {
        await FavoritesService.createFavorite(walletId, "New Wallet");
        onFavoritesChange();
        toast({
          title: "Success",
          description: "Wallet added to favorites",
        });
      }
    } catch (error) {
      console.error("Failed to update favorites:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isFavorite ? "remove" : "add"} wallet ${
          isFavorite ? "from" : "to"
        } favorites`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

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
        disabled={isProcessing}
      >
        <Heart className={isFavorite ? "fill-current" : ""} />
      </Button>
    </div>
  );
}
