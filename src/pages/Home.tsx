import { HomeFooter } from "@/components/home/HomeFooter";
import HomeHeader from "@/components/home/HomeHeader";
import { HomeReassurance } from "@/components/home/HomeReassurance";
import { HomeTextImage } from "@/components/home/HomeTextImage";
import { Button } from "@/components/ui/button";
import Ripple from "@/components/ui/ripple";
import { useTheme } from "@/providers/ThemeProvider";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Home() {
  const { t } = useTranslation();

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
    <div
      className="relative before:bg-gradient-to-t before:from-primary-foreground
        before:to-transparent before:absolute before:bottom-0 before:z-[-2] before:h-28 before:w-full after:bg-gradient-to-t
        after:from-transparent after:to-primary-foreground after:absolute after:inset-0 after:z-[-1] after:h-28"
    >
      <HomeHeader />
      <div className="flex flex-col mt-8 gap-52 px-4 py-10 pb-32 max-w-[1140px] mx-auto">
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2 text-center md:text-left md:gap-2 mt-0 md:mt-[-10vh] md:mb-[-10vh] max-w-[1140px] min-h-[20vh] mx-auto">
          <div className="flex flex-col items-center md:items-start mt-8">
            <h1 className="text-5xl font-bold">{t("home.heroBanner.title")}</h1>
            <p className="text-lg mt-4 text-secondary-foreground">
              {t("home.heroBanner.description")}
            </p>
            <Button variant="default" className="w-40 mt-8">
              <Link to="/login" className="text-primary-foreground">
                {t("home.heroBanner.cta")}
              </Link>
            </Button>
          </div>
          <div className="flex justify-center gap-4 mt-8 sm:mt-0">
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

        <HomeTextImage
          title={t("home.textImage.0.title")}
          content={t("home.textImage.0.description")}
          imgSrc="home_screen_1.png"
          imgAlt={t("common.wallet")}
          revert={false}
        />
        <HomeTextImage
          title={t("home.textImage.1.title")}
          content={t("home.textImage.1.description")}
          imgSrc="home_screen_2.png"
          imgAlt={t("common.wallet")}
          ctaHref="/features"
          ctaTitle={t("home.textImage.1.cta")}
          revert={true}
        />
        <HomeTextImage
          title={t("home.textImage.2.title")}
          content={t("home.textImage.2.description")}
          imgSrc="/images/undraw_wallet_aym5.svg"
          imgAlt={t("common.wallet")}
          revert={false}
        />
        <HomeReassurance />
      </div>
      <HomeFooter />
    </div>
  );
}
