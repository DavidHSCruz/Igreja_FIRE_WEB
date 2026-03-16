import { useCallback, useEffect, useState } from "react";
import type { AxiosError } from "axios";
import {
  FaTimes,
  FaCalendarAlt,
  FaCheck,
  FaPlus,
  FaTrash,
  FaSearch,
} from "react-icons/fa";
import { api } from "../../services/api";
import type {
  ScaleGroup,
  ScaleItem,
  ScaleOriginalItem,
} from "../ScaleCard/ScaleCard";

interface Evento {
  id: string;
  nome: string;
  dataInicio: string;
  local: string;
}

interface Atividade {
  id: string;
  name: string;
}

interface Atuacao {
  id: string;
  atividade: {
    id: string;
    name: string;
  };
}

interface Member {
  id: string;
  nome: string;
  atuacoes: Atuacao[];
  user?: {
    avatarUrl?: string;
  };
}

interface CreateScaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextId: string;
  contextType: "area" | "ministerio";
  initialData?: ScaleGroup | null;
}

interface ScaleRow {
  id: string; // internal id for React key
  atividadeId: string;
  membroId: string;
  searchTerm: string;
  scaleId?: string; // backend ID if exists
  originalMembroId?: string; // For change tracking
}

type SourceItem = ScaleItem | ScaleOriginalItem;

const getApiErrorMessage = (error: unknown): string | null => {
  const axiosError = error as AxiosError<unknown>;
  const data = axiosError.response?.data;
  if (data && typeof data === "object" && "message" in data) {
    const msg = (data as { message?: unknown }).message;
    if (typeof msg === "string") return msg;
  }
  return null;
};

export const CreateScaleModal = ({
  isOpen,
  onClose,
  contextId,
  initialData,
}: CreateScaleModalProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [membros, setMembros] = useState<Member[]>([]);

  const [selectedEventId, setSelectedEventId] = useState("");
  const [rows, setRows] = useState<ScaleRow[]>([]);

  // Track which row has the dropdown open
  const [openDropdownRowId, setOpenDropdownRowId] = useState<string | null>(
    null,
  );

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [eventosRes, atividadesRes, membrosRes] = await Promise.all([
        api.get("/eventos"),
        api.get(`/atividades/by-area-ministerio/${contextId}`),
        api.get(`/membros/by-area-ministerio/${contextId}`),
      ]);

      const sortedEventos = eventosRes.data.sort(
        (a: Evento, b: Evento) =>
          new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime(),
      );

      setEventos(sortedEventos);
      const fetchedAtividades = atividadesRes.data;
      setAtividades(fetchedAtividades);
      setMembros(membrosRes.data);

      if (initialData) {
        // Edit Mode: Pre-populate
        // Find event
        // Need to match by exact date and name because names can duplicate
        const foundEvent = sortedEventos.find((e: Evento) => {
          if (initialData.eventoId && e.id === initialData.eventoId)
            return true;

          const eventDate = new Date(e.dataInicio).toISOString().split("T")[0];
          const initDate = new Date(initialData.data)
            .toISOString()
            .split("T")[0];
          return e.nome === initialData.evento && eventDate === initDate;
        });

        if (foundEvent) {
          setSelectedEventId(foundEvent.id);
        } else {
          // Fallback: If event not found in list (maybe old event), we can't edit properly or need to handle manual entry
          // For now, let's assume it exists or just select empty
          console.warn("Event not found for editing:", initialData.evento);
        }

        // Populate Rows
        const sourceItems = initialData.originalItems || initialData.items;
        const initialRows: ScaleRow[] = (sourceItems as SourceItem[]).map(
          (item) => {
            const roleName =
              "role" in item
                ? item.role
                : item.roles.split(",")[0]?.trim() || item.roles;
            const atividade = fetchedAtividades.find(
              (a: Atividade) => a.name === roleName,
            );
            const isPlaceholder = item.name === "Disponível";
            return {
              id: Math.random().toString(36).substr(2, 9),
              atividadeId: atividade?.id || "",
              membroId: isPlaceholder ? "" : item.membroId || "",
              searchTerm: isPlaceholder ? "" : item.name,
              scaleId: item.scaleId,
              originalMembroId: isPlaceholder ? "" : item.membroId || "",
            };
          },
        );

        setRows(initialRows);
      } else {
        // Create Mode
        setSelectedEventId("");
        setRows([]);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      alert("Erro ao carregar dados para criar escala.");
    } finally {
      setLoading(false);
    }
  }, [contextId, initialData]);

  useEffect(() => {
    if (!isOpen) return;
    fetchInitialData();
    setStep(1);
    setOpenDropdownRowId(null);
  }, [fetchInitialData, isOpen]);

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        atividadeId: "",
        membroId: "",
        searchTerm: "",
      },
    ]);
  };

  const handleRemoveRow = (rowId: string) => {
    setRows((prev) => prev.filter((r) => r.id !== rowId));
  };

  const handleRowChange = (
    rowId: string,
    field: keyof ScaleRow,
    value: string,
  ) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id === rowId) {
          const updatedRow = { ...row, [field]: value };

          // If changing search term, clear selected member if it doesn't match anymore (optional, but good UX to verify)
          if (field === "searchTerm") {
            // We don't clear membroId immediately to allow fixing typos,
            // but usually if user types, they are searching.
            // Let's keep memberId until they select a new one or clear it.
            // Actually, if they type, it implies a new search.
            // But maybe they are just correcting the name?
            // Let's reset memberId if they type, forcing a selection.
            // updatedRow.membroId = '';
            // Let's NOT clear it automatically to avoid annoyance, but logic is up to UX.
            // User said: "se digitar o nome aparece o membro... ele atualiza com onChange"
            // If I type "Gui", I see "Guilherme". I click "Guilherme".
          }
          return updatedRow;
        }
        return row;
      }),
    );

    if (field === "searchTerm") {
      setOpenDropdownRowId(rowId);
    }
  };

  const selectMember = (rowId: string, member: Member) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            membroId: member.id,
            searchTerm: member.nome,
          };
        }
        return row;
      }),
    );
    setOpenDropdownRowId(null);
  };

  const getFilteredMembers = (term: string) => {
    if (!term) return [];
    const lowerTerm = term.toLowerCase();
    return membros.filter(
      (m) =>
        m.nome.toLowerCase().includes(lowerTerm) ||
        m.atuacoes?.some((a) =>
          a.atividade?.name.toLowerCase().includes(lowerTerm),
        ),
    );
  };

  const handleDelete = async () => {
    if (!initialData) return;

    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir esta escala? Todas as atividades vinculadas a ela serão removidas.",
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);

      // Get all unique scale IDs associated with this event group
      const originalItems: Array<
        Pick<SourceItem, "scaleId" | "membroId" | "name">
      > = (initialData.originalItems || initialData.items) as Array<
        Pick<SourceItem, "scaleId" | "membroId" | "name">
      >;
      const scalesToDelete = new Set<string>();

      originalItems.forEach((item) => {
        if (item.scaleId) {
          scalesToDelete.add(item.scaleId);
        }
      });

      if (scalesToDelete.size === 0) {
        alert("Nenhuma escala encontrada para excluir.");
        return;
      }

      for (const id of scalesToDelete) {
        try {
          // First remove all volunteers associated with this scale
          const itemsWithThisScale = originalItems.filter(
            (item) => item.scaleId === id,
          );
          for (const item of itemsWithThisScale) {
            if (item.membroId) {
              try {
                await api.delete(`/escalas/${id}/voluntarios/${item.membroId}`);
              } catch (e) {
                console.warn(
                  `Failed to delete volunteer ${item.membroId} from scale ${id}`,
                  e,
                );
              }
            }
          }

          // Then delete the scale itself
          await api.delete(`/escalas/${id}`);
        } catch (e) {
          console.error(`Failed to delete scale ${id}`, e);
        }
      }

      alert("Escala excluída com sucesso!");
      onClose();
      window.location.reload();
    } catch (error: unknown) {
      console.error("Erro ao excluir escala:", error);
      alert(getApiErrorMessage(error) || "Erro ao excluir escala.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const selectedEvent = eventos.find((e) => e.id === selectedEventId);
    if (!selectedEvent) return;

    // Validation
    const validRows = rows.filter((r) => r.atividadeId);

    if (validRows.length === 0) {
      alert("Adicione pelo menos uma atividade.");
      return;
    }

    try {
      setLoading(true);

      // 1. Analyze Original State (Map ScaleID -> { ActivityID, MemberIDs })
      const originalScales = new Map<
        string,
        { id: string; activityId: string; memberIds: Set<string> }
      >();

      if (initialData && initialData.originalItems) {
        for (const item of initialData.originalItems) {
          if (!item.scaleId) continue;

          if (!originalScales.has(item.scaleId)) {
            // Find activity ID by name (item.role)
            const act = atividades.find((a) => a.name === item.role);
            if (act) {
              originalScales.set(item.scaleId, {
                id: item.scaleId,
                activityId: act.id,
                memberIds: new Set(),
              });
            }
          }

          const scaleEntry = originalScales.get(item.scaleId);
          if (scaleEntry && item.membroId) {
            scaleEntry.memberIds.add(item.membroId);
          }
        }
      }

      // 2. Analyze New State (Group by ActivityID -> Set<MemberID>)
      const newScales = new Map<string, Set<string>>();

      for (const row of rows) {
        if (!row.atividadeId) continue;

        if (!newScales.has(row.atividadeId)) {
          newScales.set(row.atividadeId, new Set());
        }

        // If row has a member, add it. If not (placeholder), we still created the group entry.
        if (row.membroId) {
          newScales.get(row.atividadeId)!.add(row.membroId);
        }
      }

      // 3. Reconcile (Process each target activity)
      const processedScaleIds = new Set<string>();

      for (const [activityId, newMembers] of newScales.entries()) {
        // Try to find a reusable scale from originalScales that has the SAME activity
        let targetScaleId: string | null = null;

        for (const [id, data] of originalScales.entries()) {
          if (data.activityId === activityId && !processedScaleIds.has(id)) {
            targetScaleId = id;
            break; // Reuse the first matching scale
          }
        }

        if (targetScaleId) {
          // --- UPDATE EXISTING SCALE ---
          processedScaleIds.add(targetScaleId);

          try {
            // Always PATCH scale details to ensure consistency (Event, Date, Local)
            await api.patch(`/escalas/${targetScaleId}`, {
              atividadeId: activityId,
              data: selectedEvent.dataInicio,
              evento: selectedEvent.nome,
              eventoId: selectedEvent.id,
              local: selectedEvent.local,
            });

            // Sync Volunteers
            const originalMembers =
              originalScales.get(targetScaleId)!.memberIds;

            // Remove members that are no longer in this activity
            for (const oldMemberId of originalMembers) {
              if (!newMembers.has(oldMemberId)) {
                await api
                  .delete(
                    `/escalas/${targetScaleId}/voluntarios/${oldMemberId}`,
                  )
                  .catch((e) =>
                    console.warn(
                      `Failed to remove volunteer ${oldMemberId}`,
                      e,
                    ),
                  );
              }
            }

            // Add members that are new to this activity
            for (const newMemberId of newMembers) {
              if (!originalMembers.has(newMemberId)) {
                await api.post(`/escalas/${targetScaleId}/voluntarios`, {
                  membroId: newMemberId,
                });
              }
            }
          } catch (e) {
            console.error(`Failed to update scale ${targetScaleId}`, e);
          }
        } else {
          // --- CREATE NEW SCALE ---
          try {
            const escalaRes = await api.post("/escalas", {
              atividadeId: activityId,
              data: selectedEvent.dataInicio,
              evento: selectedEvent.nome,
              eventoId: selectedEvent.id,
              local: selectedEvent.local,
            });

            const newScaleId = escalaRes.data.id;

            // Add Volunteers
            for (const memberId of newMembers) {
              await api.post(`/escalas/${newScaleId}/voluntarios`, {
                membroId: memberId,
              });
            }
          } catch (e) {
            console.error(
              `Failed to create scale for activity ${activityId}`,
              e,
            );
          }
        }
      }

      // 4. Delete Unused Scales (Scales that were in original but not reused)
      for (const [id, data] of originalScales.entries()) {
        if (!processedScaleIds.has(id)) {
          try {
            // Delete volunteers first
            for (const memberId of data.memberIds) {
              await api
                .delete(`/escalas/${id}/voluntarios/${memberId}`)
                .catch((e) =>
                  console.warn(
                    `Failed to clear volunteer ${memberId} from deleted scale`,
                    e,
                  ),
                );
            }
            // Delete scale
            await api.delete(`/escalas/${id}`);
          } catch (e) {
            console.error(`Failed to delete unused scale ${id}`, e);
          }
        }
      }

      alert("Escala salva com sucesso!");
      onClose();
      window.location.reload();
    } catch (error: unknown) {
      console.error("Erro ao salvar escalas:", error);
      alert(getApiErrorMessage(error) || "Erro ao salvar escalas.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#161616] w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#1A1A1A]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FaCalendarAlt className="text-red-500" />
            {initialData ? "Editar Escala" : "Nova Escala"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && step === 1 && eventos.length === 0 ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            <>
              {/* Step 1: Select Event */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">
                  Selecione o Evento
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                >
                  <option value="">Selecione...</option>
                  {eventos.map((evento) => (
                    <option key={evento.id} value={evento.id}>
                      {new Date(evento.dataInicio).toLocaleDateString()} -{" "}
                      {evento.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Activities & Volunteers (Only show if event selected) */}
              {selectedEventId && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-lg font-semibold text-white pt-4 border-t border-white/10">
                    Definir Voluntários
                  </h3>

                  <div className="text-xs text-gray-400 bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg mb-4">
                    <span className="text-yellow-500 font-bold">Nota:</span>{" "}
                    Novas escalas são criadas como{" "}
                    <strong className="text-yellow-500">PENDENTE</strong>. O
                    membro deve confirmar sua participação.
                  </div>

                  <div className="space-y-3">
                    {rows.map((row) => (
                      <div
                        key={row.id}
                        className="bg-[#0F0F0F] p-4 rounded-xl border border-white/5 space-y-3 relative"
                      >
                        <div className="flex gap-3">
                          {/* Activity Select */}
                          <div className="flex-1">
                            <label className="text-xs text-gray-500 mb-1 block">
                              Atividade
                            </label>
                            <select
                              value={row.atividadeId}
                              onChange={(e) =>
                                handleRowChange(
                                  row.id,
                                  "atividadeId",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                            >
                              <option value="">Selecione...</option>
                              {atividades.map((a) => (
                                <option key={a.id} value={a.id}>
                                  {a.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Member Search */}
                          <div className="flex-[1.5] relative">
                            <label className="text-xs text-gray-500 mb-1 block">
                              Voluntário
                            </label>
                            <div className="relative">
                              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                              <input
                                type="text"
                                placeholder="Buscar por nome ou função..."
                                value={row.searchTerm}
                                onChange={(e) =>
                                  handleRowChange(
                                    row.id,
                                    "searchTerm",
                                    e.target.value,
                                  )
                                }
                                onFocus={() => setOpenDropdownRowId(row.id)}
                                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg pl-8 pr-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                              />
                            </div>

                            {/* Dropdown Results */}
                            {openDropdownRowId === row.id && row.searchTerm && (
                              <div className="absolute z-10 left-0 right-0 mt-1 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                                {getFilteredMembers(row.searchTerm).length >
                                0 ? (
                                  getFilteredMembers(row.searchTerm).map(
                                    (m) => (
                                      <button
                                        key={m.id}
                                        onClick={() => selectMember(row.id, m)}
                                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                                      >
                                        <div className="w-6 h-6 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                                          {m.user?.avatarUrl ? (
                                            <img
                                              src={m.user.avatarUrl}
                                              alt={m.nome}
                                              className="w-full h-full object-cover"
                                            />
                                          ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                                              {m.nome.charAt(0)}
                                            </div>
                                          )}
                                        </div>
                                        <div>
                                          <div className="font-medium">
                                            {m.nome}
                                          </div>
                                          <div className="text-xs text-gray-500 truncate max-w-[180px]">
                                            {m.atuacoes
                                              ?.map((a) => a.atividade.name)
                                              .join(", ")}
                                          </div>
                                        </div>
                                      </button>
                                    ),
                                  )
                                ) : (
                                  <div className="px-3 py-2 text-xs text-gray-500">
                                    Nenhum membro encontrado
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveRow(row.id)}
                            className="mt-5 text-gray-500 hover:text-red-500 transition-colors px-2"
                            title="Remover linha"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {rows.length === 0 && (
                      <div className="text-center py-8 text-gray-500 border border-dashed border-white/10 rounded-xl">
                        Nenhuma atividade adicionada.
                      </div>
                    )}

                    <button
                      onClick={handleAddRow}
                      className="w-full py-3 border border-dashed border-white/20 rounded-xl text-gray-400 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <FaPlus />
                      Adicionar Atividade
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-white/10">
          {initialData && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-6 py-3 bg-red-900/50 hover:bg-red-900 text-red-200 rounded-lg font-semibold transition-colors flex items-center gap-2 mr-auto"
            >
              <FaTrash size={14} />
              Excluir
            </button>
          )}
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-[#202020] hover:bg-[#303030] text-white rounded-lg font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <FaCheck />
                Salvar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
