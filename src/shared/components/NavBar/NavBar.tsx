import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "../../../assets/LOGO_FIRE.svg?react";
import { PopUpDOE } from "../PopUpDOE/PopUpDOE";

export const NavBar = () => {
  const [visible, setVisible] = useState(true);
  const [doeVisible, setDoeVisible] = useState(false);
  const { pathname } = useLocation();
  const socialUrl = (import.meta.env.VITE_SOCIAL_URL as string | undefined) || "http://localhost:5174/";

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 200 || currentScrollY < lastScrollY) {
        setVisible(true);
      } else {
        setVisible(false);
        setDoeVisible(false);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mapping for standard navigation items
  const routes: Record<string, string> = {
    HOME: "/",
    "NOSSA HISTÓRIA": "/historia",
    "GR's": "/grs",
  };

  // Given a label, return the corresponding route.
  function getRoute(nav: string) {
    return (
      routes[nav.toUpperCase()] || `/${nav.toLowerCase().replace(/'/g, "")}`
    );
  }

  // Check if the current path matches the nav item path.
  function isActive(nav: string) {
    return pathname === getRoute(nav) ? "font-medium border-b-2" : "";
  }

  return (
    <header
      className={`flex items-center h-28 bg-primary shadow-lg fixed ${
        visible ? "top-0" : "-top-28"
      } transition-all left-0 w-full z-50`}
    >
      <Link to="/" className="flex items-center gap-[5px]" aria-label="Igreja Fire">
        <Logo className="w-24 ml-10 z-10 text-secondary -translate-y-1" />
      </Link>
      <nav className="w-full flex ml-10 justify-between items-center pr-10">
        <ul className="flex items-center">
          {Object.keys(routes).map((nav, i) => (
            <li
              key={i}
              className={`${isActive(nav)} mx-4 hover:font-medium hover:border-b-2 border-quaternary border-opacity-10 text-quaternary`}
            >
              <Link to={getRoute(nav)}>{nav}</Link>
            </li>
          ))}
          <li className="relative">
            <button
              className="mx-4 hover:font-medium hover:border-b-2 border-quaternary border-opacity-10 text-quaternary"
              onClick={() => setDoeVisible(!doeVisible)}
            >
              DOE
            </button>
            <PopUpDOE visible={doeVisible} setVisible={setDoeVisible} />
          </li>
        </ul>

        <a
          href={socialUrl}
          className="bg-quaternary/90 text-primary px-6 py-2 rounded-lg font-bold text-sm hover:bg-red-600 transition-all"
        >
          ÁREA DO MEMBRO
        </a>
      </nav>
    </header>
  );
};
