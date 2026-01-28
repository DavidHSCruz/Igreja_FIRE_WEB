import { FaHistory, FaGlobeAmericas, FaQuoteLeft } from "react-icons/fa";
import LeaoIcon from "../assets/leao.svg?react"
import CoroaIcon from "../assets/coroa.svg?react"

export const Historia = () => {
  return (
    <main className="bg-[#0F0F0F] text-gray-100 font-montserrat min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Header Section */}
        <header className="text-center mb-20 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
          <div className="inline-block p-3 rounded-full bg-red-600/10 my-4">
            <CoroaIcon className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">
            Nossa <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">História</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Conheça a trajetória de fé e avivamento que moldou a Igreja Fire.
            Uma comunidade apaixonada pela presença de Deus.
          </p>
        </header>

        {/* Section: Por que Fire? */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-24 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white border-l-4 border-red-600 pl-4">
              Por que FIRE?
            </h2>
            <p className="text-gray-300 leading-loose text-lg">
              Nosso ministério acredita na verdade contida em <span className="text-red-600 font-bold">Hebreus 12:29</span>, 
              de que nosso Deus é um fogo consumidor. Um fogo que não apenas queima todo o pecado, 
              mas que também faz nossos corações arderem por um avivamento que se manifesta das portas para fora de nossa igreja.
            </p>
            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/5 relative">
              <FaQuoteLeft className="text-red-600/20 text-4xl absolute top-4 left-4" />
              <p className="text-gray-400 italic pl-8 relative z-10">
                "Cremos que este fogo se alastrará pelas ruas, casas, bairros, cidades e abrirá uma porta de Salvação pela qual almas virão em arrependimento e viverão em novidade de vida."
              </p>
            </div>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl shadow-red-900/20 group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
            <img 
              src="/img/imagem4.jpg" 
              alt="Adoração na Igreja Fire" 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-6 left-6 z-20">
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                Identidade
              </span>
              <h3 className="text-2xl font-bold text-white">Fogo Consumidor</h3>
            </div>
          </div>
        </section>

        {/* Section: Timeline / História */}
        <section className="mb-24 relative">
          <div className="absolute left-1/2 -ml-0.5 w-0.5 h-full bg-gradient-to-b from-red-600/50 to-transparent hidden md:block"></div>
          
          <div className="space-y-12 md:space-y-24">
            
            {/* Marco 1 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <div className="order-1 md:w-5/12 text-right pr-0 md:pr-12 mb-8 md:mb-0">
                <div className="inline-flex items-center justify-end gap-2 mb-3">
                  <span className="text-red-600 font-bold text-lg">04 Fev 2017</span>
                  <FaHistory className="text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">O Início</h3>
                <p className="text-gray-400 leading-relaxed">
                  No dia 4 de fevereiro de 2017, respondendo ao chamado de Deus, nossa igreja teve início, 
                  destinada por Deus a tornar-se uma igreja relevante, saudável e crescente.
                </p>
              </div>
              <div className="z-20 flex items-center order-1 bg-[#0F0F0F] border-4 border-[#1a1a1a] rounded-full p-2 shadow-xl">
                <div className="w-4 h-4 bg-red-600 rounded-full"></div>
              </div>
              <div className="order-1 md:w-5/12 pl-0 md:pl-12">
                 <div className="h-64 rounded-xl overflow-hidden shadow-lg border border-white/5 group">
                    <img src="/img/imagem5.jpg" alt="Início da Igreja" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                 </div>
              </div>
            </div>

            {/* Marco 2 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
              <div className="order-2 md:order-1 md:w-5/12 pr-0 md:pr-12">
                 <div className="h-64 rounded-xl overflow-hidden shadow-lg border border-white/5 group">
                    <img src="/img/imagem6.jpg" alt="Crescimento" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                 </div>
              </div>
              <div className="z-20 flex items-center order-1 bg-[#0F0F0F] border-4 border-[#1a1a1a] rounded-full p-2 shadow-xl mb-8 md:mb-0">
                <div className="w-4 h-4 bg-red-600 rounded-full"></div>
              </div>
              <div className="order-1 md:order-2 md:w-5/12 text-left pl-0 md:pl-12">
                <div className="inline-flex items-center gap-2 mb-3">
                  <FaGlobeAmericas className="text-gray-500" />
                  <span className="text-red-600 font-bold text-lg">Expansão</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Primeiros Passos</h3>
                <p className="text-gray-400 leading-relaxed">
                  Depois de trabalhar com jovens por mais de 7 anos, os Pastores Israel e Daiane Nascimento 
                  começaram uma pequena “célula” no Bairro Borda do Campo. Após 3 meses já haviam crescido 
                  para mais de 30 pessoas, necessitando de um lugar maior em apenas 5 meses.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Section: Visão e Cobertura */}
        <section className="bg-[#161616] rounded-3xl p-8 md:p-12 border border-white/5 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div>
               <h2 className="text-3xl font-bold text-white mb-6">Nossa Visão e Cobertura</h2>
               <div className="space-y-6">
                 <p className="text-gray-300 leading-relaxed">
                   Hoje somos uma igreja em constante crescimento, tendo como cobertura espiritual a 
                   <span className="text-white font-bold"> Comunidade Semear de Curitiba</span>, 
                   de onde temos aprendido constantemente o poder da honra e da unidade no reino de Deus.
                 </p>
                 <div className="bg-[#0F0F0F] p-5 rounded-lg border-l-4 border-red-500">
                    <p className="text-gray-400 text-sm italic mb-2">
                      "Não havendo visão o povo perece." - Provérbios 29:18
                    </p>
                    <p className="text-gray-300">
                      Buscamos ser integralmente obedientes à visão que nos foi confiada, abraçando-a de coração.
                    </p>
                 </div>
                 <p className="text-gray-300 leading-relaxed">
                   Nosso nome reflete nossa visão de avivamento que Deus irá derramar sobre todas as nações. 
                   Não apenas um avivamento que se reflete nos cultos, mas das portas para fora.
                 </p>
               </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 translate-y-8">
                   <div className="h-48 rounded-xl overflow-hidden shadow-lg">
                      <img src="/img/imagem7.jpg" alt="Visão" className="w-full h-full object-cover" />
                   </div>
                   <div className="h-32 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
                      <LeaoIcon className="w-12 text-red-600 animate-pulse" />
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="h-32 bg-[#252525] rounded-xl flex items-center justify-center border border-white/5">
                      <div className="text-center">
                        <span className="block text-3xl font-bold text-white">7+</span>
                        <span className="text-xs text-gray-500 uppercase">Anos de História</span>
                      </div>
                   </div>
                   <div className="h-48 rounded-xl overflow-hidden shadow-lg">
                      <img src="/img/imagem4.jpg" alt="Comunidade" className="w-full h-full object-cover" />
                   </div>
                </div>
             </div>
          </div>
        </section>

      </div>
      
      {/* Styles for simple animations */}
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
  );
};

