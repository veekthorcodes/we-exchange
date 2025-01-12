FRONTEND_DIR := frontend
BACKEND_DIR := backend

install: install-frontend install-backend

install-frontend:
	@echo "Installing frontend dependencies..."
	cd $(FRONTEND_DIR) && npm install

install-backend:
	@echo "Installing backend dependencies..."
	cd $(BACKEND_DIR) && npm install

