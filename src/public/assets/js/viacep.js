// Requisição à API do ViaCEP
export function fetchCep(cepLimpo) {
  return fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
}
