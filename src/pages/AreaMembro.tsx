import { useState, useEffect } from 'react';
import { FaSearch, FaMusic, FaCamera, FaUser, FaRegClock } from "react-icons/fa"
import { BsChatSquareQuoteFill } from "react-icons/bs"
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

interface Verse {
  bookName: string;
  bookAuthor: string;
  chapter: number;
  number: number;
  text: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    membro?: {
      nome: string;
    }
  }
}

export const AreaMembro = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [dailyVerse, setDailyVerse] = useState<Verse | null>(null);

  useEffect(() => {
    async function fetchDailyVerse() {
      try {
        const response = await api.get('/bible/daily');
        setDailyVerse(response.data);
      } catch (error) {
        console.error("Erro ao buscar versículo:", error);
      }
    }
    fetchDailyVerse();
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await api.get('/posts');
        setPosts(response.data);
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-primary font-montserrat">
      <main className="w-5/6 m-auto grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 md:px-8 pb-8 pt-32">
        {/* Coluna Esquerda - Perfil */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-[#161616] rounded-xl flex flex-col items-center text-center overflow-hidden border border-white/5">
             {/* Cabeçalho Vermelho */}
             <div className="w-full h-24 bg-secondary relative">
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-[#161616]">
                   <FaUser className="text-4xl text-black" />
                </div>
             </div>
             
             <div className="pt-12 pb-6 px-6 w-full">
                <h2 className="text-lg font-bold text-white">{user?.membro?.nome || user?.email || 'Usuário'}</h2>
                <p className="text-[10px] text-gray-400 mb-4 uppercase tracking-wide">{user?.systemRole || 'Visitante'}</p>
                
                <div className="w-full h-px bg-white/10 mb-4"></div>
                
                <h3 className="text-gray-300 text-sm mb-4">Atividades</h3>
                
                <div className="space-y-3 mb-6">
                   <button className="w-full bg-[#252525] hover:bg-[#303030] py-3 px-4 rounded-xl flex items-center gap-4 transition-all group">
                      <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                         <FaMusic className="text-sm" />
                      </div>
                      <span className="text-[10px] font-bold uppercase text-gray-300">Louvor</span>
                   </button>
                   
                   <button className="w-full bg-[#252525] hover:bg-[#303030] py-3 px-4 rounded-xl flex items-center gap-4 transition-all group">
                      <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                         <FaCamera className="text-sm" />
                      </div>
                      <span className="text-[10px] font-bold uppercase text-gray-300">Comunicação</span>
                   </button>
                </div>
                
                <div className="w-full h-px bg-white/10 mb-4"></div>
                
                <Link 
                  to="/areamembro/profile"
                  className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-wider"
                >View Profile
                </Link>
             </div>
          </div>

          <div className="bg-[#161616] rounded-xl p-6 border border-white/5">
            <h3 className="text-sm text-gray-300 mb-4 pb-2 border-b border-white/10">Sugestões</h3>
            <div className="bg-[#252525] rounded-lg p-3">
               <h4 className="font-bold text-xs text-gray-300 mb-1 border-b border-white/10 pb-1 inline-block">Bíblia em 365 dias</h4>
               <p className="text-[10px] text-gray-500 mt-1">Pequena descrição à respeito do plano de leitura..</p>
            </div>
          </div>
        </aside>

        {/* Coluna Central - Conteúdo Principal */}
        <section className="lg:col-span-6 space-y-6">
           {/* Barra de Busca */}
           <div className="bg-[#161616] rounded-xl p-4 flex items-center gap-3 border border-white/5 h-14">
              <FaSearch className="text-gray-500 text-lg ml-1" />
           </div>

          {/* Versículo do Dia */}
          <div className="bg-[#161616] rounded-xl p-6 border border-white/5">
            <div className="mb-4">
              <h3 className="text-sm text-gray-300 pb-2 border-b border-white/10">Versículo do dia</h3>
            </div>
            <div className="px-2 py-2">
               {dailyVerse ? (
                 <>
                   <p className="text-gray-300 text-sm leading-relaxed font-medium italic">
                     "{dailyVerse.text}"
                   </p>
                   <p className="text-right text-xs text-gray-400 mt-4 font-bold">
                     {dailyVerse.bookName} {dailyVerse.chapter}:{dailyVerse.number}
                   </p>
                 </>
               ) : (
                 <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                 </div>
               )}
            </div>
          </div>

          {/* Feed / Comunicação */}
          <div className="space-y-4">
             {posts.map(post => (
                <div key={post.id} className="bg-[#161616] rounded-xl p-6 border border-white/5 flex flex-col justify-between">
                   <div>
                      <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                            <FaUser className="text-black text-xl" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm">{post.title}</h4>
                            <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                <FaRegClock className="text-[10px]" /> {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-4">
                        {post.content}
                      </p>
                   </div>
                   
                   <div className="w-full h-px bg-white/10 mt-auto mb-4"></div>
                   
                   <div className="flex gap-6 text-xs text-gray-500">
                      <button className="flex items-center gap-2 hover:text-white transition-colors">
                         <BsChatSquareQuoteFill className="text-sm" /> Comentarios
                      </button>
                   </div>
                </div>
             ))}
             {posts.length === 0 && (
                <div className="bg-[#161616] rounded-xl p-6 border border-white/5 text-center text-gray-500 min-h-[100px] flex items-center justify-center">
                  <p>Nenhum post disponível no momento.</p>
                </div>
             )}
          </div>
        </section>

        {/* Coluna Direita - Agenda e Planos */}
        <aside className="lg:col-span-3 space-y-6">
           {/* Planos de Leitura */}
          <div className="bg-[#161616] rounded-xl p-6 border border-white/5">
            <div className="mb-4">
              <h3 className="text-sm text-gray-300 pb-2 border-b border-white/10">Planos de leitura</h3>
            </div>
            
            <div className="space-y-3">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="bg-[#252525] p-3 rounded-sm hover:bg-[#303030] transition-colors cursor-pointer">
                    <h4 className="font-bold text-xs text-gray-300 mb-1 border-b border-white/10 pb-1 inline-block">Bíblia em 365 dias</h4>
                    <p className="text-[10px] text-gray-500 mt-1">Pequena descrição à respeito do plano de leitura...</p>
                </div>
              ))}
            </div>
          </div>

          {/* Minha Agenda */}
          <div className="bg-[#161616] rounded-xl p-6 border border-white/5">
            <div className="mb-4">
              <h3 className="text-sm text-gray-300 pb-2 border-b border-white/10">Minha agenda</h3>
            </div>

            <div className="space-y-3">
              {[
                { day: '12', title: 'Louvor', desc: 'Ensaio às 20h na igreja' },
                { day: '20', title: 'Comunicação', desc: 'Reunião às 20h na igreja' },
                { day: '29', title: 'NEXT', desc: 'Às 20h na igreja' }
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-center bg-[#252525] p-2 rounded-sm hover:bg-[#303030] transition-colors cursor-pointer">
                  <div className="bg-white text-black w-12 h-12 flex items-center justify-center flex-shrink-0 rounded-sm">
                    <span className="text-2xl font-bold text-[#161616]">{item.day}</span>
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-xs text-white truncate border-b border-white/10 pb-1 mb-1 inline-block">{item.title}</h4>
                    <p className="text-[10px] text-gray-400 truncate">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
