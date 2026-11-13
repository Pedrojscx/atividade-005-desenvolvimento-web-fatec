// Atualização da mensagem e dos campos do resultado
export function showMensagem(textMensagem, texto) {
  textMensagem.textContent = texto;
}

export function fillResultado(dadosCep) {
  document.getElementById("valor-cep").textContent = dadosCep.cep;
  document.getElementById("valor-logradouro").textContent = dadosCep.logradouro || "Não informado";
  document.getElementById("valor-bairro").textContent = dadosCep.bairro || "Não informado";
  document.getElementById("valor-cidade").textContent = dadosCep.localidade;
  document.getElementById("valor-uf").textContent = dadosCep.uf;
  document.getElementById("valor-ibge").textContent = dadosCep.ibge;
}
