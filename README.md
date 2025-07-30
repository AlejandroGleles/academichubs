# AcademicHubVS1.5 📚

Sistema de gestão escolar completo com backend em Go e frontend em JavaScript, integrado a um banco de dados SQLite.

---

## 🧠 Sobre o Projeto

AcademicHubVS1.5 é uma plataforma para gerenciamento escolar com funções básicas e essenciais:
- Cadastro e gerenciamento de **turmas**, **professores** e **alunos**.
- Controle de **atividades** e atribuição de notas.
- Operações completas de **CRUD** (Create, Read, Update, Delete) via API em Go.

---

## 🧩 Tecnologias Utilizadas

- **Backend**: Go (com handlers, rotas, schemas e lógica para GET, POST, PUT, DELETE)
- **Frontend**: JavaScript puro para comunicação via API com o backend
- **Banco de Dados**: SQLite

---

## 🚀 Funcionalidades

- Endpoints REST para gerenciar:
  - Turmas
  - Professores
  - Alunos
  - Atividades e notas
- Comunicação via HTTP com JSON utilizando JavaScript no frontend.
- Validação básica e tratamento de erros no backend.
- Estrutura modular: handlers, rotas e schemas separados e organizados.

---

## 🛠 Instalação e Execução

### Backend (Go + SQLite)

1. **Pré-requisitos**: Go instalado e SQLite disponível.
2. Clone o repositório e entre na pasta do backend:

```bash
git clone https://github.com/AlejandroGleles/academichubvs1.5.git
cd academichubvs1.5/backend
Instale dependências (se houver):

bash
Copiar
Editar
go mod tidy
Execute o servidor:

bash
Copiar
Editar
go run main.go
O servidor rodará por padrão em http://localhost:8080 (ou conforme configurado).

Frontend (JavaScript)
No navegador, abra o arquivo index.html ou acesse via servidor local (ex: Live Server).

Acesse o frontend em http://localhost:xxxx/index.html para interagir com a API.

🧪 Estrutura do Projeto
pgsql
Copiar
Editar
/
├── backend/
│   ├── handlers/     ← código dos endpoints (PUT, GET, etc.)
│   ├── routes/       ← definição das rotas REST
│   ├── schemas/      ← modelos de dados para turmas, alunos, etc.
│   └── main.go       ← inicialização do servidor e conexão SQLite
└── frontend/
    ├── index.html
    ├── app.js        ← lógica JavaScript para chamadas à API
    └── styles.css    ← estilos (opcional)
📋 Exemplos de Endpoints
GET /turmas – lista todas as turmas

POST /alunos – cadastra novo aluno

PUT /professores/{id} – atualiza dados do professor

DELETE /atividades/{id} – remove atividade existente

🎯 Como Contribuir
Todo feedback e contribuições são bem-vindas! Se quiser sugerir melhorias ou novas funcionalidades, é só abrir uma issue ou enviar um pull request.

📄 Licença
Este projeto está sob a licença MIT, permitindo uso, modificação e distribuição com liberdade.
