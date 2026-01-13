import { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaIdCard, FaCamera, FaMusic, FaHandsHelping, FaGraduationCap, FaBookOpen, FaCalendarCheck, FaMicrophone, FaVideo, FaNetworkWired, FaVolumeUp, FaBroadcastTower, FaClock, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useAuth } from '../contexts/AuthContext';

export const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dados' | 'endereco'>('dados');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for form fields (initialized with user data or empty strings)
  const [formData, setFormData] = useState({
    nome: user?.membro?.nome || '',
    email: user?.email || '',
    telefone: '(00) 00000-0000',
    dataNascimento: user?.membro?.dataNascimento || '',
    endereco: 'Rua Exemplo, 123',
    bairro: 'Centro',
    cidade: 'Cidade',
    estado: 'UF',
    cep: '00000-000',
    rg: '00.000.000-0',
    cpf: '000.000.000-00'
  });

  // State for editing (temporary)
  const [editFormData, setEditFormData] = useState(formData);

  const handleOpenModal = () => {
    setEditFormData({ ...formData });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setFormData(editFormData);
    setIsModalOpen(false);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-primary font-montserrat">
      <main className="w-5/6 m-auto grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 md:px-8 pb-8 pt-32">
        
        {/* Left Column - Same as AreaMembro for consistency */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-[#161616] rounded-xl flex flex-col items-center text-center overflow-hidden border border-white/5">
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
                   {[
                      { name: 'Multimídia', icon: <FaCamera /> },
                      { name: 'Louvor', icon: <FaMusic /> },
                      { name: 'Redes Sociais', icon: <FaNetworkWired /> },
                      { name: 'Som', icon: <FaVolumeUp /> },
                      { name: 'Live', icon: <FaBroadcastTower /> },
                   ].map((activity, index) => (
                      <button key={index} className="w-full bg-[#252525] hover:bg-[#303030] py-3 px-4 rounded-xl flex items-center gap-4 transition-all group border border-transparent hover:border-secondary/20">
                         <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                            <div className="text-sm">{activity.icon}</div>
                         </div>
                         <span className="text-[10px] font-bold uppercase text-gray-300 group-hover:text-white transition-colors">{activity.name}</span>
                      </button>
                   ))}
                </div>
             </div>
          </div>
        </aside>

        {/* Center Column - Profile Details */}
        <section className="lg:col-span-9 space-y-6">
           {/* Minhas Informações (Tabs: Dados Pessoais / Endereço) */}
           <div className="bg-[#161616] rounded-xl p-6 border border-white/5">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 pb-4 border-b border-white/10 gap-4">
                 <div className="flex items-center gap-6">
                    <button 
                       onClick={() => setActiveTab('dados')}
                       className={`text-lg font-bold flex items-center gap-2 transition-colors ${activeTab === 'dados' ? 'text-white border-b-2 border-secondary pb-1' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                       <FaUser className={activeTab === 'dados' ? 'text-secondary' : ''} /> Dados Pessoais
                    </button>
                    <button 
                       onClick={() => setActiveTab('endereco')}
                       className={`text-lg font-bold flex items-center gap-2 transition-colors ${activeTab === 'endereco' ? 'text-white border-b-2 border-secondary pb-1' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                       <FaMapMarkerAlt className={activeTab === 'endereco' ? 'text-secondary' : ''} /> Endereço
                    </button>
                 </div>
                 
                 <button 
                    onClick={handleOpenModal}
                    className="bg-[#252525] hover:bg-[#303030] text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                 >
                    <FaEdit /> Editar
                 </button>
              </div>

              {/* Read-Only View */}
              <div className="min-h-[300px]">
                  {activeTab === 'dados' ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                        <div className="space-y-2">
                           <label className="text-xs text-gray-400 font-bold uppercase ml-1">Nome Completo</label>
                           <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                 <FaUser className="text-gray-500 text-xs" />
                              </div>
                              <input 
                                 type="text" 
                                 value={formData.nome}
                                 readOnly
                                 disabled
                                 className="w-full bg-[#252525] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none opacity-50 cursor-not-allowed"
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-xs text-gray-400 font-bold uppercase ml-1">E-mail</label>
                           <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                 <FaEnvelope className="text-gray-500 text-xs" />
                              </div>
                              <input 
                                 type="email" 
                                 value={formData.email}
                                 readOnly
                                 disabled
                                 className="w-full bg-[#252525] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none opacity-50 cursor-not-allowed"
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-xs text-gray-400 font-bold uppercase ml-1">Telefone / WhatsApp</label>
                           <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                 <FaPhone className="text-gray-500 text-xs" />
                              </div>
                              <input 
                                 type="text" 
                                 value={formData.telefone}
                                 readOnly
                                 disabled
                                 className="w-full bg-[#252525] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none opacity-50 cursor-not-allowed"
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-xs text-gray-400 font-bold uppercase ml-1">Data de Nascimento</label>
                           <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                 <FaCalendarAlt className="text-gray-500 text-xs" />
                              </div>
                              <input 
                                 type="date" 
                                 value={formData.dataNascimento}
                                 readOnly
                                 disabled
                                 className="w-full bg-[#252525] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none opacity-50 cursor-not-allowed"
                              />
                           </div>
                        </div>
                        
                        <div className="space-y-2">
                           <label className="text-xs text-gray-400 font-bold uppercase ml-1">CPF</label>
                           <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                 <FaIdCard className="text-gray-500 text-xs" />
                              </div>
                              <input 
                                 type="text" 
                                 value={formData.cpf}
                                 readOnly
                                 disabled
                                 className="w-full bg-[#252525] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none opacity-50 cursor-not-allowed"
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-xs text-gray-400 font-bold uppercase ml-1">RG</label>
                           <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                 <FaIdCard className="text-gray-500 text-xs" />
                              </div>
                              <input 
                                 type="text" 
                                 value={formData.rg}
                                 readOnly
                                 disabled
                                 className="w-full bg-[#252525] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none opacity-50 cursor-not-allowed"
                              />
                           </div>
                        </div>
                     </div>
                  ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                        <div className="space-y-2 md:col-span-2">
                           <label className="text-xs text-gray-400 font-bold uppercase ml-1">Logradouro</label>
                           <input 
                              type="text" 
                              value={formData.endereco}
                              readOnly
                              disabled
                              className="w-full bg-[#252525] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none opacity-50 cursor-not-allowed"
                           />
                        </div>

                        <div className="space-y-2">
                           <label className="text-xs text-gray-400 font-bold uppercase ml-1">Bairro</label>
                           <input 
                              type="text" 
                              value={formData.bairro}
                              readOnly
                              disabled
                              className="w-full bg-[#252525] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none opacity-50 cursor-not-allowed"
                           />
                        </div>

                        <div className="space-y-2">
                           <label className="text-xs text-gray-400 font-bold uppercase ml-1">CEP</label>
                           <input 
                              type="text" 
                              value={formData.cep}
                              readOnly
                              disabled
                              className="w-full bg-[#252525] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none opacity-50 cursor-not-allowed"
                           />
                        </div>

                        <div className="space-y-2">
                           <label className="text-xs text-gray-400 font-bold uppercase ml-1">Cidade</label>
                           <input 
                              type="text" 
                              value={formData.cidade}
                              readOnly
                              disabled
                              className="w-full bg-[#252525] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none opacity-50 cursor-not-allowed"
                           />
                        </div>

                        <div className="space-y-2">
                           <label className="text-xs text-gray-400 font-bold uppercase ml-1">Estado</label>
                           <input 
                              type="text" 
                              value={formData.estado}
                              readOnly
                              disabled
                              className="w-full bg-[#252525] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none opacity-50 cursor-not-allowed"
                           />
                        </div>
                     </div>
                  )}
              </div>
           </div>

           {/* Modal de Edição */}
           {isModalOpen && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-[#161616] w-full max-w-4xl rounded-xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-fadeIn">
                   <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1a1a1a]">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                         <FaEdit className="text-secondary" /> Editar Informações
                      </h2>
                      <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                         <FaTimes size={20} />
                      </button>
                   </div>
                   
                   <div className="p-6 overflow-y-auto custom-scrollbar">
                      <div className="flex gap-6 mb-6 border-b border-white/10 pb-2">
                         <button 
                            onClick={() => setActiveTab('dados')}
                            className={`text-sm font-bold uppercase pb-2 transition-colors ${activeTab === 'dados' ? 'text-secondary border-b-2 border-secondary' : 'text-gray-500 hover:text-white'}`}
                         >
                            Dados Pessoais
                         </button>
                         <button 
                            onClick={() => setActiveTab('endereco')}
                            className={`text-sm font-bold uppercase pb-2 transition-colors ${activeTab === 'endereco' ? 'text-secondary border-b-2 border-secondary' : 'text-gray-500 hover:text-white'}`}
                         >
                            Endereço
                         </button>
                      </div>

                      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {activeTab === 'dados' ? (
                             <>
                                <div className="space-y-2">
                                   <label className="text-xs text-gray-400 font-bold uppercase ml-1">Nome Completo</label>
                                   <div className="relative">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                         <FaUser className="text-gray-500 text-xs" />
                                      </div>
                                      <input 
                                         type="text" 
                                         name="nome"
                                         value={editFormData.nome}
                                         onChange={handleEditChange}
                                         className="w-full bg-[#252525] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                                         placeholder="Seu nome completo"
                                      />
                                   </div>
                                </div>
            
                                <div className="space-y-2">
                                   <label className="text-xs text-gray-400 font-bold uppercase ml-1">E-mail</label>
                                   <div className="relative">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                         <FaEnvelope className="text-gray-500 text-xs" />
                                      </div>
                                      <input 
                                         type="email" 
                                         name="email"
                                         value={editFormData.email}
                                         onChange={handleEditChange}
                                         className="w-full bg-[#252525] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                                         placeholder="seu@email.com"
                                      />
                                   </div>
                                </div>
            
                                <div className="space-y-2">
                                   <label className="text-xs text-gray-400 font-bold uppercase ml-1">Telefone / WhatsApp</label>
                                   <div className="relative">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                         <FaPhone className="text-gray-500 text-xs" />
                                      </div>
                                      <input 
                                         type="text" 
                                         name="telefone"
                                         value={editFormData.telefone}
                                         onChange={handleEditChange}
                                         className="w-full bg-[#252525] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                                         placeholder="(00) 00000-0000"
                                      />
                                   </div>
                                </div>
            
                                <div className="space-y-2">
                                   <label className="text-xs text-gray-400 font-bold uppercase ml-1">Data de Nascimento</label>
                                   <div className="relative">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                         <FaCalendarAlt className="text-gray-500 text-xs" />
                                      </div>
                                      <input 
                                         type="date" 
                                         name="dataNascimento"
                                         value={editFormData.dataNascimento}
                                         onChange={handleEditChange}
                                         className="w-full bg-[#252525] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                                      />
                                   </div>
                                </div>
                                
                                <div className="space-y-2">
                                   <label className="text-xs text-gray-400 font-bold uppercase ml-1">CPF</label>
                                   <div className="relative">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                         <FaIdCard className="text-gray-500 text-xs" />
                                      </div>
                                      <input 
                                         type="text" 
                                         name="cpf"
                                         value={editFormData.cpf}
                                         onChange={handleEditChange}
                                         className="w-full bg-[#252525] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                                         placeholder="000.000.000-00"
                                      />
                                   </div>
                                </div>
            
                                <div className="space-y-2">
                                   <label className="text-xs text-gray-400 font-bold uppercase ml-1">RG</label>
                                   <div className="relative">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                         <FaIdCard className="text-gray-500 text-xs" />
                                      </div>
                                      <input 
                                         type="text" 
                                         name="rg"
                                         value={editFormData.rg}
                                         onChange={handleEditChange}
                                         className="w-full bg-[#252525] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                                         placeholder="00.000.000-0"
                                      />
                                   </div>
                                </div>
                             </>
                         ) : (
                             <>
                                <div className="space-y-2 md:col-span-2">
                                   <label className="text-xs text-gray-400 font-bold uppercase ml-1">Logradouro</label>
                                   <input 
                                      type="text" 
                                      name="endereco"
                                      value={editFormData.endereco}
                                      onChange={handleEditChange}
                                      className="w-full bg-[#252525] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                                      placeholder="Rua, Avenida, etc"
                                   />
                                </div>
            
                                <div className="space-y-2">
                                   <label className="text-xs text-gray-400 font-bold uppercase ml-1">Bairro</label>
                                   <input 
                                      type="text" 
                                      name="bairro"
                                      value={editFormData.bairro}
                                      onChange={handleEditChange}
                                      className="w-full bg-[#252525] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                                      placeholder="Bairro"
                                   />
                                </div>
            
                                <div className="space-y-2">
                                   <label className="text-xs text-gray-400 font-bold uppercase ml-1">CEP</label>
                                   <input 
                                      type="text" 
                                      name="cep"
                                      value={editFormData.cep}
                                      onChange={handleEditChange}
                                      className="w-full bg-[#252525] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                                      placeholder="00000-000"
                                   />
                                </div>
            
                                <div className="space-y-2">
                                   <label className="text-xs text-gray-400 font-bold uppercase ml-1">Cidade</label>
                                   <input 
                                      type="text" 
                                      name="cidade"
                                      value={editFormData.cidade}
                                      onChange={handleEditChange}
                                      className="w-full bg-[#252525] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                                      placeholder="Cidade"
                                   />
                                </div>
            
                                <div className="space-y-2">
                                   <label className="text-xs text-gray-400 font-bold uppercase ml-1">Estado</label>
                                   <input 
                                      type="text" 
                                      name="estado"
                                      value={editFormData.estado}
                                      onChange={handleEditChange}
                                      className="w-full bg-[#252525] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                                      placeholder="UF"
                                   />
                                </div>
                             </>
                         )}
                      </form>
                   </div>
                   
                   <div className="p-6 border-t border-white/10 bg-[#1a1a1a] flex justify-end gap-3">
                      <button 
                         onClick={() => setIsModalOpen(false)}
                         className="bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2"
                      >
                         <FaTimes /> Cancelar
                      </button>
                      <button 
                         onClick={handleSave}
                         className="bg-secondary hover:bg-secondary/80 text-black text-sm font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2"
                      >
                         <FaSave /> Salvar Alterações
                      </button>
                   </div>
                </div>
             </div>
           )}

           {/* Cursos */}
           <div className="bg-[#161616] rounded-xl p-6 border border-white/5">
              <div className="mb-6 pb-4 border-b border-white/10">
                 <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FaGraduationCap className="text-secondary" /> Cursos
                 </h2>
              </div>
              
              <div className="space-y-6">
                 <div>
                    <h3 className="text-sm text-gray-400 font-bold uppercase mb-3 ml-1">Iniciais</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="bg-[#252525] p-4 rounded-lg border-l-4 border-secondary flex justify-between items-center">
                          <div>
                             <h4 className="font-bold text-white">START</h4>
                             <p className="text-xs text-gray-400">Fundamentos da fé</p>
                          </div>
                          <span className="px-2 py-1 bg-green-500/20 text-green-500 text-[10px] font-bold rounded uppercase">Concluído</span>
                       </div>
                       <div className="bg-[#252525] p-4 rounded-lg border-l-4 border-secondary flex justify-between items-center">
                          <div>
                             <h4 className="font-bold text-white">DNA FIRE</h4>
                             <p className="text-xs text-gray-400">Cultura da igreja</p>
                          </div>
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-[10px] font-bold rounded uppercase">Em andamento</span>
                       </div>
                    </div>
                 </div>

                 <div>
                    <h3 className="text-sm text-gray-400 font-bold uppercase mb-3 ml-1">Liderança</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="bg-[#252525] p-4 rounded-lg border-l-4 border-blue-500 flex justify-between items-center opacity-75">
                          <div>
                             <h4 className="font-bold text-white">Liderança Exponencial</h4>
                             <p className="text-xs text-gray-400">Módulo 1</p>
                          </div>
                          <span className="px-2 py-1 bg-gray-700 text-gray-400 text-[10px] font-bold rounded uppercase">Não iniciado</span>
                       </div>
                    </div>
                 </div>

                 <div>
                    <h3 className="text-sm text-gray-400 font-bold uppercase mb-3 ml-1">Outros</h3>
                    <p className="text-xs text-gray-500 italic ml-1">Nenhum outro curso registrado.</p>
                 </div>
              </div>
           </div>

           {/* Meus Planos de Leitura */}
           <div className="bg-[#161616] rounded-xl p-6 border border-white/5">
              <div className="mb-6 pb-4 border-b border-white/10">
                 <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FaBookOpen className="text-secondary" /> Meus Planos de Leitura
                 </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-[#252525] p-5 rounded-lg border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-secondary/20"></div>
                    <h3 className="font-bold text-white relative z-10">Bíblia em 1 Ano</h3>
                    <p className="text-xs text-gray-400 mb-4 relative z-10">Plano anual completo</p>
                    
                    <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden mb-2 relative z-10">
                       <div className="bg-secondary h-full w-[45%]"></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase relative z-10">
                       <span>45% Concluído</span>
                       <span>Dia 164/365</span>
                    </div>
                 </div>
                 
                 <div className="bg-[#252525] p-5 rounded-lg border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-blue-500/20"></div>
                    <h3 className="font-bold text-white relative z-10">Novo Testamento</h3>
                    <p className="text-xs text-gray-400 mb-4 relative z-10">Leitura devocional</p>
                    
                    <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden mb-2 relative z-10">
                       <div className="bg-blue-500 h-full w-[12%]"></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase relative z-10">
                       <span>12% Concluído</span>
                       <span>Dia 10/90</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Minha Agenda */}
           <div className="bg-[#161616] rounded-xl p-6 border border-white/5">
              <div className="mb-6 pb-4 border-b border-white/10">
                 <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FaCalendarCheck className="text-secondary" /> Minha Agenda
                 </h2>
              </div>
              
              <div className="space-y-4">
                 <div className="flex gap-4 items-start">
                    <div className="bg-[#252525] w-14 h-14 rounded-lg flex flex-col items-center justify-center border border-white/5 shrink-0">
                       <span className="text-[10px] uppercase text-gray-400 font-bold">JAN</span>
                       <span className="text-xl font-bold text-white">28</span>
                    </div>
                    <div className="flex-1 bg-[#252525] p-4 rounded-lg border-l-4 border-secondary">
                       <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-white">Escala Multimídia</h4>
                          <span className="bg-secondary/20 text-secondary text-[10px] font-bold px-2 py-0.5 rounded uppercase">Confirmado</span>
                       </div>
                       <p className="text-sm text-gray-300 mb-2">Culto de Celebração</p>
                       <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><FaClock /> 18:30</span>
                          <span className="flex items-center gap-1"><FaMapMarkerAlt /> Templo Principal</span>
                       </div>
                    </div>
                 </div>

                 <div className="flex gap-4 items-start">
                    <div className="bg-[#252525] w-14 h-14 rounded-lg flex flex-col items-center justify-center border border-white/5 shrink-0">
                       <span className="text-[10px] uppercase text-gray-400 font-bold">FEV</span>
                       <span className="text-xl font-bold text-white">02</span>
                    </div>
                    <div className="flex-1 bg-[#252525] p-4 rounded-lg border-l-4 border-blue-500">
                       <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-white">Escala Louvor</h4>
                          <span className="bg-blue-500/20 text-blue-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Confirmado</span>
                       </div>
                       <p className="text-sm text-gray-300 mb-2">Culto de Doutrina</p>
                       <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><FaClock /> 19:00</span>
                          <span className="flex items-center gap-1"><FaMapMarkerAlt /> Templo Principal</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex gap-4 items-start">
                    <div className="bg-[#252525] w-14 h-14 rounded-lg flex flex-col items-center justify-center border border-white/5 shrink-0">
                       <span className="text-[10px] uppercase text-gray-400 font-bold">FEV</span>
                       <span className="text-xl font-bold text-white">10</span>
                    </div>
                    <div className="flex-1 bg-[#252525] p-4 rounded-lg border-l-4 border-purple-500">
                       <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-white">Conferência Fire</h4>
                          <span className="bg-purple-500/20 text-purple-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Evento</span>
                       </div>
                       <p className="text-sm text-gray-300 mb-2">Evento Especial</p>
                       <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><FaClock /> 19:30</span>
                          <span className="flex items-center gap-1"><FaMapMarkerAlt /> Templo Principal</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
};
