import {
  Routes,
  Route,
  BrowserRouter,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";

import { NavBar } from "./shared/components/NavBar/NavBar";
import { NavBarMobile } from "./shared/components/NavBarMobile/NavBarMobile";
import { Footer } from "./shared/components/Footer/Footer";

import { Home } from "./pages/home";
import { Historia } from "./pages/historia";
import { Grs } from "./pages/grs";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function SelectNavBar(setWidth: (width: number) => void) {
  useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [setWidth]);
}

function App() {
  const [width, setWidth] = useState(window.innerWidth);

  SelectNavBar(setWidth);

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <AppContent width={width} />
      </BrowserRouter>
    </>
  );
}

function ExternalRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.assign(to);
  }, [to]);

  return null;
}

function AppContent({ width }: { width: number }) {
  const socialUrl =
    (import.meta.env.VITE_SOCIAL_URL as string | undefined) ||
    "http://localhost:5174/";

  return (
    <>
      {width >= 768 ? <NavBar /> : <NavBarMobile />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/historia" element={<Historia />} />
        <Route path="/grs" element={<Grs />} />
        <Route
          path="/areamembro/*"
          element={<ExternalRedirect to={socialUrl} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
