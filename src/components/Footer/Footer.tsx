import { FaFacebook, FaYoutube, FaInstagram, FaEnvelope, FaPhone } from "react-icons/fa"
import { Link } from "react-router-dom"

export const Footer = () => {
  const informacoes: {
    email: string
    telefone: string
    sites: {
      youtube: { url: string; icon: JSX.Element }
      facebook: { url: string; icon: JSX.Element }
      instagram: { url: string; icon: JSX.Element }
    }
  } = {
    email: 'igrejafire@gmail.com',
    telefone: '(41) 99628-3603',
    sites: {
      youtube: {
        url: "https://www.youtube.com/@IgrejaFire",
        icon: <FaYoutube />,
      },
      facebook: {
        url: "https://web.facebook.com/IgrejaFire/",
        icon: <FaFacebook />,
      },
      instagram: {
        url: "https://www.instagram.com/igrejafireoficialsjp/",
        icon: <FaInstagram />,
      },
    },
  }
  
  return (
    <footer className="bg-[#0F0F0F] text-primary pt-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid md:grid-cols-3 gap-10 pb-10 border-b border-white/10">
          <div className="space-y-3">
            <h4 className="text-xl font-bold">Igreja Fire</h4>
            <p className="text-sm text-gray-300 opacity-90 max-w-xs">Uma igreja viva, apaixonada por Jesus e comprometida em transformar vidas.</p>
          </div>
          <div className="space-y-3">
            <h4 className="text-xl font-bold">Navegação</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/" className="hover:text-secondary transition-colors">Início</Link>
              <Link to="/historia" className="hover:text-secondary transition-colors">Nossa História</Link>
              <Link to="/grs" className="hover:text-secondary transition-colors">GR's</Link>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-xl font-bold">Contato</h4>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <FaEnvelope className="text-secondary" />
              <a href={`mailto:${informacoes.email}`} className="hover:text-secondary transition-colors">{informacoes.email}</a>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <FaPhone className="text-secondary" />
              <a href={`tel:${informacoes.telefone.replace(/\D/g, '')}`} className="hover:text-secondary transition-colors">{informacoes.telefone}</a>
            </div>
            <div className="flex items-center gap-3 mt-3">
              {Object.entries(informacoes.sites).map(([site, { url,icon }]) => (
                <Link 
                  key={site}
                  to={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors"
                >{icon}</Link>
              ))}
            </div>
          </div>
        </div>
        <div className="py-6 flex items-center justify-between text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Igreja Fire. Todos os direitos reservados.</p>
          <div className="w-24 h-[2px] bg-secondary rounded-full"></div>
        </div>
      </div>
    </footer>
  )
}

