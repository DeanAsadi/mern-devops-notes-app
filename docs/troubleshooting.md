------

# Kubernetes Troubleshooting Guide

```



This document contains common debugging and troubleshooting steps for the MERN DevOps Notes App running on Kubernetes.
```

Check pods only:

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

------

# 2. Check Pod Status

Common pod states:

```
Running
Pending
CrashLoopBackOff
ImagePullBackOff
ErrImagePull
Completed
```

## Running

The container is running successfully.

## Pending

The Pod is waiting for scheduling or resources.

Possible causes:

- insufficient CPU/memory
- node issue
- image pull delay

## CrashLoopBackOff

The application inside the container is crashing repeatedly.

Common causes:

- bad environment variables
- application startup failure
- database connection issue
- probe failures

## ImagePullBackOff / ErrImagePull

Kubernetes cannot pull the container image.

Common causes:

- wrong Docker Hub username
- wrong image name
- wrong tag
- private repository

------

# 3. Describe Pods

Describe a pod:

```
kubectl describe pod -n mern-notes <pod-name>
```

Useful sections:

```
Events
Conditions
Container status
Readiness probe failures
Liveness probe failures
```

Get pod names:

```
kubectl get pods -n mern-notes
```

------

# 4. View Logs

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

Follow logs live:

```
kubectl logs -f -n mern-notes deployment/backend
```

Show previous crashed container logs:

```
kubectl logs --previous -n mern-notes <pod-name>
```

------

# 5. Check Events

View recent namespace events:

```
kubectl get events -n mern-notes --sort-by=.metadata.creationTimestamp
```

Events often reveal:

- image pull failures
- scheduling failures
- probe failures
- restart reasons

------

# 6. Check Resource Usage

View node resource usage:

```
kubectl top nodes
```

View pod resource usage:

```
kubectl top pods -n mern-notes
```

This requires Metrics Server.

------

# 7. Test Services Internally

Port-forward backend:

```
kubectl port-forward -n mern-notes service/backend-service 5000:5000
```

Test health endpoint:

```
curl http://localhost:5000/health
```

Test API:

```
curl http://localhost:5000/api/notes
```

------

# 8. Test Ingress

Open:

```
http://mern-notes.local
```

Test API through ingress:

```
curl -H "Host: mern-notes.local" http://localhost/api/notes
```

------

# 9. Exec Into Containers

Enter backend container:

```
kubectl exec -it -n mern-notes <backend-pod-name> -- sh
```

Useful commands inside the container:

```
printenv
ping mongodb-service
```

Exit:

```
exit
```

------

# 10. Rollout Status

Check rollout progress:

```
kubectl rollout status deployment/backend -n mern-notes
```

View rollout history:

```
kubectl rollout history deployment/backend -n mern-notes
```

Restart deployment:

```
kubectl rollout restart deployment/backend -n mern-notes
```

Rollback deployment:

```
kubectl rollout undo deployment/backend -n mern-notes
```

------

# 11. Common Issues

## Backend Pod Not Ready

Symptoms:

```
0/1 Ready
```

Check:

```
kubectl describe pod -n mern-notes <backend-pod-name>
kubectl logs -n mern-notes deployment/backend
```

Possible causes:

- readiness probe failing
- MongoDB unavailable
- backend startup failure

------

## Ingress Returns 404

Check ingress:

```
kubectl get ing -n mern-notes
kubectl describe ing mern-notes-ingress -n mern-notes
```

Check `/etc/hosts`:

```
127.0.0.1 mern-notes.local
```

------

## API Returns 502/503

Check backend pods:

```
kubectl get pods -n mern-notes
```

Check backend logs:

```
kubectl logs -n mern-notes deployment/backend
```

Check endpoints:

```
kubectl get endpoints -n mern-notes
```

------

## ImagePullBackOff

Describe pod:

```
kubectl describe pod -n mern-notes <pod-name>
```

Common causes:

- wrong image name
- wrong Docker Hub username
- missing image tag
- private repository

------

## CrashLoopBackOff

Check logs:

```
kubectl logs -n mern-notes deployment/backend
```

Check previous logs:

```
kubectl logs --previous -n mern-notes <pod-name>
```

Possible causes:

- application crash
- bad environment variables
- failed database connection
- probe failures

------

# 12. Delete Application

Delete namespace:

```
kubectl delete namespace mern-notes
```

This removes all resources inside the namespace.