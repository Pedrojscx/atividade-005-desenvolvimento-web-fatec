# Atividade 5: Requisição HTTP com ViaCEP

Disciplina de Desenvolvimento Web I, Prof. Arley.

## Objetivo

Implementar a consulta de endereços por CEP em uma página servida por Node.js + Express, usando `fetch` para fazer a requisição HTTP à API pública do [ViaCEP](https://viacep.com.br/) e exibir o resultado na tela.

## Tecnologias

- Node.js 24+ com ES Modules
- Express
- dotenv
- HTML, CSS e JavaScript (sem bibliotecas no front)
- Docker e Docker Compose

## Estrutura de pastas

```txt
.
├── package.json
├── .env.example
├── Dockerfile
├── compose.yaml
└── src/
    ├── server/
    │   ├── main.js      # servidor Express
    │   └── paths.js     # caminho da pasta public
    └── public/
        ├── index.html
        └── assets/
            ├── css/index.css
            ├── images/
            └── js/
                ├── script.js   # fluxo da consulta (ponto de entrada)
                ├── cep.js      # validação e formatação do CEP
                ├── viacep.js   # requisição ao ViaCEP
                └── ui.js       # mensagens e preenchimento do resultado
```

## Como funciona a consulta

1. Ao enviar o formulário (Enter no campo), o envio padrão é cancelado e o resultado anterior é ocultado.
2. O CEP é validado: 8 dígitos, com ou sem hífen (`12328070` ou `12328-070`). Se for inválido, aparece "CEP inválido. Digite 12328070 ou 12328-070.".
3. Com o CEP válido, aparece "Consultando...", o campo é desabilitado e o hífen é removido.
4. É feito o `fetch` em `https://viacep.com.br/ws/{cep}/json/`.
5. Se o ViaCEP devolver a propriedade `erro`, aparece "CEP não encontrado.".
6. Se der certo, os campos CEP, logradouro, bairro, cidade, UF e código do IBGE são preenchidos e aparece "Resposta do ViaCEP:".
7. Falhas de rede mostram "Falha de conexão. Tente novamente.". Ao final, o campo volta a ficar habilitado e com foco.

## Executar fora do container

```bash
npm i
[ -f .env ] || cp .env.example .env
npm start        # ou: npm run dev
```

Acesse em http://localhost:3001.

## Executar dentro do container

```bash
docker compose up --build
```

Acesse em http://localhost:3002. Para parar:

```bash
docker compose down
```
