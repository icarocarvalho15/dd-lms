# 🎓 DravDev Academy - LMS Platform

Sistema de Gestão de Aprendizagem (LMS) desenvolvido para centralizar e organizar os treinamentos internos da empresa. Uma solução Fullstack moderna, rápida e escalável.

## 🚀 Tecnologias Utilizadas

### Back-end
- **Laravel 12**: Framework PHP de última geração.
- **SQLite/MySQL**: Suporte a banco de dados relacional (Configurado via `.env`).
- **Eloquent ORM**: Gestão de banco de dados, relacionamentos e ordenação inteligente.
- **DomPDF**: Geração dinâmica de certificados em PDF com carga horária.

### Front-end
- **React + TypeScript**: Interface reativa e tipagem segura (Strict Mode).
- **Tailwind CSS**: Estilização moderna, responsiva e com foco em UX Corporativa.
- **Axios**: Consumo de API com interceptors e variáveis de ambiente (`.env`).
- **Canvas Confetti**: Celebração visual ao concluir treinamentos.

---

## 🛠️ Como rodar o projeto

### 1. Back-end (Api)
```bash
cd api
composer install
# Caso use SQLite: touch database/database.sqlite
cp .env.example .env
php artisan key:generate
php artisan storage:link
php artisan migrate --seed
php artisan serve
```

### 2. Front-end (Client)
```bash
cd client
npm install
cp .env.example .env # Configure o VITE_API_URL no seu .env
npm run dev
```

---

## 📋 Funcionalidades Atuais
**👨‍🎓 Visão do Aluno**
- **[x] Dashboard Dinâmico**: Visualização de progresso e estatísticas de aprendizado.
- **[x] Listagem Inteligente**: Cursos exibidos por ordem de lançamento (mais recentes primeiro).
- **[x] Player de Aula**: Sidebar interativa com módulos e status de conclusão.
- **[x] Sistema de Progresso**: Contagem de porcentagem isolada por curso.
- **[x] Certificação Automática**: Geração de certificados com carga horária (minutos) ao atingir 100%.
- **[x] Links Permanentes**: Validação de certificados via URLs limpas.

**👨‍🏫 Visão do Instrutor (Corporativo)**
- **[x] Gestão Colaborativa**: Instrutores podem gerenciar cursos de forma centralizada.
- **[x] CRUD de Conteúdo**: Criação e edição de Cursos, Módulos e Aulas através de modais.
- **[x] Controle de Publicação**: Sistema de Rascunho/Publicado para controle de visibilidade.
- **[x] Interface Administrativa**: Tabela de ações centralizada com ícones intuitivos.

---

Desenvolvido por Ícaro Carvalho (DravDev)