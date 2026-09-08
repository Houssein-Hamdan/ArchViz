# 🏗️ Archviz - AI-Powered Architecture Diagram Generator

> Transform project requirements into complete system architecture designs, data flows, trade-offs, implementation plans, and database schemas in seconds using Google Gemini AI.

🔗 **Live Demo:** [Archviz Live](https://arch-viz-nine.vercel.app) 
📂 **GitHub Repository:** https://github.com/Houssein-Hamdan/ArchViz/

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Problem & Solution](#-problem--solution)
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Challenges & Solutions](#-challenges--solutions)
- [Key Engineering Decisions](#-key-engineering-decisions--architecture-trade-offs)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Security](#-security)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)
- [Contact](#-contact--support)

---

## 🎯 Overview

**Archviz** is a modern Full-Stack web application that leverages Google Gemini AI to analyze software requirements and generate interactive architecture diagrams, step-by-step implementation roadmaps, trade-offs, and relational database schemas from simple text descriptions.

### Who is it for?

- 👨‍💻 **Junior Developers:** Learn system design patterns, data flows, and best practices.
- 🏢 **Engineering Teams:** Rapidly prototype and visualize system designs for new projects.
- 📊 **Tech Leads:** Document architecture and communicate trade-offs efficiently.
- 📚 **Educators & Students:** Visualize complex data flows and backend components easily.

---

## 🔍 Problem & Solution

### The Problem

When starting a new software project, developers face distinct hurdles:

1. **Unclear Architecture:** No standardized way to visualize multi-tier system designs quickly.
2. **Time-Consuming:** Drawing diagrams and designing database schemas manually takes hours.
3. **Implementation Confusion:** Difficulty breaking down large systems into sequential phases.
4. **Database Design:** Complex schema planning and entity relationships without clear visualization.
5. **Team Misalignment:** Hard to communicate tech-stack trade-offs to non-technical stakeholders.

### Our Solution

Archviz automates the entire planning process end-to-end:

```
User Input (Text Description)
         │
         ▼
Google Gemini API (Structured Prompting)
         │
         ▼
Backend Validation & JSON Parsing
         │
         ▼
┌─────────────────────────────────┐
│ • Interactive ReactFlow Diagram │
│ • Sequential Implementation Plan│
│ • ERD / Database Schema Design  │
│ • Component Trade-offs Analysis │
│ • Data Flow Visualization       │
│ • Shareable Links & Public Feed │
└─────────────────────────────────┘
```

---

## ✨ Features

### 1. 🤖 AI-Powered Architecture Generation

- **Smart Analysis:** Gemini API analyzes project requirements to recommend optimal components.
- **Auto-Suggestions:** Recommends appropriate tech stacks and architectural best practices.
- **Best Practices:** Applies industry-standard multi-tier design patterns automatically.
- **Multiple Options:** Ability to regenerate architectures with different prompt constraints.

### 2. 📐 Interactive Diagram Editor, Data Flows & Trade-offs

- **Visual Nodes:** Color-coded components representing:
  - 🎨 Frontend (Blue)
  - ⚙️ Backend (Green)
  - 🗄️ Database (Orange)
  - ⚡ Cache, Queues & External Services
- **Dynamic Edges:** Connections showing data flow paths between system components.
- **Interactive Controls:** Drag & drop components, click-to-edit, zooming, and panning using ReactFlow.
- **System Trade-offs:** Detailed breakdown of system architectural trade-offs per component.

### 3. 📋 Implementation Roadmap

Breaks down architecture into actionable development phases:

- **Phase 1: Foundation Setup** (Project initialization, DB setup, environment config).
- **Phase 2: Authentication** (User models, login/register, protected routes).
- **Phase 3: Core Features** (API endpoints, business logic, DB migrations).
- **Includes:** Actionable checklists, estimated completion times, and technical descriptions per phase.

### 4. 🗄️ Database Design & ERD

- **Entity Visualization:** Displays all database tables with primary keys, foreign keys, constraints, and column types (`int`, `string`, `text`, `timestamp`, etc.).
- **Relationship Mapping:** Visualizes 1:1, 1:N, and N:M relationships clearly between entities.
- **SQL Export:** Direct capability to copy generated `CREATE TABLE` SQL statements.

### 5. 🔐 OTP Email Authentication

- **Secure Registration:** One-Time Password (OTP) verification delivered via Gmail SMTP.
- **Email Verification:** Ensures valid email addresses and passwordless access.
- **Sanctum Tokens:** Secure Bearer token session management.

### 6. 🌐 Explore & Community Feed

- **Public Showcase:** Browse community-shared architectures with search by title/description.
- **Filter & Sort:** Filter by technology stack or sort by Recent, Popular, and Trending.
- **Social Interactions:** Like system (❤️), bookmarking (🔖), and view statistics metrics.

### 7. 📤 Share & Collaboration

- **Public Sharing:** Share architecture designs via public URLs.
- **Read-Only Mode:** Stakeholders can inspect system designs without editing.
- **No Login Required:** Easy public view access.

### 8. 📊 Personal Dashboard

- **My Architectures:** Centralized hub for all saved user projects with Quick Actions (View, Edit, Delete, Share).
- **Metrics Tracking:** Total projects created, views, and likes counter.

### 9. 🌙 Dark Mode Support

- Full dark theme compatibility across UI components, automatically matching system preferences with a manual header toggle.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React 18 Frontend                    │
│   (Zustand State, ReactFlow Diagrams, Tailwind CSS)     │
└───────────────────────────┬─────────────────────────────┘
                            │
                            │ REST API (Bearer Token)
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Laravel 12 Backend                    │
│                                                         │
│  ┌───────────────────┐ ┌─────────────────────────────┐ │
│  │ Sanctum Auth/OTP  │ │ Gemini Prompting Engine     │ │
│  └───────────────────┘ └──────────────┬──────────────┘ │
└───────────────────────────────────────┼─────────────────┘
                                        │
                                        │ JSON API Call
                                        ▼
                           ┌──────────────────────────┐
                           │    Google Gemini API     │
                           └──────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** React 18 + Vite
- **State Management:** Zustand
- **Styling:** Tailwind CSS v4
- **Diagram Engine:** ReactFlow
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Auth Management:** Laravel Sanctum + Bearer Tokens

### Backend

- **Framework:** Laravel 12
- **Database:** MySQL
- **Authentication:** Sanctum (Token-Based) + Email OTP
- **Email Service:** Gmail SMTP
- **AI Integration:** Google Gemini API
- **Rate Limiting:** Built-in Throttling Middleware

---

## 🔧 Challenges & Solutions

### Challenge 1: Handling Non-Deterministic JSON from Gemini API

**Problem:** Gemini API sometimes wraps JSON output in Markdown code blocks (` ```json `) or prepends/appends extra conversational text.

**Solution:** Implemented a backend sanitization pipeline in Laravel using regular expressions and validation fallbacks:

```php
// Clean markdown code blocks
$rawText = preg_replace('/^```json\s*/i', '', $rawText);
$rawText = preg_replace('/```\s*$/i', '', $rawText);

// Validate and parse
$decoded = json_decode(trim($rawText), true);

if (json_last_error() !== JSON_ERROR_NONE) {
    throw new Exception('Invalid JSON response from AI');
}
```

### Challenge 2: Architectural Data Structure Normalization

**Problem:** Need a unified schema supporting diagram nodes, implementation plans, data flows, trade-offs, and database designs consistently.

**Solution:** Built a validation layer in Laravel to guarantee structure integrity:

```php
protected function validateAndFixResponse(array $data): array
{
    $data['title'] = $data['title'] ?? 'Untitled';
    $data['nodes'] = $data['nodes'] ?? [];
    $data['implementation'] = $data['implementation'] ?? ['phases' => []];
    $data['database'] = $data['database'] ?? ['entities' => []];

    return $data;
}
```

### Challenge 3: Cross-Origin Resource Sharing (CORS)

**Problem:** Supporting multi-origin API access between Vercel (Frontend) and Railway/Server (Backend).

**Solution:** Configured strict origin matching in Laravel's `config/cors.php`:

```php
'allowed_origins' => [
    'http://localhost:5173',
    'https://archviz.vercel.app',
],
```

### Challenge 4: Authentication State Persistence

**Problem:** User sessions resetting on page reload when storing bearer tokens.

**Solution:** Implemented an automatic token verification trigger on initial app render to fetch authenticated user profiles via `GET /api/me`.

### Challenge 5: Keeping AI Output Consistent

**Problem:** Variations in AI response formatting breaking UI renderers.

**Solution:** Enforced strict schema prompts with backend data structure validation before outputting to the frontend.

---

## 🧠 Key Engineering Decisions & Architecture Trade-offs

As a Solo Engineer building an MVP, key architectural choices were evaluated by balancing **scalability, system complexity, maintainability, and delivery speed**:

### 1. Architecture Style: Service-Layer Pattern over Over-Engineered Modules

- **Decision:** Selected a clean **Service-Layer Architecture** rather than complex Module-based isolation.
- **Rationale:** The Service-Layer cleanly separates business logic (Gemini integration, Auth, Diagram Export) without unnecessary architectural abstractions.
- **Trade-off:** High iteration velocity now. If domain features expand significantly in future phases, migrating to a **Modular Monolith** will be straightforward due to clear service boundaries.

### 2. System Paradigm: Modular Monolith vs. Microservices

- **Decision:** Built as a **Modular Monolith** running Laravel + React SPA.
- **Rationale:** Microservices add significant operational overhead (network latency, distributed tracing, complex deployment pipelines, inter-service security) with zero immediate ROI for this MVP stage. A monolith built with clean domain boundaries allows a single developer to build, test, and deploy reliably.

### 3. Database Selection: Relational Database (MySQL / SQL) over NoSQL

- **Decision:** Selected **MySQL (SQL)** over Document/NoSQL stores.
- **Rationale:** The application data model is explicitly relational: Users have strict connections with Architectures, Bookmarks, Likes, Entities, and System Logs. Relational data integrity and Foreign Key constraints are necessary for consistent state across diagrams and user dashboards.

### 4. Caching Strategy: Deferred External Caching (Redis)

- **Decision:** Relied on database indexing and client-side caching (Zustand), deferring external Redis caching.
- **Rationale:** The primary latency bottleneck is network-bound (Gemini API response time) rather than database reads. Introducing Redis at this stage adds infrastructure complexity without solving the core network constraint.

### 5. UI Rendering Engine: ReactFlow Library Choice

- **Decision:** Leveraged **ReactFlow** for diagram interactive rendering.
- **Rationale:** Architecture visualization requires complex interactive node graphs, zooming, panning, and dynamic edges. ReactFlow provides these capabilities out-of-the-box, allowing focus on business logic rather than building a custom canvas engine from scratch.

---

## 📁 Project Structure

```
ArchViz/
├── archviz-frontend/          # React 18 SPA (Vite)
│   ├── src/
│   │   ├── components/        # Diagram, UI & Dashboard Components
│   │   ├── services/          # Axios API Services
│   │   └── store/             # Zustand State Management Stores
│   ├── package.json
│   └── .env
│
├── archviz-backend/           # Laravel 12 REST API
│   ├── app/
│   │   ├── Http/Controllers/  # Auth, Diagram & User Controllers
│   │   └── Services/          # Gemini AI Orchestration Service
│   ├── routes/api.php
│   └── .env
│
├── screenshots/               # Project preview images
│   ├── diagram.png
│   ├── prompt.png
│   ├── explore.png
│   └── implementation.png
│
└── README.md
```

---

## 💻 Installation & Setup

### Prerequisites

Make sure you have the following installed:

- **PHP:** 8.2+
- **Composer**
- **Node.js:** 18+ & `npm`
- **MySQL Database**
- **Google Gemini API Key**

### 1. Clone Repository

``` bash
git clone https://github.com/Houssein-Hamdan/ArchViz.git
cd archviz
```

### 2. Backend Setup

```bash
cd archviz-backend
composer install
cp .env.example .env
php artisan key:generate
```

Configure your environment variables in `archviz-backend/.env`:

```env
DB_DATABASE=archviz_db
DB_USERNAME=root
DB_PASSWORD=your_password

GEMINI_API_KEY=your_gemini_api_key

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

Run database migrations:

```bash
php artisan migrate
```

Start the Laravel backend server:

```bash
php artisan serve
```

Backend runs on:

```text
http://127.0.0.1:8000
```

### 3. Frontend Setup

Open a new terminal window:

```bash
cd archviz-frontend
npm install
```

Create environment file `archviz-frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Start Vite development server:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 🔒 Security

- ✅ Server-side hidden Gemini API keys.
- ✅ Bearer token authentication via Laravel Sanctum.
- ✅ CORS protection for authorized origins.
- ✅ SQL injection prevention using Eloquent ORM.
- ✅ Rate limiting and request throttling on AI API endpoints.
- ✅ Input validation and sanitization on all API routes.
- ✅ CSRF & IDOR protections implemented.

---

## 📸 Screenshots

### Architecture Diagram

![Architecture Diagram](./screenshots/diagram.png)

### Prompt

![Prompt](./screenshots/prompt.png)

### Explore

![Explore](./screenshots/explore.png)

### Implementation Plan

![Implementation Plan](./screenshots/implementation.png)

---

## 🚀 Future Improvements

- [ ] Architecture versioning & history tracking.
- [ ] Export diagrams directly as PNG/PDF.
- [ ] Support for cloud cost estimation (AWS/GCP/Azure).
- [ ] Real-time collaborative architecture editing.
- [ ] Enhanced AI validation and custom constraints.

---


## 📧 Contact & Support

- **Email:** houssein.hamdn@gmail.com
- **GitHub:** [@Houssein-Hamdan](https://github.com/Houssein-Hamdan)

---

**Made with ❤️ by Hussein | 2026**