import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaUsers, FaBible, FaHeart, FaHome, FaSearch, FaArrowRight } from "react-icons/fa";

const IMAGES = [
  "/img/celulas/gr1.jpeg",
  "/img/celulas/gr2.jpeg",
  "/img/celulas/gr3.jpeg",
  "/img/celulas/gr4.jpeg",
];

export const Grs = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % IMAGES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-[#0F0F0F] text-gray-100 font-montserrat min-h-screen pt-52 pb-16">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Header Section */}
        <header className="text-center mb-20 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
          <div className="inline-block p-3 rounded-full bg-red-600/10 mb-4">
            <FaUsers className="text-4xl text-red-600" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">
            GR's <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Fire</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-light text-gray-300 mb-6">
            Grupos de Relacionamento
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Muito mais do que simples encontros semanais. É onde a igreja acontece casa a casa.
          </p>
        </header>

        {/* Benefits Section */}
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <div className="bg-[#161616] p-6 rounded-2xl border border-white/5 hover:border-red-600/50 transition-colors group">
            <div className="w-12 h-12 bg-red-600/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-600/20 transition-colors">
              <FaUsers className="text-2xl text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Comunhão</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Crie laços de amizade verdadeiros e compartilhe suas experiências de vida cristã.
            </p>
          </div>

          <div className="bg-[#161616] p-6 rounded-2xl border border-white/5 hover:border-red-600/50 transition-colors group">
            <div className="w-12 h-12 bg-red-600/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-600/20 transition-colors">
              <FaBible className="text-2xl text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Palavra</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Estudo bíblico, oração e reflexão sobre temas relevantes para o seu crescimento.
            </p>
          </div>

          <div className="bg-[#161616] p-6 rounded-2xl border border-white/5 hover:border-red-600/50 transition-colors group">
            <div className="w-12 h-12 bg-red-600/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-600/20 transition-colors">
              <FaHeart className="text-2xl text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Apoio</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Suporte, encorajamento e direção para enfrentar as dificuldades com fé.
            </p>
          </div>

          <div className="bg-[#161616] p-6 rounded-2xl border border-white/5 hover:border-red-600/50 transition-colors group">
            <div className="w-12 h-12 bg-red-600/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-600/20 transition-colors">
              <FaHome className="text-2xl text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Acolhimento</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Um ambiente seguro onde você pode se expressar livremente e ser ouvido.
            </p>
          </div>
        </section>

        {/* Content & Images Section */}
        <section className="mb-24">
          <div className="bg-[#161616] rounded-3xl overflow-hidden border border-white/5">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                <div className="flex items-center gap-3 mb-6">
                  <FaSearch className="text-red-600 text-xl" />
                  <h3 className="text-2xl font-bold text-white">Como encontrar um GR?</h3>
                </div>
                <p className="text-gray-300 leading-loose mb-8">
                  A melhor forma de encontrar um grupo é verificar os encontros disponíveis na sua igreja ou em nosso site.
                  Muitos grupos são organizados por faixa etária (jovens, casais, mulheres, homens) ou por temas específicos.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-gray-400">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span>Crescimento Espiritual</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-400">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span>Conexão com irmãos na fé</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-400">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span>Vida em comunidade</span>
                  </div>
                </div>
              </div>
              <div className="relative h-[400px] md:h-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-[#161616] to-transparent z-10 md:w-20 hidden md:block"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#161616] to-transparent z-10 md:hidden"></div>
                <div className="relative w-full h-full">
                  {IMAGES.map((img, index) => (
                    <img 
                      key={img}
                      src={img} 
                      alt="Grupo de Relacionamento" 
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ))}
                  
                  {/* Dots Navigation */}
                  <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
                    {IMAGES.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 w-2 hover:bg-white/80'
                        }`}
                        aria-label={`Imagem ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
          <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Faça parte de uma família!
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Se você deseja crescer espiritualmente e viver uma vida cristã mais conectada, um GR é o lugar perfeito para você.
              </p>
              <Link 
                to='/grs'
                className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                Encontrar um GR
                <FaArrowRight />
              </Link>
              <p className="mt-4 text-white/60 text-sm font-medium uppercase tracking-wider">
                (Em breve disponível)
              </p>
            </div>
          </div>
        </section>

      </div>
      
      {/* Styles for animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </main>
  )
}
