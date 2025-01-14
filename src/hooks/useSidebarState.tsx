import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 7; // days

export const useSidebarState = () => {
  const [isOpen, setIsOpen] = useState(() => {
    const cookieValue = Cookies.get(SIDEBAR_COOKIE_NAME);
    return cookieValue !== "false";
  });

  useEffect(() => {
    Cookies.set(SIDEBAR_COOKIE_NAME, String(isOpen), {
      expires: SIDEBAR_COOKIE_MAX_AGE,
      sameSite: "strict",
    });
  }, [isOpen]);

  return [isOpen, setIsOpen] as const;
};
