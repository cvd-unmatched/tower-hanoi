#!/bin/bash

# Tower of Hanoi Deployment Script
# This script helps deploy the application to various environments

set -e

# Configuration
IMAGE_NAME="ghcr.io/cvd-unmatched/hanoi"
CONTAINER_NAME="tower-of-hanoi"
EXTERNAL_PORT="8080"
INTERNAL_PORT="80"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    log_info "Docker is running"
}

# Pull latest image
pull_image() {
    log_info "Pulling latest image from registry..."
    docker pull $IMAGE_NAME:latest
    log_info "Image pulled successfully"
}

# Stop existing container
stop_container() {
    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        log_info "Stopping existing container..."
        docker stop $CONTAINER_NAME
        docker rm $CONTAINER_NAME
        log_info "Container stopped and removed"
    fi
}

# Start new container
start_container() {
    log_info "Starting new container..."
    docker run -d \
        --name $CONTAINER_NAME \
        -p $EXTERNAL_PORT:$INTERNAL_PORT \
        --restart unless-stopped \
        $IMAGE_NAME:latest
    
    log_info "Container started successfully"
}

# Check container health
check_health() {
    log_info "Checking container health..."
    sleep 5
    
    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        log_info "Container is running"
        log_info "Application is available at: http://localhost:$EXTERNAL_PORT"
    else
        log_error "Container failed to start"
        exit 1
    fi
}

# Show container logs
show_logs() {
    log_info "Container logs:"
    docker logs $CONTAINER_NAME
}

# Main deployment function
deploy() {
    log_info "Starting deployment..."
    
    check_docker
    pull_image
    stop_container
    start_container
    check_health
    
    log_info "Deployment completed successfully!"
}

# Show usage
usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  deploy     - Deploy the application (default)"
    echo "  pull       - Pull latest image"
    echo "  stop       - Stop the container"
    echo "  start      - Start the container"
    echo "  restart    - Restart the container"
    echo "  logs       - Show container logs"
    echo "  status     - Show container status"
    echo "  help       - Show this help message"
}

# Main script logic
case "${1:-deploy}" in
    "deploy")
        deploy
        ;;
    "pull")
        check_docker
        pull_image
        ;;
    "stop")
        check_docker
        stop_container
        ;;
    "start")
        check_docker
        start_container
        check_health
        ;;
    "restart")
        check_docker
        stop_container
        start_container
        check_health
        ;;
    "logs")
        check_docker
        show_logs
        ;;
    "status")
        check_docker
        docker ps -f name=$CONTAINER_NAME
        ;;
    "help"|"-h"|"--help")
        usage
        ;;
    *)
        log_error "Unknown command: $1"
        usage
        exit 1
        ;;
esac
