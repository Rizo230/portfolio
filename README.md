# Portfolio

## Overview

This repository contains the source code, documentation, and supporting infrastructure for my personal portfolio website.

The portfolio serves as a central hub for showcasing my software engineering, AI/ML, robotics, and infrastructure projects. It is built as a modern full-stack application using TypeScript and Go, with a focus on clean architecture, maintainability, and extensibility.

In addition to presenting completed projects, the website will provide interactive demonstrations, technical documentation, and live services hosted through my homelab.

---

## Goals

- Build a modern, responsive full-stack portfolio.
- Showcase software engineering, AI/ML, robotics, and infrastructure projects.
- Demonstrate full-stack development using TypeScript and Go.
- Host interactive demonstrations of machine learning and software projects.
- Continuously improve the platform as new projects are completed.

---

## Technology Stack

| Component            | Description                        |
| -------------------- | ---------------------------------- |
| Frontend             | Next.js 16 (React 19 + TypeScript) |
| Backend              | Go 1.26                            |
| Styling              | Tailwind CSS 4                     |
| API                  | REST health and contact endpoints  |
| Development Workflow | Git with local development servers |
| Deployment           | Docker & Homelab _(planned)_       |

---

## Repository Structure

```text
.
|-- frontend/        # Next.js frontend application
|-- backend/         # Go REST API
|-- .gitignore
`-- README.md
```

---

## Local Development

### Prerequisites

- Node.js 20.9 or newer
- npm
- Go 1.26 or newer

Start the backend from the repository root:

```bash
cd backend
go run .
```

The API runs at `http://localhost:8090` and exposes `GET /api/health` and
`POST /api/contact`.

For the contact form, copy `backend/.env.example` to `backend/.env` and set
`RESEND_API_KEY` and `TURNSTILE_SECRET_KEY`. `RESEND_FROM_EMAIL` should use a
verified Resend sender for production.

Copy `frontend/.env.example` to `frontend/.env.local` and set
`NEXT_PUBLIC_TURNSTILE_SITE_KEY`. The frontend API base URL should point to the
same origin that proxies `/api` to the Go backend in production.

In a second terminal, start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001). The frontend still loads
when the API is offline and displays the backend status as unavailable.

---

## Current Features

| Feature           | Purpose                      | Status      |
| ----------------- | ---------------------------- | ----------- |
| Next.js frontend  | Portfolio user interface     | In Progress |
| Go backend        | REST API                     | In Progress |
| Project showcase  | Display example projects     | In Progress |
| Contact page      | Display contact information  | In Progress |
| Contact form      | Send messages through Resend | In Progress |
| Responsive design | Desktop & mobile support     | In Progress |
| Interactive demos | Live project demonstrations  | Planned     |

---

## Roadmap

### Foundation

- [x] Repository structure
- [x] Next.js frontend
- [x] Go backend
- [x] Development environment
- [x] Shared API health check
- [x] Global layout
- [x] Navigation
- [ ] Footer
- [x] Initial responsive design
- [ ] Docker development environment

### Portfolio

- [x] Home page
- [x] About page
- [x] Projects page
- [x] Contact page
- [x] Individual project pages
- [ ] Resume
- [x] Contact form

### Interactive Projects

- [ ] AI handwriting analysis
- [ ] Machine learning visualisations
- [ ] Home lab dashboard integration
- [ ] Trading system demonstrations
- [ ] Live API examples

---

## Status

This repository is under active development as new projects and technologies are added. The portfolio will continue to evolve alongside my software engineering, AI/ML, robotics, and infrastructure experience, serving as both a showcase of completed work and a platform for interactive technical demonstrations.
