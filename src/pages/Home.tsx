import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaPrayingHands, FaHeart } from "react-icons/fa";
import { Banner } from "../components/Banner/Banner";
import { Formulario } from "../components/Formulario/Formulario";
import { CardClick } from "../components/Banner/Card/CardClick/CardClick";

export const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      badge: "BEM-VINDO À IGREJA FIRE",
      title: (
        <>
          Somos Um, <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Somos FIRE</span>
        </>
      ),
      description: "Uma igreja viva, apaixonada por Jesus e comprometida em transformar vidas através do amor e da comunhão.",
      image: "/img/imagem7.jpg",
      buttons: (
        <>
            <Link 
              to="/historia" 
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-red-600/20 flex items-center gap-2 justify-center"
            >
              Conheça Nossa História <FaArrowRight />
            </Link>
            <Link 
              to="/grs" 
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-full font-bold transition-all flex items-center gap-2 justify-center"
            >
              Encontre um GR
            </Link>
        </>
      )
    },
    {
      id: 2,
      badge: "TEMA DO ANO",
      title: (
        <>
          2026: O Ano de <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Resgatar Identidade</span>
        </>
      ),
      description: "Um tempo de voltar à essência, fortalecer nossos fundamentos e viver plenamente o propósito de Deus para nós.",
      image: "/img/temadoano.png",
      buttons: (
         <Link 
            to="/historia" 
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-red-600/20 flex items-center gap-2 justify-center"
          >
            Saiba Mais <FaArrowRight />
          </Link>
      )
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <main className="bg-[#09090B] text-gray-100 font-montserrat min-h-screen">
      
      {/* Hero Section with Carousel */}
      <section className="relative h-dvh min-h-[600px] flex items-center bg-[#09090B]">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full z-0">
            <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-red-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-red-600/5 blur-[120px] rounded-full"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 h-full flex items-center">
            {slides.map((slide, index) => (
                <div 
                    key={slide.id}
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}
                >
                    <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <div className={`text-left space-y-6 ${index === currentSlide ? 'animate-fade-in-up' : ''}`}>
                             <span className="inline-block py-1 px-3 rounded-full bg-red-600/20 text-red-500 text-sm font-bold tracking-wider">
                                {slide.badge}
                              </span>
                              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
                                {slide.title}
                              </h1>
                              <p className="text-xl text-gray-300 max-w-xl leading-relaxed">
                                {slide.description}
                              </p>
                              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                {slide.buttons}
                              </div>
                        </div>

                        {/* Image Card */}
                        <div className={`relative hidden lg:block ${index === currentSlide ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '0.2s' }}>
                            <div className="relative flex items-center z-10 rounded-2xl overflow-hidden shadow-2xl border border-white/10 transform -translate-y-0 hover:-translate-y-2 transition-transform duration-500 max-h-[600px]">
                                <img 
                                    src={slide.image} 
                                    alt="Slide Image" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>
                            {/* Card Decorative Backdrop */}
                            <div className="absolute -inset-4 bg-red-600/20 blur-2xl -z-10 rounded-full"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
            {slides.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-red-600 w-8' : 'bg-white/30 hover:bg-white/50'}`}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>
      </section>

      {/* Banner Section (About) */}
      <div className="relative z-20">
        <Banner />
      </div>

      {/* Welcome & Form Section */}
      <section className="py-24 bg-[#0F0F0F] relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-red-600/5 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-600/5 blur-3xl rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Welcome Text */}
            <div className="space-y-8 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 text-red-500 font-bold uppercase tracking-wider">
                <div className="w-8 h-[2px] bg-red-500"></div>
                Boas-vindas
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Estamos de portas abertas para <span className="text-red-500">você</span>.
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                Não importa sua história, sua origem ou seu momento atual. Na Igreja Fire, acreditamos que Jesus Cristo tem um propósito especial para sua vida. 
                Queremos caminhar junto com você nessa jornada de fé e descoberta.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 pt-4">
                <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5">
                  <FaPrayingHands className="text-3xl text-red-500 mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">Vida de Oração</h4>
                  <p className="text-sm text-gray-400">Buscamos a Deus intensamente em tudo o que fazemos.</p>
                </div>
                <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5">
                  <FaHeart className="text-3xl text-red-500 mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">Comunhão Real</h4>
                  <p className="text-sm text-gray-400">Relacionamentos verdadeiros e apoio mútuo.</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="order-1 lg:order-2">
              <div className="bg-[#161616] p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-bl-full -mr-10 -mt-10"></div>
                
                <h3 className="text-2xl font-bold text-white mb-2">Faça sua Inscrição</h3>
                <p className="text-gray-400 mb-8 text-sm">Preencha seus dados para se conectar conosco.</p>
                
                <Formulario type='inscricao' />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Navigation Cards Section */}
      <section className="py-24 bg-[#09090B]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Explore Mais</h2>
            <div className="w-20 h-1 bg-red-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <CardClick bg='/img/imagem3.jpg' to='/historia'>
              <div className="text-center">
                <span className="block text-3xl font-bold mb-2">Nossa História</span>
                <span className="text-sm font-normal opacity-80 uppercase tracking-widest border-t border-white/30 pt-2 inline-block">Conheça nossa jornada</span>
              </div>
            </CardClick>
            <CardClick bg='/img/pessoas1.jpg' to='/grs'>
              <div className="text-center">
                <span className="block text-3xl font-bold mb-2">GR's</span>
                <span className="text-sm font-normal opacity-80 uppercase tracking-widest border-t border-white/30 pt-2 inline-block">Grupos de Relacionamento</span>
              </div>
            </CardClick>
          </div>
        </div>
      </section>

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
