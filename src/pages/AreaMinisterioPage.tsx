import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import {
  FaArrowLeft,
  FaSearch,
  FaUser,
  FaPlus,
  FaTimes,
} from 'react-icons/fa';
import { PostList } from '../components/PostList/PostList';
import { ScalesCarousel } from '../components/ScalesCarousel/ScalesCarousel';

interface Member {
  id: string;
  nome: string;
  atuacoes: Atuacao[];
}

interface Atuacao {
  id: string;
  membro: Member;
  papel: string;
  atividade: Atividade;
}

interface Atividade {
  id: string;
  name: string;
  description: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    membro: {
      nome: string;
    };
  };
}

interface Scale {
  id: string;
  data: string;
  evento: string;
  voluntarios: {
    membro: {
      id: string;
      nome: string;
    };
    status: 'PENDENTE' | 'CONFIRMADO' | 'RECUSADO';
  }[];
}

interface ActivityScales {
  activityId: string;
  scales: Scale[];
}

interface TeamData {
  id: string;
  name: string;
  description: string;
  atuacoes: Atuacao[];
  atividades: Atividade[];
}

export const AreaMinisterioPage = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<TeamData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [membros, setMembros] = useState<Member[]>([]);
  const [activityScales, setActivityScales] = useState<ActivityScales[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [newMemberId, setNewMemberId] = useState('');
  const [newActivityId, setNewActivityId] = useState('');
  const [newRole, setNewRole] = useState('VOLUNTARIO');

  const isLeader = user?.systemRole === 'ADMIN' || user?.systemRole === 'PASTOR' || 
      (type === 'area' && user?.membro?.areas?.some(a => a.id === id && a.papel === 'LIDER')) ||
      (type === 'ministerio' && user?.membro?.ministerios?.some(m => m.id === id && m.papel === 'LIDER'));

  const openAddMemberModal = async () => {
    setIsAddMemberModalOpen(true);
    try {
        const response = await api.get('/membros');
        // Filter out members already in the team
        const currentMemberIds = new Set(membros.map(m => m.id));
        setAllMembers(response.data.filter((m: Member) => !currentMemberIds.has(m.id)));
    } catch (error) {
        console.error("Error fetching all members:", error);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberId || !newActivityId) {
        alert("Selecione um membro e uma atividade.");
        return;
    }
    try {
        await api.post(`/membros/${newMemberId}/atuacoes`, {
            papel: newRole,
            atividadeId: newActivityId,
            [type === 'area' ? 'areaId' : 'ministerioId']: id
        });
        alert("Membro adicionado com sucesso!");
        setIsAddMemberModalOpen(false);
        setNewMemberId('');
        setNewActivityId('');
        setNewRole('VOLUNTARIO');
        window.location.reload();
    } catch (error: any) {
        console.error("Erro ao adicionar membro:", error);
        alert(error.response?.data?.message || "Erro ao adicionar membro.");
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const endpoint = type === 'area' ? `/areas/${id}` : `/ministerios/${id}`;
        const response = await api.get(endpoint);
        const teamData = response.data;
        setData(teamData);

        // Fetch posts and scales
        const postsReq = api.get(`/posts?${type === 'area' ? 'areaId' : 'ministerioId'}=${id}`)
            .catch(err => {
                console.error("Failed to fetch posts", err);
                return { data: [] };
            });

        // Fetch atividades by area or ministerio
        const atividadesReq = api.get(`/atividades?${type === 'area' ? 'areaId' : 'ministerioId'}=${id}`)
            .catch(err => {
                console.error("Failed to fetch atividades", err);
                return { data: [] };
            });

        // Fetch membros by area or ministerio
        const membrosReq = api.get(`/membros/by-area-ministerio/${id}`)
            .catch(err => {
                console.error("Failed to fetch membros", err);
                return { data: [] };
            });
        
        const scalesReqs = teamData.atividades?.map((act: Atividade) => 
            api.get(`/escalas?atividadeId=${act.id}`)
               .then(res => ({ activityId: act.id, scales: res.data }))
               .catch(() => ({ activityId: act.id, scales: [] }))
        ) || [];

        const [postsRes, atividadesRes, membrosRes, scalesRes] = await Promise.all([
            postsReq,
            atividadesReq,
            membrosReq,
            Promise.all(scalesReqs)
        ]);

        setPosts(postsRes.data);
        setActivityScales(scalesRes as ActivityScales[]);
        setAtividades(atividadesRes.data);
        setMembros(membrosRes.data);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    if (type && id) {
      fetchData();
    }
  }, [type, id]);

  if (loading) return <div className="min-h-screen bg-[#0F0F0F] text-white p-8 pt-32 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>;
  if (!data) return <div className="min-h-screen bg-[#0F0F0F] text-white p-8 pt-32 text-center">Não encontrado.</div>;

  const groupedScales = activityScales.reduce((acc, as) => {
    const activityName =
      data.atividades?.find((a) => a.id === as.activityId)?.name || 'Atividade';

    as.scales.forEach((scale) => {
      // Create a unique key for the event (Event Name + Date)
      // Using date string to group same day events together
      const dateKey = new Date(scale.data).toISOString().split('T')[0];
      const key = `${scale.evento}-${dateKey}`;

      if (!acc[key]) {
        acc[key] = {
          id: scale.id,
          evento: scale.evento,
          data: scale.data,
          items: [],
        };
      }

      // Add volunteers
      if (scale.voluntarios && scale.voluntarios.length > 0) {
        scale.voluntarios.forEach((vol) => {
          acc[key].items.push({
            name: vol.membro.nome,
            role: activityName,
            scaleId: scale.id,
            status: vol.status,
            membroId: vol.membro.id,
            isCurrentUser: user?.membro?.id === vol.membro.id
          });
        });
      } else {
        // Se não houver voluntários, adiciona item placeholder "Disponível"
         acc[key].items.push({
            name: "Disponível",
            role: activityName,
            scaleId: scale.id,
         });
      }
    });
    return acc;
  }, {} as Record<string, { id: string; evento: string; data: string; items: { name: string; role: string; scaleId?: string; status?: string; membroId?: string; isCurrentUser?: boolean }[] }>);

  const finalScales = Object.values(groupedScales).map((group) => {
    // Merge roles for the same person
    const personMap = new Map<string, { 
        name: string,
        roles: Set<string>, 
        scaleIds: Set<string>, 
        status?: string, 
        membroId?: string, 
        isCurrentUser?: boolean 
    }>();
    
    group.items.forEach((item) => {
       let key: string;
       if (item.name === "Disponível") {
           key = `Disponível-${item.scaleId}`;
       } else if (item.isCurrentUser) {
           // Separate by scaleId to allow individual actions for current user
           key = `${item.name}-${item.scaleId}`;
       } else {
           // Merge by name and status for others
           key = `${item.name}-${item.status}`;
       }
 
       if (!personMap.has(key)) {
         personMap.set(key, { 
             name: item.name,
             roles: new Set(), 
             scaleIds: new Set(),
             status: item.status,
             membroId: item.membroId,
             isCurrentUser: item.isCurrentUser
         });
       }
       personMap.get(key)!.roles.add(item.role); 
       if (item.scaleId) personMap.get(key)!.scaleIds.add(item.scaleId);
    });

    const mergedItems = Array.from(personMap.values()).map(
      (data) => {
        // If multiple scaleIds (merged item), use the first one or undefined if ambiguous?
        // For "Disponível" and "isCurrentUser", we ensured unique scaleId per item (mostly).
        // For others, we merged. If we merged, we might have multiple scaleIds.
        // ScaleCard expects a single scaleId.
        const scaleId = data.scaleIds.size > 0 ? Array.from(data.scaleIds)[0] : undefined;
        
        return {
            name: data.name,
            roles: Array.from(data.roles).join(', '),
            scaleId,
            status: data.status as any,
            membroId: data.membroId,
            isCurrentUser: data.isCurrentUser
        };
      },
    );

    return { ...group, items: mergedItems };
  });

  const handleJoinScale = async (scaleId: string) => {
    try {
        if (!user?.membro?.id) {
            alert("Erro: Usuário não identificado como membro.");
            return;
        }
        
        const confirmJoin = window.confirm("Deseja entrar nesta escala?");
        if (!confirmJoin) return;

        await api.post(`/escalas/${scaleId}/voluntarios`, {
            membroId: user.membro.id
        });
        
        alert("Você entrou na escala com sucesso! Atualize a página.");
        window.location.reload(); // Simple reload to refresh data
    } catch (error: any) {
        console.error("Erro ao entrar na escala:", error);
        alert(error.response?.data?.message || "Erro ao entrar na escala.");
    }
  };

  const handleConfirmScale = async (scaleId: string, membroId: string) => {
    try {
        const confirm = window.confirm("Confirmar presença nesta escala?");
        if (!confirm) return;

        await api.patch(`/escalas/${scaleId}/voluntarios/${membroId}/confirm`);
        
        alert("Presença confirmada!");
        window.location.reload();
    } catch (error: any) {
        console.error("Erro ao confirmar:", error);
        alert(error.response?.data?.message || "Erro ao confirmar.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white font-montserrat">
      <main className="w-5/6 m-auto grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 md:px-8 pb-8 pt-32">
        <div className="lg:col-span-12 mb-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <FaArrowLeft /> Voltar
          </button>
        </div>

        <aside className="lg:col-span-3">
          <div className="bg-[#161616] rounded-xl overflow-hidden border border-white/5 flex flex-col h-full">
            <div className="bg-[#ff3b3f] px-5 py-4">
              <span className="text-xs font-semibold uppercase tracking-wide">
                {type === 'area' ? 'Área de Atuação' : 'Ministério'}
              </span>
              <h1 className="text-lg font-bold leading-tight mt-1">{data.name}</h1>
            </div>

            <div className="px-6 py-5 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                <h2 className="text-sm text-gray-200">
                  Equipe
                </h2>
                {isLeader && (
                  <button onClick={openAddMemberModal} className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors">
                    <FaPlus /> Add
                  </button>
                )}
              </div>

              <div className="space-y-3 flex-1">
                {membros.length > 0 ? (
                  membros.map((membro, index) => {
                    const colorClass =
                      index % 2 === 0 ? 'bg-[#F3A920]' : 'bg-[#9B59B6]';

                    return (
                      <div
                        key={membro.id}
                        className={`${colorClass} rounded-full px-4 py-2 flex items-center justify-between text-white text-sm`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-black text-xs">
                            <FaUser />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold leading-none">{membro.nome}</span>
                            <span className="text-[10px] opacity-80 mt-1">{membro.atuacoes.map(a => `${a.papel}, ${a.atividade.name}`)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-sm italic text-center">
                    Nenhum membro vinculado.
                  </p>
                )}
              </div>

              <div className="mt-6 pt-3 border-t border-white/10 text-center text-xs text-gray-400">
                Ver mais...
              </div>
            </div>
          </div>
        </aside>

        <section className="lg:col-span-9 space-y-9">
          <div className="bg-[#161616] rounded-xl p-4 flex items-center gap-3 border border-white/5 h-14">
            <FaSearch className="text-gray-500 text-lg ml-1" />
          </div>

          <section className="space-y-6">
            <ScalesCarousel scales={finalScales} onJoin={handleJoinScale} onConfirm={handleConfirmScale} />
          </section>

          <PostList posts={posts} emptyMessage="Nenhum aviso publicado." />
        </section>

        <aside className="lg:col-span-3 space-y-6">
          <section className="bg-[#161616] rounded-xl p-6 border border-white/5">
            <div className="mb-4">
              <h3 className="text-sm text-gray-300 pb-2 border-b border-white/10">
                Planos de leitura
              </h3>
            </div>

            <div className="space-y-3">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="bg-[#252525] p-3 rounded-sm hover:bg-[#303030] transition-colors cursor-pointer"
                >
                  <h4 className="font-bold text-xs text-gray-300 mb-1 border-b border-white/10 pb-1 inline-block">
                    Bíblia em 365 dias
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Pequena descrição à respeito do plano de leitura...
                  </p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </main>

      {isAddMemberModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161616] border border-white/10 rounded-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsAddMemberModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <FaTimes />
            </button>
            <h3 className="text-xl font-bold mb-6 text-white">Adicionar Membro</h3>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Membro</label>
                <select
                  value={newMemberId}
                  onChange={(e) => setNewMemberId(e.target.value)}
                  className="w-full bg-[#202020] border border-white/10 rounded p-2 text-white focus:outline-none focus:border-[#ff3b3f]"
                  required
                >
                  <option value="">Selecione um membro</option>
                  {allMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Atividade</label>
                <select
                  value={newActivityId}
                  onChange={(e) => setNewActivityId(e.target.value)}
                  className="w-full bg-[#202020] border border-white/10 rounded p-2 text-white focus:outline-none focus:border-[#ff3b3f]"
                  required
                >
                  <option value="">Selecione uma atividade</option>
                  {atividades.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Papel</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-[#202020] border border-white/10 rounded p-2 text-white focus:outline-none focus:border-[#ff3b3f]"
                  required
                >
                  <option value="VOLUNTARIO">Voluntário</option>
                  <option value="AUXILIAR">Auxiliar</option>
                  <option value="LIDER">Líder</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#ff3b3f] hover:bg-[#d42d31] text-white font-bold py-2 rounded transition-colors mt-2"
              >
                Adicionar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
