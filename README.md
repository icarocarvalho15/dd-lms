# 🎓 DravDev Academy - LMS Platform

Sistema de Gestão de Aprendizagem (LMS) desenvolvido para centralizar e organizar os treinamentos internos da empresa. Uma solução Fullstack moderna, rápida e escalável.

## 🚀 Tecnologias Utilizadas

### Back-end
- **Laravel 12**: Framework PHP de última geração.
- **MySQL**: Banco de dados relacional.
- **Eloquent ORM**: Gestão de banco de dados e relacionamentos.

### Front-end
- **React + TypeScript**: Interface reativa e tipagem segura.
- **Tailwind CSS**: Estilização moderna e responsiva.
- **Axios**: Consumo de API.

---

## 🛠️ Como rodar o projeto

### 1. Back-end (API)
```bash
cd api
composer install
cp .env.example .env # Configure seu banco de dados aqui
php artisan key:generate
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
- **[x] Arquitetura Fullstack separada (API/Client).**
- **[x] Banco de dados estruturado (Cursos, Módulos e Aulas).**
- **[x] Seeders para geração de dados de teste.**
- **[x] Listagem dinâmica de cursos com React.**
- **[x] Design responsivo com Tailwind CSS.**

---

Desenvolvido por Ícaro Carvalho (DravDev)