export type Atividade = {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  atuacaoId?: string;
  papel?: string;
};

export type Ministerio = {
  id: string;
  name: string;
  description?: string;
  papel: string;
  atividades: Atividade[];
};

export type Area = {
  id: string;
  name: string;
  description?: string;
  papel: string;
  atividades: Atividade[];
};

export type Escala = {
  id: string;
  data: string;
  evento: string;
  atividade: Atividade;
  local: string;
  tipo: string;
};

export type User = {
  id: string;
  email: string;
  systemRole: string;
  avatarUrl?: string;
  membro?: {
    id: string;
    nome: string;
    email: string;
    dataNascimento: string;
    color?: string;
    igreja?: {
      id: string;
    };
    ministerios?: Ministerio[];
    areas?: Area[];
    escalas?: Escala[];
  };
};
