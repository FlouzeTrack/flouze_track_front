import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface WalletSearchProps {
  defaultValue: string;
  onSubmit: (walletId: string) => void;
  onClose: () => void;
}

export function WalletSearch({
  defaultValue,
  onSubmit,
  onClose,
}: WalletSearchProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const walletId = formData.get("walletId") as string;
    if (walletId) onSubmit(walletId);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
      <Input
        name="walletId"
        placeholder="Enter wallet address"
        defaultValue={defaultValue}
        className="w-[400px] h-9"
        autoFocus
      />
      <Button type="submit" size="icon" variant="secondary">
        <Search className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </form>
  );
}
