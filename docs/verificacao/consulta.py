# docs/verificacao/consulta.py
# Exercita a página de consulta num navegador real e imprime o resultado de cada cenário.
# As chamadas ao ViaCEP são interceptadas e respondidas com corpos gravados da API real,
# para que os cenários de erro (CEP inexistente, HTTP 400, queda de rede) sejam reproduzíveis.
# Uso: python3 docs/verificacao/consulta.py http://localhost:3001
import json, os, sys
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3001"

# Corpos copiados de https://viacep.com.br/ws/12328070/json/ e /ws/99999999/json/ em 13/11/2026
ENCONTRADO = {"cep": "12328-070", "logradouro": "Avenida Faria Lima", "complemento": "", "unidade": "",
              "bairro": "Jardim Santa Maria", "localidade": "Jacareí", "uf": "SP", "estado": "São Paulo",
              "regiao": "Sudeste", "ibge": "3524402", "gia": "3920", "ddd": "12", "siafi": "6589"}
NAO_ENCONTRADO = {"erro": "true"}

chamadas = []

def viacep(route):
    url = route.request.url
    chamadas.append(url)
    if "12328070" in url:
        route.fulfill(status=200, content_type="application/json", body=json.dumps(ENCONTRADO))
    elif "99999999" in url:
        route.fulfill(status=200, content_type="application/json", body=json.dumps(NAO_ENCONTRADO))
    elif "11111111" in url:
        route.abort()  # simula queda de rede
    else:
        route.fulfill(status=400, body="")

CENARIOS = ["12328-070", "12328070", "123", "12a28-070", "99999999", "22222222", "11111111"]

with sync_playwright() as p:
    navegador = p.chromium.launch(executable_path=os.environ.get("CHROME"))
    pagina = navegador.new_page()
    pagina.route("https://viacep.com.br/**", viacep)
    print("entrada\tfetch\tmensagem\tresultado\tcampo habilitado")
    for cep in CENARIOS:
        chamadas.clear()
        pagina.goto(BASE)
        pagina.fill("#cep", cep)
        pagina.press("#cep", "Enter")
        pagina.wait_for_function(
            "() => { const t = document.getElementById('mensagem').textContent; return t && t !== 'Consultando...'; }")
        visivel = not pagina.is_hidden("#resultado")
        print(f"{cep}\t{len(chamadas)}\t{pagina.text_content('#mensagem')}\t"
              f"{'visível' if visivel else 'oculto'}\t{not pagina.is_disabled('#cep')}")
    navegador.close()
