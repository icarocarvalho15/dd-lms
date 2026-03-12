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

## 🚀 Sprint: Sistema de Certificação e Avaliações

Nesta etapa, transformamos a plataforma em uma escola real, com validação de aprendizado e gestão inteligente de mídia.

### 🆕 Novidades
- **Sistema de Quizzes dinâmicos**: Instrutores agora podem configurar avaliações finais para cada curso com nota mínima de aprovação.
- **Arquitetura Desacoplada**: Criação do `QuizController` para gerenciar perguntas, opções e correções de forma independente.
- **Gestão de Mídia Otimizada**: Implementada a exclusão física de arquivos de imagem no servidor ao atualizar ou deletar cursos (evitando arquivos órfãos).
- **Trilha de Aprendizado Blindada**: O certificado agora possui lógica de precedência: 100% das aulas concluídas + Aprovação na Avaliação Final.
- **QuizPlayer Component**: Interface interativa para o aluno realizar a prova no lugar do conteúdo da aula.

### 🛠️ Tecnologias/Padrões Implementados
- **Eager Loading**: Otimização de queries N+1 para carregar cursos e progresso no Dashboard.
- **Relacionamentos Eloquent**: `Course` -> `Quiz` -> `Questions` -> `Options`.
- **UX/UI**: Bloqueio dinâmico do menu lateral e estado de aprovação em tempo real com React.

---

Desenvolvido por Ícaro Carvalho (DravDev)