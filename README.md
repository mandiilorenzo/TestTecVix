# Entrega do Teste Técnico - Amanda Monteiro Di Lorenzo

Este repositório contém a resolução completa do desafio Full Stack da Vituax. O projeto foi desenvolvido seguindo padrões de arquitetura e código limpo.

---

### Autenticação & Segurança
- [x] CRUD completo de usuários e sistema de Login/Register.
- [x] Autenticação robusta via **JWT** com proteção de rotas privadas.
- [x] Edição de perfil (contato, imagem e senha) com atualização em tempo real via **Zustand**.

### Gerenciamento de VMs (Cloud)
- [x] **Dashboard:** Gráficos de CPU/Memória e controle de Start/Stop funcional.
- [x] **Criação & Edição:** Fluxo completo de criação de VMs com seleção de OS e edição de hardware (vCPU, RAM, Disco).
- [x] **Filtros Avançados:** Busca por nome, status, MSP e o filtro "Apenas minhas VMs".
- [x] **Banco de Dados:** Updates no Prisma para colunas de `pass`, `location` e `hasBackup`.

### Administração (MSP & Funcionários)
- [x] **Cadastro MSP:** Implementação em 2 etapas com suporte a endereço e flag de POC.
- [x] **Funcionários:** Tela de cadastro responsiva.
- [x] **White Label:** Sistema de personalização de Logo e Domínio para administradores.

### Diferenciais Implementados
- [x] **Documentação Swagger:** API documentada e testável via `/docs`.

---

## Decisões Técnicas

* **Image Strategy:** As imagens enviadas em Base64 são convertidas no Backend e armazenadas como arquivos físicos na pasta `/uploads`. No banco de dados, salvamos apenas a URL. Isso evita sobrecarga no MySQL e melhora a performance.
* **State Management:** Uso de Zustand para garantir que as alterações de perfil reflitam instantaneamente no Header e Sidebar.
* **GitFlow:** Desenvolvimento organizado em branches `feature/*` com merge na `release`.

---

## Como Executar o Projeto (Docker)

1.  **Clone o repositório:** `git clone https://github.com/mandilorenzo/TestTecVix.git`
2.  **Configure os .env:** Utilize os arquivos `.env.example` como base.
3.  **Build & Run:**
    ```bash
    docker-compose up --build
    ```
4.  **Acesse:**
    - Frontend: `http://localhost:3000`
    - API/Swagger: `http://localhost:3001/docs`

---

## Credenciais de Teste

| Role | Email | Senha |
| :--- | :--- | :--- |
| **Admin** | admin@vituax.com | Admin@123 |
| **Manager** | manager@vituax.com | Manager@123 |
| **Member** | member@vituax.com | Member@123 |

---

## Nota Técnica
Foi identificado que o envio de imagens em Base64 via JSON pode atingir limites de buffer em alguns ambientes (Erro 431). Apliquei a mitigação via aumento de limites de payload no Express, mantendo a arquitetura de conversão para arquivo físico no servidor.

---
**Amanda Monteiro Di Lorenzo** - 2026.