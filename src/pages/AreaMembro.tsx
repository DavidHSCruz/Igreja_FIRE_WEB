import { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import { PostList, Post } from '../components/PostList/PostList';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { MemberProfileCard } from '../components/MemberProfileCard/MemberProfileCard';
import { MyScales } from '../components/MyScales/MyScales';
import { AvailableScales } from '../components/AvailableScales/AvailableScales';

interface Verse {
  bookName: string;
  bookAuthor: string;
  chapter: number;
  number: number;
  text: string;
}

export const AreaMembro = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [dailyVerse, setDailyVerse] = useState<Verse | null>(null);
  const { user, refreshUser } = useAuth(); // Add refreshUser from context
  const [refreshTrigger, setRefreshTrigger] = useState(0); // State to trigger re-renders/fetches

  const handleUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
    if (refreshUser) refreshUser(); // Refresh user data (including MyScales)
  };

  useEffect(() => {
    async function fetchDailyVerse() {
      try {
        const response = await api.get('/bible/daily');
        setDailyVerse(response.data);
      } catch (error) {
        console.error("Erro ao buscar versículo:", error);
      }
    }

    async function fetchPosts() {
      try {
        const response = await api.get('/posts');
        setPosts(response.data);
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
      }
    }
    
    fetchDailyVerse();
    fetchPosts();
  }, [refreshTrigger]); // Re-fetch when trigger changes

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-primary font-montserrat">
      <main className="w-5/6 m-auto grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 md:px-8 pb-8 pt-32">
        <aside className="lg:col-span-3 space-y-6">
          <MemberProfileCard user={user} />

          <MyScales scales={user?.membro?.escalas || []} onUpdate={handleUpdate} />
          
          {/* Pass handleUpdate to refresh everything when user joins a scale */}
          <AvailableScales key={refreshTrigger} onUpdate={handleUpdate} />
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
                  <p className="text-gray-500 text-xs italic">Carregando versículo...</p>
               )}
            </div>
          </div>

          {/* Feed / Comunicação */}
          <div className="space-y-4">
             <PostList posts={posts} />
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
