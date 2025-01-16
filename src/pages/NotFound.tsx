import { Button } from "@/components/ui/button";
import Ripple from "@/components/ui/ripple";
import { useTheme } from "@/providers/ThemeProvider";
import { Bitcoin } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const getTheme = (themeUsed: string) => {
    if (themeUsed === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return themeUsed === "dark" ? "dark" : "light";
  };
  const themeUsed = useTheme()?.theme;
  const theme = getTheme(themeUsed);

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className={`flex flex-col gap-4 p-6 md:p-10 relative order-last`}>
        <div className={`flex flex-1 items-center justify-center py-12`}>
          <div className="mx-auto grid w-[350px] gap-6 text-center">
            <h1 className="text-6xl font-bold text-foreground">404</h1>
            <p className="text-xl text-card-foreground mt-4">Page Not Found</p>
            <Button className="w-fit m-auto">
              <Link to="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center">
        <div className="flex flex-col items-center gap-8 md:items-start absolute top-6 left-6">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Bitcoin className="size-4" />
            </div>
            FlouzeTrack
          </a>
        </div>
        <div className="relative flex h-[650px] w-full flex-col items-center justify-center">
          <p className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-foreground">
            <img
              className="animate-ripple absolute"
              src={`/ethereum-eth-logo-${theme}.svg`}
              alt="ETH logo"
              width={70}
            />
          </p>
          <Ripple mainCircleSize={210} numCircles={6} />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
