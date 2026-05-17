# MERN DevOps Notes App

![CI](https://github.com/DeanAsadi/mern-devops-notes-app/actions/workflows/ci.yml/badge.svg)



A full-stack MERN notes application built as a DevOps portfolio project.

The project demonstrates how to containerize a React frontend, Node.js/Express backend, and MongoDB database using Docker and Docker Compose. It also includes an Nginx reverse proxy, persistent MongoDB storage, environment-based configuration, and container healthchecks.

## Tech Stack

### Application

- React
- Vite
- Node.js
- Express
- MongoDB
- Mongoose

### DevOps / Infrastructure

- Docker
- Docker Compose
- Nginx
- Docker volumes
- Container healthchecks

## Architecture

```text
Browser
  |
  v
Nginx / Frontend Container
  |
  | /api requests
  v
Backend Container
  |
  v
MongoDB Container


The frontend is served by Nginx. API requests using /api are reverse proxied to the backend service. The backend connects to MongoDB over the internal Docker Compose network.

More details are available in:

docs/architecture.md
Features
Create notes
View notes
Delete notes
REST API backend
MongoDB persistence
React frontend
Nginx reverse proxy
Dockerized services
Multi-container setup with Docker Compose
Healthchecks for MongoDB and backend
Project Structure
mern-devops-notes-app/
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── nginx.conf
│   ├── package.json
│   └── src/
│
├── docs/
│   └── architecture.md
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Docker
- Docker Compose
- Git

Optional for local development:

- Node.js
- npm

## Run with Docker Compose

From the project root:

```
docker compose up --build
```

Open the application:

```
http://localhost:8080
```

Backend health endpoint:

```
http://localhost:5000/health
```

API through Nginx reverse proxy:

```
http://localhost:8080/api/notes
```

## Run in Detached Mode

```
docker compose up -d --build
```

View running services:

```
docker compose ps
```

View logs:

```
docker compose logs
```

View backend logs:

```
docker compose logs backend
```

Stop the application:

```
docker compose down
```

Stop and remove volumes:

```
docker compose down -v
```

Warning: `docker compose down -v` removes the MongoDB volume and deletes stored notes.

## Environment Variables

The backend uses the following environment variables:

```
PORT=5000
MONGO_URI=mongodb://mongodb:27017/notesdb
```

For local development outside Docker, see:

```
backend/.env.example
```

## Docker Compose Services

### MongoDB

- Uses the official `mongo:7` image
- Stores data in a named Docker volume
- Includes a healthcheck using `mongosh`

### Backend

- Built from `backend/Dockerfile`
- Runs a Node.js/Express API
- Connects to MongoDB using the Compose service name `mongodb`
- Includes a `/health` endpoint
- Includes a Docker healthcheck using `curl`

### Frontend

- Built from `frontend/Dockerfile`
- Uses a multi-stage Docker build
- Builds React using Node.js
- Serves production files using Nginx
- Uses Nginx as a reverse proxy for `/api` requests

## Healthchecks

This project uses Docker healthchecks to make service startup more reliable.

Startup order:

```
MongoDB healthy -> Backend healthy -> Frontend starts
```

This avoids starting the backend before MongoDB is ready.



## Docker Images

Docker images are automatically built and published to Docker Hub by GitHub Actions when changes are pushed to the `main` branch.

### Backend Image

```text
DOCKERDEEN26/mern-notes-backend:latest
DOCKERDEEN26/mern-notes-frontend:latest
```





## Useful Commands

Rebuild all services:

```
docker compose up --build
```

Rebuild without cache:

```
docker compose build --no-cache
docker compose up
```

Check service status:

```
docker compose ps
```

Inspect backend health:

```
docker inspect --format='{{json .State.Health}}' notes-backend
```

Inspect MongoDB health:

```
docker inspect --format='{{json .State.Health}}' notes-mongodb
```

## Troubleshooting

### Port already in use

If port `8080`, `5000`, or `27017` is already in use, stop the process or container using it.

Check running containers:

```
docker ps
```

Stop containers:

```
docker compose down
```

### Backend cannot connect to MongoDB

Check backend logs:

```
docker compose logs backend
```

Make sure the MongoDB service is healthy:

```
docker compose ps
```

The backend should use this MongoDB URI inside Docker Compose:

```
mongodb://mongodb:27017/notesdb
```

### Frontend loads but API does not work

Check the Nginx reverse proxy by opening:

```
http://localhost:8080/api/notes
```

If this fails, check frontend logs:

```
docker compose logs frontend
```

And backend logs:

```
docker compose logs backend
```

# The project includes a Kubernetes troubleshooting guide with commands for:

```java


- pod inspection
- logs
- events
- rollout status
- rollout rollback
- ingress debugging
- service debugging
- probe troubleshooting

See:

docs/troubleshooting.md

```

------

## 

## What I Learned

This project demonstrates:

- Building a full-stack MERN application
- Creating Dockerfiles for frontend and backend
- Running multiple services with Docker Compose
- Using Docker Compose networking
- Persisting database data with Docker volumes
- Configuring Nginx as a reverse proxy
- Using relative API paths for production-style routing
- Adding healthchecks for more reliable service startup
- Writing clean project documentation

## Future Improvements

Planned improvements:

- GitHub Actions CI pipeline
- Docker image publishing to Docker Hub
- Kubernetes manifests
- ConfigMaps and Secrets
- Kubernetes Ingress
- Readiness and liveness probes
- Resource requests and limits
- Monitoring and logging

## 
