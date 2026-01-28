import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { MemberProfileCard } from '../components/MemberProfileCard/MemberProfileCard';
import { ProfileInput } from '../components/ProfileInput/ProfileInput';
import { FaUsers, FaProjectDiagram, FaCalendarAlt, FaChurch, FaLayerGroup, FaLink, FaUnlink, FaEdit, FaTrash, FaPlus, FaSearch, FaTimes, FaSave } from 'react-icons/fa';

// Types (simplified for now, will expand as needed)
type Membro = { id: string; nome: string; email: string; user?: { id: string; email: string; systemRole: string } };
// type Celula = { id: string; nome: string; lider: string; diaEncontro: string; horario: string; local: string };
// type Evento = { id: string; nome: string; dataInicio: string; local: string };
// type Ministerio = { id: string; name: string; papel: string };
// type Area = { id: string; name: string; papel: string };

export const MinhaIgreja = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'membros' | 'celulas' | 'eventos' | 'ministerios' | 'areas'>('membros');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // User Modal State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Membro | null>(null);
  const [userFormData, setUserFormData] = useState({ email: '', password: '', system_role: 'MEMBRO' });

  // Entity Modal State
  const [isEntityModalOpen, setIsEntityModalOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<any | null>(null);
  const [entityFormData, setEntityFormData] = useState<any>({});

  // Fetch data based on active tab
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      switch (activeTab) {
        case 'membros': endpoint = '/membros'; break;
        case 'celulas': endpoint = '/celulas'; break;
        case 'eventos': endpoint = '/eventos'; break;
        case 'ministerios': endpoint = '/ministerios'; break;
        case 'areas': endpoint = '/areas'; break;
      }
      const response = await api.get(endpoint);
      setData(response.data);
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este item?')) return;
    try {
        let endpoint = '';
        switch (activeTab) {
            case 'membros': endpoint = `/membros/${id}`; break;
            case 'celulas': endpoint = `/celulas/${id}`; break;
            case 'eventos': endpoint = `/eventos/${id}`; break;
            case 'ministerios': endpoint = `/ministerios/${id}`; break;
            case 'areas': endpoint = `/areas/${id}`; break;
        }
        await api.delete(endpoint);
        fetchData(); // Refresh list
    } catch (error) {
        console.error('Error deleting item:', error);
        alert('Erro ao excluir item.');
    }
  };

  // Entity Management (Create/Edit)
  const openCreateModal = () => {
    setEditingEntity(null);
    setEntityFormData({});
    setIsEntityModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingEntity(item);
    // Populate form data based on item, adjusting keys if necessary
    setEntityFormData({ ...item });
    setIsEntityModalOpen(true);
  };

  const closeEntityModal = () => {
    setIsEntityModalOpen(false);
    setEditingEntity(null);
    setEntityFormData({});
  };

  const handleSaveEntity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const igrejaId = (user as any)?.membro?.igreja?.id; // Assuming user has this structure
        if (!igrejaId && activeTab !== 'ministerios' && activeTab !== 'areas') {
            // Ministerios and Areas might not need igrejaId in DTO? Checked DTOs:
            // Membro: yes
            // Celula: yes
            // Evento: yes
            // Ministerio/Area: NO in CreateDto, maybe inferred or global?
            // Actually CreateMinisterioDto/CreateAreaDto don't have igrejaId.
            // But Membro/Celula/Evento DO.
             if (activeTab === 'membros' || activeTab === 'celulas' || activeTab === 'eventos') {
                 if (!igrejaId) {
                     alert("Erro: ID da igreja não encontrado no usuário logado.");
                     return;
                 }
             }
        }

        const dataToSend = { ...entityFormData };
        if (igrejaId) dataToSend.igrejaId = igrejaId;

        // Specific formatting
        if (activeTab === 'celulas') {
            dataToSend.dia_semana = parseInt(dataToSend.dia_semana);
        }

        let endpoint = '';
        switch (activeTab) {
            case 'membros': endpoint = '/membros'; break;
            case 'celulas': endpoint = '/celulas'; break;
            case 'eventos': endpoint = '/eventos'; break;
            case 'ministerios': endpoint = '/ministerios'; break;
            case 'areas': endpoint = '/areas'; break;
        }

        if (editingEntity) {
            await api.patch(`${endpoint}/${editingEntity.id}`, dataToSend);
            alert('Item atualizado com sucesso!');
        } else {
            await api.post(endpoint, dataToSend);
            alert('Item criado com sucesso!');
        }
        closeEntityModal();
        fetchData();
    } catch (error: any) {
        console.error('Error saving entity:', error);
        alert(error.response?.data?.message || 'Erro ao salvar item.');
    }
  };

  // User Management
  const openUserModal = (membro: Membro) => {
    setSelectedMember(membro);
    setUserFormData({ email: membro.email, password: '', system_role: 'MEMBRO' });
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setSelectedMember(null);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    try {
      await api.post('/users/create-for-member', {
        membroId: selectedMember.id,
        email: userFormData.email,
        password: userFormData.password,
        system_role: userFormData.system_role
      });
      alert('Usuário criado e vinculado com sucesso!');
      closeUserModal();
      fetchData();
    } catch (error: any) {
      console.error('Error creating user:', error);
      alert(error.response?.data?.message || 'Erro ao criar usuário.');
    }
  };

  const handleUnlinkUser = async (membro: Membro) => {
    if (!membro.user) return;
    if (!window.confirm(`Tem certeza que deseja desvincular o usuário ${membro.user.email} deste membro?`)) return;

    try {
      await api.patch(`/users/unlink-member/${membro.user.id}`);
      alert('Usuário desvinculado com sucesso!');
      fetchData();
    } catch (error: any) {
      console.error('Error unlinking user:', error);
      alert(error.response?.data?.message || 'Erro ao desvincular usuário.');
    }
  };

  // Filter data based on search term
  const filteredData = data.filter(item => {
    const term = searchTerm.toLowerCase();
    const name = item.nome || item.name || '';
    return name.toLowerCase().includes(term);
  });

  const renderContent = () => {
    if (loading) return <div className="text-center p-10 text-gray-400">Carregando...</div>;

    return (
        <div className="bg-[#161616] rounded-xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-[#202020] text-xs uppercase font-bold text-gray-400">
                        <tr>
                            <th className="px-6 py-4">Nome</th>
                            {activeTab === 'membros' && <th className="px-6 py-4">Email</th>}
                            {activeTab === 'membros' && <th className="px-6 py-4">Usuário Vinculado</th>}
                            {activeTab === 'celulas' && <th className="px-6 py-4">Líder</th>}
                            {activeTab === 'eventos' && <th className="px-6 py-4">Data</th>}
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredData.map((item) => (
                            <tr key={item.id} className="hover:bg-[#1a1a1a] transition-colors">
                                <td className="px-6 py-4 font-medium text-white">{item.nome || item.name}</td>
                                
                                {activeTab === 'membros' && (
                                    <>
                                        <td className="px-6 py-4">{item.email}</td>
                                        <td className="px-6 py-4">
                                            {item.user ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex items-center gap-1 text-green-400 bg-green-400/10 px-2 py-1 rounded text-xs">
                                                        <FaLink size={10} /> {item.user.email}
                                                    </span>
                                                    <button 
                                                        onClick={() => handleUnlinkUser(item)}
                                                        className="text-gray-500 hover:text-red-400 transition-colors"
                                                        title="Desvincular Usuário"
                                                    >
                                                        <FaUnlink size={12} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded text-xs">
                                                        <FaUnlink size={10} /> Não vinculado
                                                    </span>
                                                    <button 
                                                        onClick={() => openUserModal(item)}
                                                        className="text-gray-500 hover:text-green-400 transition-colors"
                                                        title="Vincular/Criar Usuário"
                                                    >
                                                        <FaLink size={12} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </>
                                )}

                                {activeTab === 'celulas' && <td className="px-6 py-4">{item.lider || 'N/A'}</td>}
                                
                                {activeTab === 'eventos' && (
                                    <td className="px-6 py-4">
                                        {new Date(item.dataInicio).toLocaleDateString('pt-BR')}
                                    </td>
                                )}

                                <td className="px-6 py-4 text-right space-x-2">
                                    <button 
                                        onClick={() => openEditModal(item)}
                                        className="text-blue-400 hover:text-blue-300 transition-colors p-1" 
                                        title="Editar"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(item.id)}
                                        className="text-red-400 hover:text-red-300 transition-colors p-1" 
                                        title="Excluir"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredData.length === 0 && (
                            <tr>
                                <td colSpan={activeTab === 'membros' ? 4 : 3} className="px-6 py-8 text-center text-gray-500 italic">
                                    Nenhum item encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-primary font-montserrat">
      <main className="w-5/6 m-auto grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 md:px-8 pb-8 pt-32">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <MemberProfileCard user={user} />
          
          {/* Navigation Menu */}
          <div className="bg-[#161616] rounded-xl p-4 border border-white/5 space-y-1">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">Administração</h3>
            
            <button 
                onClick={() => setActiveTab('membros')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium ${activeTab === 'membros' ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'text-gray-400 hover:bg-[#252525] hover:text-white'}`}
            >
                <FaUsers /> Membros
            </button>
            <button 
                onClick={() => setActiveTab('celulas')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium ${activeTab === 'celulas' ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'text-gray-400 hover:bg-[#252525] hover:text-white'}`}
            >
                <FaProjectDiagram /> Células
            </button>
            <button 
                onClick={() => setActiveTab('eventos')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium ${activeTab === 'eventos' ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'text-gray-400 hover:bg-[#252525] hover:text-white'}`}
            >
                <FaCalendarAlt /> Eventos
            </button>
            <button 
                onClick={() => setActiveTab('ministerios')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium ${activeTab === 'ministerios' ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'text-gray-400 hover:bg-[#252525] hover:text-white'}`}
            >
                <FaChurch /> Ministérios
            </button>
            <button 
                onClick={() => setActiveTab('areas')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium ${activeTab === 'areas' ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'text-gray-400 hover:bg-[#252525] hover:text-white'}`}
            >
                <FaLayerGroup /> Áreas
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <section className="lg:col-span-9 space-y-6">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#161616] p-4 rounded-xl border border-white/5">
                <div className="relative w-full md:w-96">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder={`Buscar em ${activeTab}...`}
                        className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:border-secondary transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button 
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-secondary hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-secondary/20"
                >
                    <FaPlus /> Novo {activeTab.slice(0, -1)}
                </button>
            </div>

            {/* Content Table */}
            {renderContent()}
        </section>
      </main>

      {/* Entity Create/Edit Modal */}
      {isEntityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#161616] rounded-xl border border-white/10 w-full max-w-lg shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white">
                        {editingEntity ? 'Editar' : 'Novo'} {activeTab === 'membros' ? 'Membro' : activeTab === 'celulas' ? 'Célula' : activeTab === 'eventos' ? 'Evento' : activeTab === 'ministerios' ? 'Ministério' : 'Área'}
                    </h3>
                    <button onClick={closeEntityModal} className="text-gray-400 hover:text-white transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>
                <form onSubmit={handleSaveEntity} className="p-6 space-y-4">
                    
                    {/* Dynamic Fields based on activeTab */}
                    {activeTab === 'membros' && (
                        <>
                            <ProfileInput label="Nome Completo" value={entityFormData.nome || ''} onChange={e => setEntityFormData({...entityFormData, nome: e.target.value})} required />
                            <ProfileInput label="Email" type="email" value={entityFormData.email || ''} onChange={e => setEntityFormData({...entityFormData, email: e.target.value})} required />
                            <div className="grid grid-cols-2 gap-4">
                                <ProfileInput label="Data Nascimento" type="date" value={entityFormData.dataNascimento?.split('T')[0] || ''} onChange={e => setEntityFormData({...entityFormData, dataNascimento: e.target.value})} required />
                                <ProfileInput label="Data Entrada" type="date" value={entityFormData.dataEntrada?.split('T')[0] || ''} onChange={e => setEntityFormData({...entityFormData, dataEntrada: e.target.value})} required />
                            </div>
                            <ProfileInput label="Telefone" value={entityFormData.telefone || ''} onChange={e => setEntityFormData({...entityFormData, telefone: e.target.value})} />
                            <ProfileInput label="Endereço" value={entityFormData.endereco || ''} onChange={e => setEntityFormData({...entityFormData, endereco: e.target.value})} />
                        </>
                    )}

                    {activeTab === 'celulas' && (
                        <>
                            <ProfileInput label="Nome da Célula" value={entityFormData.nome || ''} onChange={e => setEntityFormData({...entityFormData, nome: e.target.value})} required />
                            <ProfileInput label="Líder (Nome)" value={entityFormData.lider || ''} onChange={e => setEntityFormData({...entityFormData, lider: e.target.value})} />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 font-bold uppercase ml-1">Dia da Semana</label>
                                    <select 
                                        className="w-full bg-[#252525] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                                        value={entityFormData.dia_semana || 0}
                                        onChange={e => setEntityFormData({...entityFormData, dia_semana: e.target.value})}
                                    >
                                        <option value="0">Domingo</option>
                                        <option value="1">Segunda</option>
                                        <option value="2">Terça</option>
                                        <option value="3">Quarta</option>
                                        <option value="4">Quinta</option>
                                        <option value="5">Sexta</option>
                                        <option value="6">Sábado</option>
                                    </select>
                                </div>
                                <ProfileInput label="Horário" type="time" value={entityFormData.horario || ''} onChange={e => setEntityFormData({...entityFormData, horario: e.target.value})} required />
                            </div>
                            <ProfileInput label="Local" value={entityFormData.local || ''} onChange={e => setEntityFormData({...entityFormData, local: e.target.value})} />
                        </>
                    )}

                    {activeTab === 'eventos' && (
                        <>
                            <ProfileInput label="Nome do Evento" value={entityFormData.nome || ''} onChange={e => setEntityFormData({...entityFormData, nome: e.target.value})} required />
                            <ProfileInput label="Data Início" type="datetime-local" value={entityFormData.dataInicio || ''} onChange={e => setEntityFormData({...entityFormData, dataInicio: e.target.value})} required />
                            <ProfileInput label="Local" value={entityFormData.local || ''} onChange={e => setEntityFormData({...entityFormData, local: e.target.value})} />
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400 font-bold uppercase ml-1">Descrição</label>
                                <textarea 
                                    className="w-full bg-[#252525] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-secondary transition-colors h-24 resize-none"
                                    value={entityFormData.descricao || ''}
                                    onChange={e => setEntityFormData({...entityFormData, descricao: e.target.value})}
                                />
                            </div>
                        </>
                    )}

                    {(activeTab === 'ministerios' || activeTab === 'areas') && (
                        <>
                            <ProfileInput label="Nome" value={entityFormData.name || ''} onChange={e => setEntityFormData({...entityFormData, name: e.target.value})} required />
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400 font-bold uppercase ml-1">Descrição</label>
                                <textarea 
                                    className="w-full bg-[#252525] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-secondary transition-colors h-24 resize-none"
                                    value={entityFormData.description || ''}
                                    onChange={e => setEntityFormData({...entityFormData, description: e.target.value})}
                                />
                            </div>
                        </>
                    )}

                    <div className="flex justify-end gap-3 mt-6">
                        <button 
                            type="button" 
                            onClick={closeEntityModal}
                            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            className="flex items-center gap-2 bg-secondary hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-secondary/20"
                        >
                            <FaSave /> Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Create User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#161616] rounded-xl border border-white/10 w-full max-w-md shadow-2xl animate-fade-in-up">
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white">Criar Usuário para Membro</h3>
                    <button onClick={closeUserModal} className="text-gray-400 hover:text-white transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>
                <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                    <div className="bg-secondary/10 border border-secondary/20 p-3 rounded-lg text-sm text-secondary mb-4">
                        <p className="font-bold">Membro: {selectedMember?.nome}</p>
                        <p className="opacity-80">Email: {selectedMember?.email}</p>
                    </div>

                    <ProfileInput 
                        label="Email de Login"
                        type="email"
                        value={userFormData.email}
                        onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                        required
                    />
                    <ProfileInput 
                        label="Senha"
                        type="password"
                        value={userFormData.password}
                        onChange={(e) => setUserFormData({...userFormData, password: e.target.value})}
                        required
                        placeholder="Mínimo 6 caracteres"
                    />
                    
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 font-bold uppercase ml-1">Permissão (Role)</label>
                        <select 
                            className="w-full bg-[#252525] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                            value={userFormData.system_role}
                            onChange={(e) => setUserFormData({...userFormData, system_role: e.target.value})}
                        >
                            <option value="MEMBRO">Membro</option>
                            <option value="LIDER">Líder</option>
                            <option value="DIACONO">Diácono</option>
                            <option value="PASTOR">Pastor</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button 
                            type="button" 
                            onClick={closeUserModal}
                            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            className="flex items-center gap-2 bg-secondary hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-secondary/20"
                        >
                            <FaSave /> Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
