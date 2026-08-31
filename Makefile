.PHONY: help build run stop clean push pull release

# Version comes from package.json; override with `make build VERSION=1.2.3`
VERSION ?= $(shell node -p "require('./package.json').version")
IMAGE := ghcr.io/cvd-unmatched/hanoi

# Default target
help:
	@echo "Available commands:"
	@echo "  build    - Build the Docker image locally (tagged \$$(VERSION) and latest)"
	@echo "  run      - Run the container locally on port 8080"
	@echo "  stop     - Stop and remove the running container"
	@echo "  clean    - Remove the local Docker image"
	@echo "  push     - Push the image to GitHub Container Registry"
	@echo "  pull     - Pull the latest image from GitHub Container Registry"
	@echo "  release  - Tag the current commit v\$$(VERSION) and push it to trigger a versioned build"
	@echo "Current VERSION: $(VERSION)"

# Build the Docker image locally
build:
	docker build -t $(IMAGE):$(VERSION) -t $(IMAGE):latest .

# Run the container locally
run:
	docker run -d --name tower-of-hanoi -p 8080:80 $(IMAGE):$(VERSION)
	@echo "Tower of Hanoi is running at http://localhost:8080"

# Stop and remove the running container
stop:
	docker stop tower-of-hanoi || true
	docker rm tower-of-hanoi || true

# Clean up local Docker image
clean:
	docker rmi $(IMAGE):$(VERSION) $(IMAGE):latest || true

# Push to GitHub Container Registry (requires login)
push:
	docker push $(IMAGE):$(VERSION)
	docker push $(IMAGE):latest

# Pull from GitHub Container Registry
pull:
	docker pull $(IMAGE):$(VERSION)

# Tag and push a release: bump package.json's version first, then run this
release:
	git tag v$(VERSION)
	git push origin v$(VERSION)
	@echo "Pushed tag v$(VERSION) - CI will build and publish $(IMAGE):$(VERSION)"

# Run with docker-compose
compose-up:
	docker-compose up -d

# Stop with docker-compose
compose-down:
	docker-compose down

# View logs
logs:
	docker-compose logs -f hanoi
