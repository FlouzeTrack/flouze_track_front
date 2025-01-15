import { HomeFooter } from "@/components/home/HomeFooter";
import HomeHeader from "@/components/home/HomeHeader";
import { HomeReassurance } from "@/components/home/HomeReassurance";
import { HomeTextImage } from "@/components/home/HomeTextImage";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <HomeHeader />
      <div className="flex flex-col mt-8 gap-28 px-4 py-8 pb-20 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center max-w-[1140px] min-h-[20vh] mx-auto">
          <div className="flex flex-col mt-8 ">
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
          <div className="flex justify-center gap-4 mt-8">
            <img
              src="/images/undraw_wallet_aym5.svg"
              alt="Wallet"
              className="w-96 h-96"
            />
          </div>
        </div>

        <HomeTextImage
          title={t("home.textImage.0.title")}
          content={t("home.textImage.0.description")}
          imgSrc="/images/undraw_wallet_aym5.svg"
          imgAlt={t("common.wallet")}
          revert={false}
        />
        <HomeTextImage
          title={t("home.textImage.1.title")}
          content={t("home.textImage.1.description")}
          imgSrc="/images/undraw_wallet_aym5.svg"
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
    </>
  );
}
