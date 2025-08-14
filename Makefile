.PHONY: help build run stop clean push pull

# Default target
help:
	@echo "Available commands:"
	@echo "  build    - Build the Docker image locally"
	@echo "  run      - Run the container locally on port 8080"
	@echo "  stop     - Stop and remove the running container"
	@echo "  clean    - Remove the local Docker image"
	@echo "  push     - Push the image to GitHub Container Registry"
	@echo "  pull     - Pull the latest image from GitHub Container Registry"

# Build the Docker image locally
build:
	docker build -t ghcr.io/cvd-unmatched/hanoi:latest .

# Run the container locally
run:
	docker run -d --name tower-of-hanoi -p 8080:80 ghcr.io/cvd-unmatched/hanoi:latest
	@echo "Tower of Hanoi is running at http://localhost:8080"

# Stop and remove the running container
stop:
	docker stop tower-of-hanoi || true
	docker rm tower-of-hanoi || true

# Clean up local Docker image
clean:
	docker rmi ghcr.io/cvd-unmatched/hanoi:latest || true

# Push to GitHub Container Registry (requires login)
push:
	docker push ghcr.io/cvd-unmatched/hanoi:latest

# Pull from GitHub Container Registry
pull:
	docker pull ghcr.io/cvd-unmatched/hanoi:latest

# Run with docker-compose
compose-up:
	docker-compose up -d

# Stop with docker-compose
compose-down:
	docker-compose down

# View logs
logs:
	docker-compose logs -f hanoi
