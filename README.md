# ResearchGPT — AI-Powered Research Assistant

An AI SaaS application for uploading research papers, chatting with them via RAG,
comparing papers, detecting research gaps, and generating literature reviews.

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, React Query
- **Backend:** Java 21, Spring Boot 3, Maven
- **Database:** PostgreSQL + pgvector
- **Security:** Spring Security + JWT
- **AI:** Spring AI, OpenAI API + Embeddings
- **PDF:** Apache PDFBox, Apache Tika
- **Cache:** Redis
- **Deploy:** Docker, Docker Compose, GitHub Actions, AWS

## Project Status: Phase 1 — Initialization ✅

This phase sets up the skeleton only:
- Spring Boot backend boots with empty clean-architecture package structure
- Next.js frontend boots with dark-mode landing page + stub routes for every page
- Docker Compose provisions Postgres (pgvector-ready image) + Redis

## Folder Structure

```
researchgpt/
├── backend/     # Spring Boot 3 (Java 21) API
├── frontend/    # Next.js 15 (React 19 + TS) UI
├── docs/        # Architecture notes, ADRs
├── docker/      # docker-compose.yml
└── .github/     # CI/CD workflows (added in Phase 15)
```

## Running Locally

### 1. Start infrastructure
```bash
cd docker
docker-compose up -d
```

### 2. Start backend
```bash
cd backend
mvn spring-boot:run
```
Backend runs on `http://localhost:8080`

### 3. Start frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`

## Roadmap

| Phase | Feature |
|---|---|
| 1 | Project Initialization ✅ |
| 2 | Authentication (JWT + Spring Security) |
| 3 | Dashboard UI |
| 4 | PDF Upload |
| 5 | PDF Text Extraction |
| 6 | Text Chunking |
| 7 | Embedding Generation |
| 8 | Vector Database (pgvector) |
| 9 | RAG Chat |
| 10 | Compare Papers |
| 11 | Research Gap Detection |
| 12 | Literature Review Generator |
| 13 | Citation Generator |
| 14 | Conversation History |
| 15 | Deployment |
