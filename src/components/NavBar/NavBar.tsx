import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "../../assets/LOGO_FIRE.svg?react";
import { PopUpDOE } from "../PopUpDOE/PopUpDOE";
import { CgProfile } from "react-icons/cg";
import { useAuth } from "../../contexts/AuthContext";

export const NavBar = () => {
  const [visible, setVisible] = useState(true);
  const [doeVisible, setDoeVisible] = useState(false);
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
      className={`flex items-center h-28 bg-primary shadow-lg fixed ${
        visible ? "top-0" : "-top-28"
      } transition-all left-0 w-full z-50`}
    >
      <Link to={isMemberArea ? "/areamembro" : "/"} className="flex items-center gap-[5px]">
        <Logo className="w-24 ml-10 z-10 text-secondary -translate-y-1" />
        {isMemberArea && (
            <span className="flex h-[50px] bg-quinary text-primary font-medium px-2 rounded-md items-center">
              <p className="text-2xl opacity-75 -translate-y-[1px]">SOCIAL</p>
            </span>
          )
        }
      </Link>
      <nav className="w-full flex ml-10 justify-between items-center pr-10">
        {!isMemberArea && (
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
        )}
        
        {isMemberArea && <div className="flex-1"></div>}

        {isMemberArea && isAuthenticated && (
          <div className="relative mx-4">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="text-quaternary hover:text-white transition-colors flex items-center"
            >
              <CgProfile size={32} />
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
                  onClick={() => { logout(); setProfileOpen(false); }} 
                  className="block w-full text-left px-4 py-2 text-sm text-quaternary hover:bg-zinc-800 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        <Link 
          to={isMemberArea ? "/" : "/areamembro"} 
          className="bg-quaternary text-primary px-6 py-2 rounded-lg font-bold text-sm hover:bg-zinc-800 transition-all"
        >
            {isMemberArea ? "SITE DA IGREJA" : "ÁREA DO MEMBRO"}
        </Link>
      </nav>
    </header>
  );
};
