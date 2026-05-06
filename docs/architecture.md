# Architecture Overview

This project is a containerized MERN notes application built with React, Node.js, Express, MongoDB, Docker, Docker Compose, and Nginx.

## High-Level Architecture

```text
Browser
  |
  v
Frontend Container
React static files served by Nginx
  |
  | /api requests
  v
Backend Container
Node.js / Express REST API
  |
  v
MongoDB Container
Persistent database storage using Docker volume
```



## Request Flow

### Frontend Request

When a user opens the application:

```
Browser -> Nginx -> React static files
```

Nginx serves the production React build from:

```
/usr/share/nginx/html
```

### API Request

When the frontend calls the API:

```
Browser -> Nginx -> /api -> Backend -> MongoDB
```

The React app uses a relative API path:

```
/api/notes
```

Nginx forwards `/api` traffic to the backend service:

```
backend:5000
```

## Services

### Frontend

- Built with React and Vite
- Production build served by Nginx
- Uses Nginx reverse proxy for API requests

### Backend

- Built with Node.js and Express
- Exposes REST API endpoints
- Connects to MongoDB using environment variables
- Provides a `/health` endpoint for healthchecks

### MongoDB

- Runs as a Docker container
- Stores note data
- Uses a named Docker volume for persistence

## Docker Compose Networking

Docker Compose creates a default network for the services.

This allows containers to communicate using service names:

```
frontend -> backend
backend -> mongodb
```

For example, the backend connects to MongoDB using:

```
mongodb://mongodb:27017/notesdb
```

The first `mongodb` is the Docker Compose service name.

## Healthchecks

The project includes healthchecks for:

- MongoDB
- Backend API

Startup order:

```
MongoDB healthy -> Backend healthy -> Frontend starts
```

This is more reliable than only checking whether containers are running