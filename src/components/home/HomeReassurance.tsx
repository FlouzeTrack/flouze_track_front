import { BookCheck, EarthLock, Headset } from "lucide-react";
import { useTranslation } from "react-i18next";

export function HomeReassurance() {
  const { t } = useTranslation();

  return (
    <div className="bg-card text-secondary-foreground py-8 px-4 rounded-3xl border border-gray-750 ">
      <div className="grid grid-cols-3 gap-8 text-center">
        <div className="flex flex-col items-center mx-4">
          <EarthLock width={40} height={40} />
          <h3 className="text-xl font-medium mt-4">
            {t("home.reassurance.security.title")}
          </h3>
          <p className="text-sm">
            {t("home.reassurance.security.description")}
          </p>
        </div>
        <div className="flex flex-col items-center mx-4">
          <Headset width={40} height={40} />
          <h3 className="text-xl font-medium mt-4">
            {t("home.reassurance.support.title")}
          </h3>
          <p className="text-sm">{t("home.reassurance.support.description")}</p>
        </div>
        <div className="flex flex-col items-center mx-4">
          <BookCheck width={40} height={40} />
          <h3 className="text-xl font-medium mt-4">
            {t("home.reassurance.trust.title")}
          </h3>
          <p className="text-sm">{t("home.reassurance.trust.description")}</p>
        </div>
      </div>
    </div>
  );
}
