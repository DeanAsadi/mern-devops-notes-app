NAMESPACE=mern-notes

deploy:
	kubectl apply -f k8s/

status:
	kubectl get all -n $(NAMESPACE)

pods:
	kubectl get pods -n $(NAMESPACE)

services:
	kubectl get svc -n $(NAMESPACE)

ingress:
	kubectl get ing -n $(NAMESPACE)

logs-backend:
	kubectl logs -n $(NAMESPACE) deployment/backend

logs-frontend:
	kubectl logs -n $(NAMESPACE) deployment/frontend

logs-mongodb:
	kubectl logs -n $(NAMESPACE) deployment/mongodb

restart-backend:
	kubectl rollout restart deployment/backend -n $(NAMESPACE)

restart-frontend:
	kubectl rollout restart deployment/frontend -n $(NAMESPACE)

rollback-backend:
	kubectl rollout undo deployment/backend -n $(NAMESPACE)

rollback-frontend:
	kubectl rollout undo deployment/frontend -n $(NAMESPACE)

delete:
	kubectl delete namespace $(NAMESPACE)
