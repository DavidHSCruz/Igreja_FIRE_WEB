import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "../../assets/LOGO_FIRE.svg?react";
import { PopUpDOE } from "../PopUpDOE/PopUpDOE";

import { SlMenu } from "react-icons/sl"
import { CgClose, CgProfile } from "react-icons/cg"
import { useAuth } from "../../contexts/AuthContext";

export const NavBarMobile = () => {
  const [visible, setVisible] = useState(true);
  const [doeVisible, setDoeVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { pathname } = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const isMemberArea = pathname.startsWith('/areamembro');

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 200 || currentScrollY < lastScrollY) {
        setVisible(true);
      } else {
        setVisible(false);
        setDoeVisible(false);
        setMenuOpen(false);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mapping for standard navigation items
  const routes: Record<string, string> = {
    "HOME": "/",
    "NOSSA HISTÓRIA": "/historia",
    "GR's": "/grs",
  };

  // Given a label, return the corresponding route.
  function getRoute(nav: string) {
    return routes[nav.toUpperCase()] || `/${nav.toLowerCase().replace(/'/g, "")}`;
  }

  // Check if the current path matches the nav item path.
  function isActive(nav: string) {
    return pathname === getRoute(nav) ? "font-medium border-b-2" : "";
  }

  return (
    <header
      className={`bg-primary fixed top-0 left-0 w-full z-50 shadow-lg transition-all ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 transition-transform">
        <Logo className="w-20 h-full text-secondary" />
        <div className="flex items-center gap-4">
          {isMemberArea && isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="text-quaternary hover:text-white transition-colors flex items-center"
              >
                <CgProfile size={28} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-primary border border-quaternary rounded-lg shadow-xl py-2 z-50">
                  <Link
                    to="/areamembro/profile"
                    className="block px-4 py-2 text-sm text-quaternary hover:bg-zinc-800 transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/areamembro/configuracoes"
                    className="block px-4 py-2 text-sm text-quaternary hover:bg-zinc-800 transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    Configurações
                  </Link>
                  <div className="border-t border-quaternary opacity-20 my-1"></div>
                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-quaternary hover:bg-zinc-800 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="focus:outline-none"
          >
            <div className="relative w-6 h-6">
              <SlMenu
                className={`absolute w-6 h-6 transition-transform duration-300 ease-in-out ${
                  menuOpen
                    ? "rotate-90 scale-75 opacity-0"
                    : "rotate-0 scale-100 opacity-100"
                }`}
              />
              <CgClose
                className={`absolute w-6 h-6 transition-transform duration-300 ease-in-out ${
                  menuOpen
                    ? "rotate-0 scale-130 opacity-100"
                    : "rotate-90 scale-75 opacity-0"
                }`}
              />
            </div>
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="bg-primary">
          <ul className="flex flex-col items-center">
            {Object.keys(routes).map((nav, i) => (
              <li
                key={i}
                className={`${isActive(nav)} py-2 w-full text-center border-b border-quaternary`}
              >
                <Link
                  className="block w-full"
                  to={getRoute(nav)}
                  onClick={() => setMenuOpen(false)}
                >
                  {nav}
                </Link>
              </li>
            ))}
            <li className="relative py-2 w-full text-center border-b border-quaternary">
              <button
                className="w-full"
                onClick={() => setDoeVisible(!doeVisible)}
              >
                DOE
              </button>
              <PopUpDOE visible={doeVisible} setVisible={setDoeVisible} />
            </li>
            <li className="py-2 w-full text-center border-b border-quaternary bg-quaternary/90">
              <Link
                to="/areamembro"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-primary font-bold"
              >
                ÁREA DO MEMBRO
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};
