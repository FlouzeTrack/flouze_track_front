import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Bitcoin } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { LanguageToggle } from "../ui/LanguageToggle";

export const HomeHeader = () => (
  <div className="flex justify-between gap-4 p-4 max-w-[1400px] mx-auto">
    <div className="flex items-center gap-2 font-medium">
      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Bitcoin className="size-4" />
      </div>
      FlouzeTrack
    </div>
    <div className="flex justify-end gap-4">
      <Button variant="outline">
        <Link to="/login">Login</Link>
      </Button>
      <Button variant="default">
        <Link to="/register">Register</Link>
      </Button>
      <ThemeToggle />
      <LanguageToggle />
    </div>
  </div>
);
export default HomeHeader;
