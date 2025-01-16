import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { items } from "@/components/ui/AppSidebar";
import { cn } from "@/lib/utils";
import { Fragment } from "react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { LanguageToggle } from "../ui/LanguageToggle";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { useDateRange } from "@/providers/DateRangeProvider";

export function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const pathname = location.pathname;
  const segments = pathname?.split("/").filter(Boolean) || [];

  const isRoot = pathname === "/";
  const homeItem = items.find((item) => item.url === "/");
  const { dateRange, updateDateRange } = useDateRange();

  const getBreadcrumbTitleAndIcon = (segment: string, index: number) => {
    if (!isNaN(Number(segment))) {
      return { title: segment, icon: undefined };
    }

    const currentUrl = `/${segments.slice(0, index + 1).join("/")}`;

    const segmentTranslations: Record<string, string> = {
      dashboard: t("common.dashboard"),
      wallet: t("common.wallet"),
      profile: t("common.profile"),
    };

    const flatMenu = items.flatMap((item) => [
      { title: t(item.title), url: item.url, icon: item.icon },
      ...(item.submenu?.map((sub) => ({
        title: t(sub.title),
        url: sub.url,
      })) || []),
    ]);

    const match = flatMenu.find((item) => item.url === currentUrl);
    if (match) {
      return {
        title: match.title,
        icon: "icon" in match ? match.icon : undefined,
      };
    }

    // Add fallback return for non-matched cases
    return {
      title:
        segmentTranslations[segment] ||
        segment.charAt(0).toUpperCase() + segment.slice(1),
      icon: undefined,
    };
  };

  return (
    <header
      className={cn(
        "sticky top-0 right-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background",
        "transition-[margin] duration-200 ease-linear"
      )}
    >
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex items-center justify-between w-full">
        <Breadcrumb>
          <BreadcrumbList>
            {isRoot && homeItem && (
              <BreadcrumbItem>
                <Link
                  to="/"
                  className={cn(
                    "flex items-center gap-2",
                    isRoot && "text-foreground font-medium"
                  )}
                  aria-current={isRoot ? "page" : undefined}
                >
                  {homeItem.icon && <homeItem.icon className="h-4 w-4" />}
                  <span>{t(homeItem.title)}</span>
                </Link>
              </BreadcrumbItem>
            )}

            {segments.map((segment, index) => {
              const href = `/${segments.slice(0, index + 1).join("/")}`;
              const isLast = index === segments.length - 1;
              const { title, icon: Icon } = getBreadcrumbTitleAndIcon(
                segment,
                index
              );

              return (
                <Fragment key={segment}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="flex items-center gap-2">
                        {Icon && <Icon className="h-4 w-4" />}
                        {title}
                      </BreadcrumbPage>
                    ) : (
                      <Link
                        to={href}
                        className="flex items-center gap-2"
                        aria-current={false}
                      >
                        {Icon && <Icon className="h-4 w-4" />}
                        {title}
                      </Link>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-2">
          <DateRangePicker
            initialDateRange={dateRange}
            onDateChange={updateDateRange}
          />
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
