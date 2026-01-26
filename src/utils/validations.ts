export const validateCPF = (cpf: string) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  let soma = 0;
  let resto;
  for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  return true;
};

export const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string) => {
  // Accepts formats like (11) 99999-9999 or 11999999999
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
};

export const validateDate = (date: string) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return false;
  // Optional: Check if date is not in the future
  if (d > new Date()) return false;
  return true;
};

export const validateCEP = (cep: string) => {
  const cleaned = cep.replace(/\D/g, '');
  return cleaned.length === 8;
};

export const validateRequired = (value: string) => {
  return value && value.trim().length > 0;
};

export const validateState = (estado: string) => {
  return estado && estado.trim().length === 2;
};

export const validateAddressSection = (data: { endereco: string, bairro: string, cep: string, cidade: string, estado: string }) => {
  const errors: { [key: string]: string } = {};
  
  if (!validateRequired(data.endereco)) errors.endereco = "Endereço é obrigatório";
  if (!validateRequired(data.bairro)) errors.bairro = "Bairro é obrigatório";
  if (!validateCEP(data.cep)) errors.cep = "CEP inválido (formato: 00000-000)";
  if (!validateRequired(data.cidade)) errors.cidade = "Cidade é obrigatória";
  if (!validateState(data.estado)) errors.estado = "Estado inválido (UF)";
  
  return errors;
};
