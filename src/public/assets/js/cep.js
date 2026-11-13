// Validação e formatação do CEP digitado
export function validateCep(cep) {
  return /^\d{5}-?\d{3}$/.test(cep);
}

export function formatCep(cep) {
  return cep.replace("-", "");
}
