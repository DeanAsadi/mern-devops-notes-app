# Kubernetes Deployment Guide

This folder contains Kubernetes manifests for deploying the MERN DevOps Notes App.

## Components

The Kubernetes deployment includes:

- Namespace
- MongoDB Deployment and Service
- Backend Deployment and Service
- Frontend Deployment and Service
- Backend ConfigMap
- Backend Secret
- Ingress
- Readiness and liveness probes
- CPU and memory requests/limits

## Architecture

```text
Browser
  |
  v
Ingress Controller
  |
  |-- /      -> frontend-service -> frontend Pod
  |
  |-- /api   -> backend-service  -> backend Pod
                                  |
                                  v
                           mongodb-service
                                  |
                                  v
                              MongoDB Pod
```

## Prerequisites

Before applying these manifests, make sure you have:

- Docker Desktop Kubernetes enabled, or another Kubernetes cluster
- kubectl installed and configured
- Nginx Ingress Controller installed
- Docker images available in Docker Hub

## Docker Images

The frontend and backend images are built and pushed automatically by GitHub Actions.

Example images:

```
YOUR-DOCKERHUB-USERNAME/mern-notes-frontend:latest
YOUR-DOCKERHUB-USERNAME/mern-notes-backend:latest
```

For production-like deployments, commit SHA tags are preferred over `latest`.

## Install Nginx Ingress Controller

For local Docker Desktop Kubernetes:

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
```

Check the controller:

```
kubectl get pods -n ingress-nginx
kubectl get svc -n ingress-nginx
```

## Deploy the Application

Apply all Kubernetes manifests:

```
kubectl apply -f k8s/
```

Check all resources:

```
kubectl get all -n mern-notes
```

Check pods:

```
kubectl get pods -n mern-notes
```

Check services:

```
kubectl get svc -n mern-notes
```

Check ingress:

```
kubectl get ing -n mern-notes
```

## Local Domain Setup

Add this line to `/etc/hosts`:

```
127.0.0.1 mern-notes.local
```

Then open:

```
http://mern-notes.local
```

API endpoint:

```
http://mern-notes.local/api/notes
```

## Rollout Status

Check backend rollout:

```
kubectl rollout status deployment/backend -n mern-notes
```

Check frontend rollout:

```
kubectl rollout status deployment/frontend -n mern-notes
```

Check MongoDB rollout:

```
kubectl rollout status deployment/mongodb -n mern-notes
```

## Restart a Deployment

Restart backend:

```
kubectl rollout restart deployment/backend -n mern-notes
```

Restart frontend:

```
kubectl rollout restart deployment/frontend -n mern-notes
```

Restart MongoDB:

```
kubectl rollout restart deployment/mongodb -n mern-notes
```

## Rollback

View rollout history:

```
kubectl rollout history deployment/backend -n mern-notes
```

Rollback backend to previous version:

```
kubectl rollout undo deployment/backend -n mern-notes
```

Rollback frontend to previous version:

```
kubectl rollout undo deployment/frontend -n mern-notes
```

Check rollback status:

```
kubectl rollout status deployment/backend -n mern-notes
kubectl rollout status deployment/frontend -n mern-notes
```

## Logs

Backend logs:

```
kubectl logs -n mern-notes deployment/backend
```

Frontend logs:

```
kubectl logs -n mern-notes deployment/frontend
```

MongoDB logs:

```
kubectl logs -n mern-notes deployment/mongodb
```

Ingress controller logs:

```
kubectl logs -n ingress-nginx deployment/ingress-nginx-controller
```

## Troubleshooting

### Pods are not running

```
kubectl get pods -n mern-notes
kubectl describe pod -n mern-notes <pod-name>
```

### ImagePullBackOff

Check the image name and Docker Hub repository.

```
kubectl describe pod -n mern-notes <pod-name>
```

Common causes:

- Wrong Docker Hub username
- Wrong repository name
- Image tag does not exist
- Repository is private

### CrashLoopBackOff

Check logs:

```
kubectl logs -n mern-notes deployment/backend
```

Common causes:

- Wrong environment variable
- MongoDB connection issue
- Missing ConfigMap or Secret

### Ingress returns 404

Check ingress:

```
kubectl get ing -n mern-notes
kubectl describe ing mern-notes-ingress -n mern-notes
```

Make sure `/etc/hosts` contains:

```
127.0.0.1 mern-notes.local
```

### API does not work

Check backend service:

```
kubectl get svc -n mern-notes
kubectl logs -n mern-notes deployment/backend
```

Test API:

```
curl -H "Host: mern-notes.local" http://localhost/api/notes
```

## Delete the Application

Delete the namespace:

```
kubectl delete namespace mern-notes
```

This removes all resources inside the namespace



## CI/CD Note

GitHub Actions automatically validates the application and publishes Docker images to Docker Hub.

Because this project uses a local Docker Desktop Kubernetes cluster, deployment is applied manually with `kubectl`.

In a cloud Kubernetes environment such as AWS EKS, deployment could be automated from GitHub Actions using cloud authentication, kubeconfig, or OIDC-based access.

