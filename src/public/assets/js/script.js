import { validateCep, formatCep } from "./cep.js";
import { fetchCep } from "./viacep.js";
import { showMensagem, fillResultado } from "./ui.js";

// Referências aos elementos da página
const formCep = document.getElementById("cep-form");
const inputCep = document.getElementById("cep");
const textMensagem = document.getElementById("mensagem");
const areaResultado = document.getElementById("resultado");

formCep.addEventListener("submit", searchEndereco);

// Consulta o endereço ao enviar o formulário
async function searchEndereco(event) {
  event.preventDefault();
  areaResultado.hidden = true;

  const cepDigitado = inputCep.value.trim();

  if (!validateCep(cepDigitado)) {
    showMensagem(textMensagem, "CEP inválido. Digite 12328070 ou 12328-070.");
    return;
  }

  showMensagem(textMensagem, "Consultando...");
  inputCep.disabled = true;

  const cepLimpo = formatCep(cepDigitado);

  try {
    const resposta = await fetchCep(cepLimpo);

    if (!resposta.ok) {
      showMensagem(textMensagem, "Erro ao consultar o ViaCEP.");
      return;
    }

    const dadosCep = await resposta.json();

    if (dadosCep.erro) {
      showMensagem(textMensagem, "CEP não encontrado.");
      return;
    }

    fillResultado(dadosCep);
    areaResultado.hidden = false;
    showMensagem(textMensagem, "Resposta do ViaCEP:");
  } catch {
    showMensagem(textMensagem, "Falha de conexão. Tente novamente.");
  } finally {
    inputCep.disabled = false;
    inputCep.focus();
  }
}
