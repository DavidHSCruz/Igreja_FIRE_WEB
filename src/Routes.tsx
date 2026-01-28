import { Routes, Route, BrowserRouter, useLocation, Navigate } from 'react-router-dom'
import { useEffect, useState } from "react"

import { NavBar } from './components/NavBar/NavBar'
import { NavBarMobile } from './components/NavBarMobile/NavBarMobile'
import { Footer } from './components/Footer/Footer'

import { Home } from './pages/Home'
import { Historia } from './pages/Historia'
import { Grs } from './pages/Grs'
import { AreaMembro } from './pages/AreaMembro'
import { Profile } from './pages/Profile'
import { LoginMembro } from './pages/LoginMembro'
import { AreaMinisterioPage } from './pages/AreaMinisterioPage'
import { useAuth } from './contexts/AuthContext'
import { MinhaIgreja } from './pages/MinhaIgreja'


function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function SelectNavBar(setWidth: (width: number) => void) {
  useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth)
    window.addEventListener("resize", handleWindowResize)
    return () => window.removeEventListener("resize", handleWindowResize)
  }, [setWidth])
}

function App() {
  const [width, setWidth] = useState(window.innerWidth)

  SelectNavBar(setWidth)

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <AppContent width={width} />
      </BrowserRouter>
    </>
  )
}

function AppContent({ width }: { width: number }) {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const isMemberArea = pathname.startsWith('/areamembro')

  const allowedRolesMinhaIgreja = ['PASTOR', 'DIACONO', 'ADMIN'];
  const hasMinhaIgrejaAccess = user?.systemRole && allowedRolesMinhaIgreja.includes(user.systemRole);

  function RequireAuth({ children }: { children: JSX.Element }) {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
      return null
    }

    if (!isAuthenticated) {
      return <Navigate to="/areamembro/login" replace />
    }

    return children
  }

  return (
    <>
      {width >= 768 ? <NavBar /> : (!isMemberArea && <NavBarMobile />)}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/historia" element={<Historia />} />
        <Route path="/grs" element={<Grs />} />
        <Route
          path="/areamembro"
          element={(
            <RequireAuth>
              <AreaMembro />
            </RequireAuth>
          )}
        />
        <Route path="/areamembro/login" element={<LoginMembro />} />
        <Route path="/areamembro/profile" element={
            <RequireAuth>
              {!user?.membro ? <Navigate to="/areamembro" replace />
              :
                <Profile />
              }
            </RequireAuth>
        } />
        <Route path="/areamembro/minha-igreja" element={
            <RequireAuth>
              {hasMinhaIgrejaAccess ? <MinhaIgreja /> : <Navigate to="/areamembro" replace />}
            </RequireAuth>
        } />
        <Route path="/areamembro/details/:type/:id" element={
            <RequireAuth>
              <AreaMinisterioPage />
            </RequireAuth>
        } />
        <Route path="/areamembro/configuracoes" element={
            <RequireAuth>
              <div className="pt-32 px-8 text-quaternary text-center">
                <h1 className="text-3xl font-bold">Configurações</h1>
                <p className="mt-4">Em construção...</p>
              </div>
            </RequireAuth>
        } />
      </Routes>
      {!isMemberArea && <Footer />}
    </>
  )
}

export default App
