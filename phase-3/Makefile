.PHONY: dev dev-backend dev-frontend

dev:
	@echo "Starting backend and frontend..."
	$(MAKE) dev-backend & $(MAKE) dev-frontend & wait

dev-backend:
	cd backend && uv run uvicorn app.main:app --reload --port 8000

dev-frontend:
	cd frontend && npm run dev
