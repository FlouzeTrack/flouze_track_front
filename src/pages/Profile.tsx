import { useEffect, useState } from "react";
import { AuthAPI, API } from "@/services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Pencil, Plus, Trash2, Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { FavoritesService } from "@/services/createFavorite";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UserProfile {
  email: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [favorites, setFavorites] = useState<FormattedFavoriteWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [editingWallet, setEditingWallet] = useState<EditingWallet | null>(
    null
  );
  const [isAddingWallet, setIsAddingWallet] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, favoritesRes] = await Promise.all([
          AuthAPI.get<UserProfile>("/auth/me"),
          API.get<FavoriteWallet[]>("/favorites"),
        ]);

        setProfile(profileRes.data);
        setFavorites(favoritesRes.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load profile information");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateWallet = async (id: string) => {
    if (!editingWallet) return;

    try {
      await FavoritesService.updateFavorite(id, {
        walletAddress: editingWallet.walletAddress,
        label: editingWallet.label,
      });

      const response = await API.get<FavoriteWallet[]>("/favorites");
      setFavorites(response.data);
      setEditingWallet(null);

      toast({
        title: "Success",
        description: "Wallet updated successfully",
      });
    } catch (error) {
      console.error("Update failed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update wallet",
      });
    }
  };

  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWalletAddress || !newLabel) return;

    try {
      await FavoritesService.createFavorite(newWalletAddress, newLabel);
      const response = await API.get<FavoriteWallet[]>("/favorites");
      setFavorites(response.data);
      setNewWalletAddress("");
      setNewLabel("");
      toast({
        title: "Success",
        description: "Wallet added to favorites",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add wallet to favorites",
      });
    }
  };

  const handleDeleteWallet = async (id: string) => {
    try {
      await FavoritesService.deleteFavorite(id);
      setFavorites(favorites.filter((wallet) => wallet.id !== id));
      toast({
        title: "Success",
        description: "Wallet removed from favorites",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove wallet from favorites",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !profile && !loading) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>
                {profile?.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{profile?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Favorites Wallets</CardTitle>
            <CardDescription>Your favorite Ethereum wallets</CardDescription>
          </div>
          {!isAddingWallet && (
            <Button
              onClick={() => setIsAddingWallet(true)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Wallet
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isAddingWallet && (
              <form
                onSubmit={async (e) => {
                  await handleAddWallet(e);
                  setIsAddingWallet(false);
                }}
                className="p-4 border rounded-lg space-y-4 bg-muted/5"
              >
                <div className="grid grid-cols-[1fr_2fr] gap-2">
                  <Input
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Enter label"
                  />
                  <Input
                    value={newWalletAddress}
                    onChange={(e) => setNewWalletAddress(e.target.value)}
                    placeholder="Enter wallet address"
                    className="font-mono"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setIsAddingWallet(false);
                      setNewLabel("");
                      setNewWalletAddress("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!newLabel || !newWalletAddress}
                  >
                    Add Wallet
                  </Button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {favorites.map((wallet) => (
                <div
                  key={wallet.id}
                  className="group relative p-4 border rounded-lg transition-all hover:border-primary/50"
                >
                  {editingWallet?.id === wallet.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-[1fr_2fr] gap-2">
                        <Input
                          value={editingWallet.label}
                          onChange={(e) =>
                            setEditingWallet({
                              ...editingWallet,
                              label: e.target.value,
                            })
                          }
                          placeholder="Enter label"
                        />
                        <Input
                          value={editingWallet.walletAddress}
                          onChange={(e) =>
                            setEditingWallet({
                              ...editingWallet,
                              walletAddress: e.target.value,
                            })
                          }
                          className="font-mono"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setEditingWallet(null)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={() => handleUpdateWallet(wallet.id)}>
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="grid grid-cols-[1fr_2fr] gap-4 flex-1">
                        <div>
                          <p className="text-sm text-muted-foreground">Label</p>
                          <p className="font-medium">{wallet.label}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Address
                          </p>
                          <p className="font-mono">{wallet.walletAddress}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingWallet(wallet)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteWallet(wallet.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
