# 🎓 DravDev Academy - LMS Platform

Sistema de Gestão de Aprendizagem (LMS) desenvolvido para centralizar e organizar os treinamentos internos da empresa. Uma solução Fullstack moderna, rápida e escalável.

## 🚀 Tecnologias Utilizadas

### Back-end
- **Laravel 12**: Framework PHP de última geração.
- **MySQL**: Banco de dados relacional.
- **Eloquent ORM**: Gestão de banco de dados e relacionamentos.
- **DomPDF**: Geração dinâmica de certificados em PDF.

### Front-end
- **React + TypeScript**: Interface reativa e tipagem segura (Strict Mode).
- **Tailwind CSS**: Estilização moderna, responsiva e com foco em UX Corporativa.
- **Axios**: Consumo de API com interceptors para autenticação.

---

## 🛠️ Como rodar o projeto

### 1. Back-end (Api)
```bash
cd api
composer install
touch database/database.sql
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
npm run dev
```

---

## 📋 Funcionalidades Atuais
**👨‍🎓 Visão do Aluno**
- **[x] Dashboard Dinâmico: Visualização de progresso e estatísticas de aprendizado.**
- **[x] Player de Aula: Sidebar interativa com módulos e status de conclusão.**
- **[x] Certificação Automática: Geração de certificados profissionais em PDF ao atingir 100% de progresso.**
- **[x] Links Permanentes: Validação de certificados via URLs limpas (sem prefixo /api).**

**👨‍🏫 Visão do Instrutor (Corporativo)**
- **[x] Gestão Colaborativa: Instrutores podem gerenciar cursos de forma centralizada.**
- **[x] CRUD de Conteúdo: Criação e edição de Cursos, Módulos e Aulas através de modais.**
- **[x] Controle de Publicação: Sistema de Rascunho/Publicado para controle de visibilidade.**
- **[x] Interface Administrativa: Tabela de ações centralizada com ícones intuitivos (Ver, Editar, Excluir).**

---

Desenvolvido por Ícaro Carvalho (DravDev)