# ⚡ E-Cell Docker Infrastructure Assignment

> A containerized full-stack web application built with React, Node.js, and PostgreSQL — orchestrated using Docker Compose.

---

## 📌 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Nginx |
| Backend | Node.js + Express.js |
| Database | PostgreSQL 15 |
| Containerization | Docker + Docker Compose |

---

## 📁 Folder Structure

```
ecell-docker-app/
├── docker-compose.yml        ← Orchestrates all services
├── README.md
├── backend/
│   ├── Dockerfile            ← Multi-stage Node.js build
│   ├── server.js             ← Express REST API
│   ├── package.json
│   └── .dockerignore
└── frontend/
    ├── Dockerfile            ← Multi-stage React + Nginx build
    ├── nginx.conf            ← Serves React & proxies /api/
    ├── package.json
    ├── .dockerignore
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        └── App.js            ← Main UI component
```

---

## 🚀 How to Run Locally

### Prerequisites
- Install **Docker Desktop** → https://www.docker.com/products/docker-desktop

### Start the App

```bash
# 1. Clone or unzip the project
cd ecell-docker-app

# 2. Build and start all containers
docker-compose up --build

# 3. Open browser
http://localhost
```

That's it — one command starts all 3 services automatically.

### Stop the App

```bash
docker-compose down
```

### Other Useful Commands

```bash
docker-compose logs backend     # View backend logs
docker-compose ps               # Check running containers
docker-compose down -v          # Stop and delete all data
```

---

## 🏗️ Architecture Overview

```
Browser
   │
   ▼
[Frontend - Nginx : port 80]
   │
   ├── / → serves React static files
   │
   └── /api/ → proxies to Backend
                    │
                    ▼
           [Backend - Node.js : port 5000]
                    │
                    ▼
           [Database - PostgreSQL : port 5432]
```

- The **frontend** is built into static files and served by Nginx
- Nginx **proxies** all `/api/` requests to the Node.js backend
- The **backend** connects to PostgreSQL and handles all data operations
- All services communicate over a private **Docker network**
- Database data is stored in a **named volume** (persists across restarts)

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a new task |
| PATCH | `/api/tasks/:id` | Toggle task done/undone |
| DELETE | `/api/tasks/:id` | Delete a task |

---

## 🐳 Docker Details

### Multi-Stage Builds
Both Dockerfiles use **multi-stage builds**:
- **Stage 1 (builder):** Installs dependencies and builds the app
- **Stage 2 (production):** Copies only the final output — smaller, more secure image

### Services in docker-compose.yml
- **db** — PostgreSQL with health check and persistent volume
- **backend** — Node.js API, waits for DB to be healthy before starting
- **frontend** — Nginx serving React, exposes port 80

### Security
- Non-root user in backend container
- Database not exposed outside Docker network
- Credentials passed via environment variables

---

## ☁️ Cloud Deployment (VPS/AWS/DigitalOcean)

```bash
# 1. SSH into your server
ssh root@your-server-ip

# 2. Install Docker
curl -fsSL https://get.docker.com | sh
apt install docker-compose-plugin -y

# 3. Upload project files
scp -r ecell-docker-app/ root@your-server-ip:/app/

# 4. Run it
cd /app/ecell-docker-app
docker-compose up --build -d
```

Your app is now live on port 80 of your server IP. Point a domain to it and it's production ready.

---

## 👤 Author

**Swayam**  
E-Cell Infrastructure Assignment  
Docker · React · Node.js · PostgreSQL
