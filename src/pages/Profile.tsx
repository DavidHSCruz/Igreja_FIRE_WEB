import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaIdCard,
  FaBookOpen,
  FaCalendarCheck,
  FaClock,
  FaEdit,
  FaSave,
  FaTimes,
  FaGraduationCap,
  FaBuilding,
  FaFlag,
  FaMap,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { MemberProfileCard } from "../components/MemberProfileCard/MemberProfileCard";
import { ProfileInput } from "../components/ProfileInput/ProfileInput";
import { CourseCard } from "../components/CourseCard/CourseCard";
import { ReadingPlanCard } from "../components/ReadingPlanCard/ReadingPlanCard";
import { api } from "../services/api";
import { 
  validateCPF, 
  validateEmail, 
  validatePhone, 
  validateDate, 
  validateRequired,
  validateAddressSection
} from "../utils/validations";

interface Evento {
  id: string;
  nome: string;
  descricao: string;
  dataInicio: string;
  local: string;
}

interface Escala {
  id: string;
  atividade: {
    name: string;
  };
  eventoRel?: {
    id: string;
  };
  data: string;
  voluntarios: {
    membro: { id: string };
    status: string;
  }[];
}

export const Profile = () => {
  const { user } = useAuth();

  // Logic to block visitor access
  const isVisitor = !user?.systemRole || user.systemRole === "VISITANTE";
  if (isVisitor) {
    return <Navigate to="/areamembro" replace />;
  }

  const [activeTab, setActiveTab] = useState<"dados" | "endereco">("dados");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // documentType removed as we only use CPF now
  const [documentValue, setDocumentValue] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // State for form fields (initialized with user data or empty strings)
  const [formData, setFormData] = useState({
    nome: user?.membro?.nome || "",
    email: user?.email || "",
    telefone: "(00) 00000-0000",
    dataNascimento: user?.membro?.dataNascimento || "",
    endereco: "Rua Exemplo, 123",
    bairro: "Centro",
    cidade: "Cidade",
    estado: "UF",
    cep: "00000-000",
    // rg removed
    cpf: "000.000.000-00",
  });

  // State for editing (temporary)
  const [editFormData, setEditFormData] = useState(formData);

  // State for agenda
  const [events, setEvents] = useState<Evento[]>([]);
  const [userScales, setUserScales] = useState<Escala[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, scalesRes, memberRes] = await Promise.all([
          api.get<Evento[]>('/eventos'),
          api.get<Escala[]>(`/escalas/membro/${user?.membro?.id}`),
          api.get<any>(`/membros/${user?.membro?.id}`)
        ]);
        
        // Filter future events and sort by date
        const futureEvents = eventsRes.data
          .filter(e => new Date(e.dataInicio) >= new Date())
          .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime());
          
        setEvents(futureEvents);
        setUserScales(scalesRes.data);

        // Update formData with fetched member data
        const member = memberRes.data;
        const newFormData = {
          nome: member.nome || "",
          email: member.email || "",
          telefone: member.telefone || "",
          dataNascimento: member.dataNascimento ? member.dataNascimento.split('T')[0] : "",
          endereco: member.endereco || "",
          bairro: member.bairro || "",
          cidade: member.cidade || "",
          estado: member.estado || "",
          cep: member.cep || "",
          // rg removed
          cpf: member.cpf || "",
        };
        setFormData(newFormData);
        setEditFormData(newFormData);

      } catch (error) {
        console.error("Error fetching agenda:", error);
      }
    };

    if (user?.membro?.id) {
      fetchData();
    }
  }, [user?.membro?.id]);

  const handleOpenModal = () => {
    setEditFormData({ ...formData });
    setErrors({});
    setDocumentValue(formData.cpf || "");
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!validateRequired(editFormData.nome)) newErrors.nome = "Nome é obrigatório";
    
    if (!validateRequired(editFormData.email)) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!validateEmail(editFormData.email)) {
      newErrors.email = "E-mail inválido";
    }

    if (editFormData.telefone && !validatePhone(editFormData.telefone)) {
      newErrors.telefone = "Telefone inválido";
    }

    if (editFormData.dataNascimento && !validateDate(editFormData.dataNascimento)) {
      newErrors.dataNascimento = "Data de nascimento inválida";
    }

    // Address Validations
    const addressErrors = validateAddressSection(editFormData);
    Object.assign(newErrors, addressErrors);
    
    // Validate Document (CPF only)
    if (!validateCPF(documentValue)) {
      newErrors.document = "CPF inválido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const dataToSend = {
      ...editFormData,
      cpf: documentValue,
    };

    try {
      await api.patch(`/membros/${user?.membro?.id}`, dataToSend);
      setFormData(dataToSend);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Erro ao atualizar perfil.");
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Always apply CPF mask
    value = value.replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
      
    setDocumentValue(value);
    if (errors.document) setErrors(prev => ({ ...prev, document: "" }));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-primary font-montserrat">
      <main className="w-5/6 m-auto grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 md:px-8 pb-8 pt-32">
        {/* Left Column - Same as AreaMembro for consistency */}
        <aside className="lg:col-span-3 space-y-6">
          <MemberProfileCard isProfilePage={true} user={user} />
        </aside>

        {/* Center Column - Profile Details */}
        <section className="lg:col-span-9 space-y-6">
          {/* Minhas Informações (Tabs: Dados Pessoais / Endereço) */}
          <div className="bg-[#161616] rounded-xl p-6 border border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 pb-4 border-b border-white/10 gap-4">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setActiveTab("dados")}
                  className={`text-lg font-bold flex items-center gap-2 transition-colors ${activeTab === "dados" ? "text-white border-b-2 border-secondary pb-1" : "text-gray-500 hover:text-gray-300"}`}
                >
                  <FaUser
                    className={activeTab === "dados" ? "text-secondary" : ""}
                  />{" "}
                  Dados Pessoais
                </button>
                <button
                  onClick={() => setActiveTab("endereco")}
                  className={`text-lg font-bold flex items-center gap-2 transition-colors ${activeTab === "endereco" ? "text-white border-b-2 border-secondary pb-1" : "text-gray-500 hover:text-gray-300"}`}
                >
                  <FaMapMarkerAlt
                    className={activeTab === "endereco" ? "text-secondary" : ""}
                  />{" "}
                  Endereço
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
              {activeTab === "dados" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                  <ProfileInput
                    label="Nome Completo"
                    icon={<FaUser className="text-gray-500 text-xs" />}
                    type="text"
                    value={formData.nome}
                    readOnly
                    disabled
                  />

                  <ProfileInput
                    label="E-mail"
                    icon={<FaEnvelope className="text-gray-500 text-xs" />}
                    type="email"
                    value={formData.email}
                    readOnly
                    disabled
                  />

                  <ProfileInput
                    label="Telefone / WhatsApp"
                    icon={<FaPhone className="text-gray-500 text-xs" />}
                    type="text"
                    value={formData.telefone}
                    readOnly
                    disabled
                  />

                  <ProfileInput
                    label="Data de Nascimento"
                    icon={<FaCalendarAlt className="text-gray-500 text-xs" />}
                    type="date"
                    value={formData.dataNascimento}
                    readOnly
                    disabled
                  />

                  <ProfileInput
                    label="Documento (CPF)"
                    icon={<FaIdCard className="text-gray-500 text-xs" />}
                    type="text"
                    value={formData.cpf || ""}
                    readOnly
                    disabled
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                  <ProfileInput
                    label="Logradouro"
                    icon={<FaMapMarkerAlt className="text-gray-500 text-xs" />}
                    value={formData.endereco}
                    readOnly
                    disabled
                    className="md:col-span-2"
                  />

                  <ProfileInput
                    label="Bairro"
                    icon={<FaBuilding className="text-gray-500 text-xs" />}
                    value={formData.bairro}
                    readOnly
                    disabled
                  />

                  <ProfileInput
                    label="CEP"
                    icon={<FaMap className="text-gray-500 text-xs" />}
                    value={formData.cep}
                    readOnly
                    disabled
                  />

                  <ProfileInput
                    label="Cidade"
                    icon={<FaBuilding className="text-gray-500 text-xs" />}
                    value={formData.cidade}
                    readOnly
                    disabled
                  />

                  <ProfileInput
                    label="Estado"
                    icon={<FaFlag className="text-gray-500 text-xs" />}
                    value={formData.estado}
                    readOnly
                    disabled
                  />
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
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                  <div className="flex gap-6 mb-6 border-b border-white/10 pb-2">
                    <button
                      onClick={() => setActiveTab("dados")}
                      className={`text-sm font-bold uppercase pb-2 transition-colors relative ${activeTab === "dados" ? "text-secondary border-b-2 border-secondary" : "text-gray-500 hover:text-white"}`}
                    >
                      Dados Pessoais
                      {(errors.nome || errors.email || errors.telefone || errors.dataNascimento || errors.document) && (
                        <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("endereco")}
                      className={`text-sm font-bold uppercase pb-2 transition-colors relative ${activeTab === "endereco" ? "text-secondary border-b-2 border-secondary" : "text-gray-500 hover:text-white"}`}
                    >
                      Endereço
                      {(errors.endereco || errors.bairro || errors.cep || errors.cidade || errors.estado) && (
                        <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </button>
                  </div>

                  <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeTab === "dados" ? (
                      <>
                        <ProfileInput
                          label="Nome Completo"
                          icon={<FaUser className="text-gray-500 text-xs" />}
                          type="text"
                          name="nome"
                          value={editFormData.nome}
                          onChange={handleEditChange}
                          error={errors.nome}
                          placeholder="Seu nome completo"
                        />

                        <ProfileInput
                          label="E-mail"
                          icon={<FaEnvelope className="text-gray-500 text-xs" />}
                          type="email"
                          name="email"
                          value={editFormData.email}
                          onChange={handleEditChange}
                          error={errors.email}
                          placeholder="seu@email.com"
                        />

                        <ProfileInput
                          label="Telefone / WhatsApp"
                          icon={<FaPhone className="text-gray-500 text-xs" />}
                          type="text"
                          name="telefone"
                          value={editFormData.telefone}
                          onChange={handleEditChange}
                          error={errors.telefone}
                          placeholder="(00) 00000-0000"
                        />

                        <ProfileInput
                          label="Data de Nascimento"
                          icon={<FaCalendarAlt className="text-gray-500 text-xs" />}
                          type="date"
                          name="dataNascimento"
                          value={editFormData.dataNascimento}
                          onChange={handleEditChange}
                          error={errors.dataNascimento}
                        />

                        <ProfileInput
                          label="Documento (CPF)"
                          icon={<FaIdCard className="text-gray-500 text-xs" />}
                          type="text"
                          value={documentValue}
                          onChange={handleDocumentChange}
                          error={errors.document}
                          placeholder="000.000.000-00"
                        />
                      </>
                    ) : (
                      <>
                        <ProfileInput
                          label="Logradouro"
                          icon={<FaMapMarkerAlt className="text-gray-500 text-xs" />}
                          type="text"
                          name="endereco"
                          value={editFormData.endereco}
                          onChange={handleEditChange}
                          error={errors.endereco}
                          className="md:col-span-2"
                          placeholder="Rua, Número, Complemento"
                        />

                        <ProfileInput
                          label="Bairro"
                          icon={<FaBuilding className="text-gray-500 text-xs" />}
                          type="text"
                          name="bairro"
                          value={editFormData.bairro}
                          onChange={handleEditChange}
                          error={errors.bairro}
                          placeholder="Bairro"
                        />

                        <ProfileInput
                          label="CEP"
                          icon={<FaMap className="text-gray-500 text-xs" />}
                          type="text"
                          name="cep"
                          value={editFormData.cep}
                          onChange={handleEditChange}
                          error={errors.cep}
                          placeholder="00000-000"
                        />

                        <ProfileInput
                          label="Cidade"
                          icon={<FaBuilding className="text-gray-500 text-xs" />}
                          type="text"
                          name="cidade"
                          value={editFormData.cidade}
                          onChange={handleEditChange}
                          error={errors.cidade}
                          placeholder="Cidade"
                        />

                        <ProfileInput
                          label="Estado"
                          icon={<FaFlag className="text-gray-500 text-xs" />}
                          type="text"
                          name="estado"
                          value={editFormData.estado}
                          onChange={handleEditChange}
                          error={errors.estado}
                          placeholder="UF"
                        />
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
                <h3 className="text-sm text-gray-400 font-bold uppercase mb-3 ml-1">
                  Iniciais
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CourseCard
                    title="START"
                    subtitle="Fundamentos da fé"
                    status="concluido"
                  />
                  <CourseCard
                    title="DNA FIRE"
                    subtitle="Cultura da igreja"
                    status="em_andamento"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm text-gray-400 font-bold uppercase mb-3 ml-1">
                  Liderança
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CourseCard
                    title="Liderança Exponencial"
                    subtitle="Módulo 1"
                    status="nao_iniciado"
                    borderClass="border-blue-500"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm text-gray-400 font-bold uppercase mb-3 ml-1">
                  Outros
                </h3>
                <p className="text-xs text-gray-500 italic ml-1">
                  Nenhum outro curso registrado.
                </p>
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
              <ReadingPlanCard
                title="Bíblia em 1 Ano"
                subtitle="Plano anual completo"
                progress={45}
                currentDay={164}
                totalDays={365}
              />

              <ReadingPlanCard
                title="Novo Testamento"
                subtitle="Leitura devocional"
                progress={12}
                currentDay={10}
                totalDays={90}
                barColorClass="bg-blue-500"
                circleColorClass="bg-blue-500/10 group-hover:bg-blue-500/20"
              />
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
              {events.length === 0 ? (
                 <p className="text-gray-500 text-sm">Nenhum evento agendado.</p>
              ) : (
                events.map((event) => {
                  const eventDate = new Date(event.dataInicio);
                  const month = eventDate.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
                  const day = eventDate.getDate().toString().padStart(2, '0');
                  const time = eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                  
                  // Check if user has a scale for this event
                  const scale = userScales.find(s => 
                    (s.eventoRel?.id === event.id)
                  );
          
                  return (
                    <div key={event.id} className="flex gap-4 items-start">
                      <div className="bg-[#252525] w-14 h-14 rounded-lg flex flex-col items-center justify-center border border-white/5 shrink-0">
                        <span className="text-[10px] uppercase text-gray-400 font-bold">
                          {month}
                        </span>
                        <span className="text-xl font-bold text-white">{day}</span>
                      </div>
                      <div className={`flex-1 bg-[#252525] p-4 rounded-lg border-l-4 ${scale ? 'border-secondary' : 'border-purple-500'}`}>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-white">
                            {event.nome}
                          </h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            scale 
                              ? 'bg-secondary/20 text-secondary' 
                              : 'bg-purple-500/20 text-purple-500'
                          }`}>
                            {scale ? 'Escalado' : 'Evento'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mb-2">
                          {scale ? (
                            <span className="flex items-center gap-1">
                              <span className="text-gray-400">Atividade:</span>
                              <span className="text-secondary font-bold uppercase">{scale.atividade.name}</span>
                            </span>
                          ) : (
                            event.descricao || "Evento da Igreja"
                          )}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaClock /> {time}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt /> {event.local || "Templo Principal"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
