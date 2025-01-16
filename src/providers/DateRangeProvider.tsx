import { createContext, useContext, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { useLocation, useNavigate } from "react-router-dom";
import { format, subMonths } from "date-fns";

interface DateRangeContextType {
  dateRange: DateRange;
  updateDateRange: (range: DateRange) => void;
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(
  undefined
);
export function DateRangeProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getStoredDates = (): Required<DateRange> => {
    const storedStartDate = localStorage.getItem("lastStartDate");
    const storedEndDate = localStorage.getItem("lastEndDate");

    if (storedStartDate && storedEndDate) {
      return {
        from: new Date(storedStartDate),
        to: new Date(storedEndDate),
      };
    }

    return {
      from: subMonths(new Date(), 1),
      to: new Date(),
    };
  };

  const currentDateRange: Required<DateRange> = getStoredDates();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (!params.has("startDate") || !params.has("endDate")) {
      params.set("startDate", format(currentDateRange.from, "yyyy-MM-dd"));
      params.set("endDate", format(currentDateRange.to, "yyyy-MM-dd"));

      navigate(
        {
          pathname: location.pathname,
          search: params.toString(),
        },
        { replace: true }
      );
    }
  }, [location.pathname]);

  const updateDateRange = (range: DateRange) => {
    // Ensure both dates exist
    if (!range.from || !range.to) return;

    // Store dates
    localStorage.setItem("lastStartDate", range.from.toISOString());
    localStorage.setItem("lastEndDate", range.to.toISOString());

    // Update URL
    const params = new URLSearchParams(location.search);
    params.set("startDate", format(range.from, "yyyy-MM-dd"));
    params.set("endDate", format(range.to, "yyyy-MM-dd"));

    navigate(
      {
        pathname: location.pathname,
        search: params.toString(),
      },
      { replace: true }
    );
  };

  return (
    <DateRangeContext.Provider
      value={{
        dateRange: currentDateRange,
        updateDateRange,
      }}
    >
      {children}
    </DateRangeContext.Provider>
  );
}

export const useDateRange = () => {
  const context = useContext(DateRangeContext);
  if (context === undefined) {
    throw new Error("useDateRange must be used within a DateRangeProvider");
  }
  return context;
};
