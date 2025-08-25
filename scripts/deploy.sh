#!/bin/bash

# Production Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="ayrshare-app"
CONTAINER_NAME="ayrshare-app-prod"
IMAGE_TAG="latest"
BACKUP_TAG="backup-$(date +%Y%m%d-%H%M%S)"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
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
}

# Check if required files exist
check_files() {
    local required_files=("Dockerfile.prod" "docker-compose.prod.yml" ".env.production")
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            log_error "Required file $file not found. Please ensure all production files are present."
            exit 1
        fi
    done
}

# Backup current deployment
backup_current() {
    if docker ps -q -f name="$CONTAINER_NAME" | grep -q .; then
        log_info "Backing up current deployment..."
        docker tag "$APP_NAME:$IMAGE_TAG" "$APP_NAME:$BACKUP_TAG" 2>/dev/null || true
        log_success "Backup created: $APP_NAME:$BACKUP_TAG"
    fi
}

# Build new image
build_image() {
    log_info "Building production Docker image..."
    docker build -f Dockerfile.prod -t "$APP_NAME:$IMAGE_TAG" .
    
    if [[ $? -eq 0 ]]; then
        log_success "Image built successfully: $APP_NAME:$IMAGE_TAG"
    else
        log_error "Failed to build image"
        exit 1
    fi
}

# Deploy new version
deploy_new() {
    log_info "Deploying new version..."
    
    # Stop and remove old container
    docker-compose -f docker-compose.prod.yml down --remove-orphans
    
    # Start new container
    docker-compose -f docker-compose.prod.yml up -d
    
    # Wait for container to be healthy
    log_info "Waiting for container to be healthy..."
    local attempts=0
    local max_attempts=30
    
    while [[ $attempts -lt $max_attempts ]]; do
        if docker ps -q -f name="$CONTAINER_NAME" -f health=healthy | grep -q .; then
            log_success "Container is healthy!"
            break
        fi
        
        attempts=$((attempts + 1))
        log_info "Waiting for health check... (attempt $attempts/$max_attempts)"
        sleep 10
    done
    
    if [[ $attempts -eq $max_attempts ]]; then
        log_error "Container failed to become healthy within expected time"
        rollback
        exit 1
    fi
}

# Rollback to previous version
rollback() {
    log_warning "Rolling back to previous version..."
    
    # Stop current container
    docker-compose -f docker-compose.prod.yml down
    
    # Restore backup image
    if docker images -q "$APP_NAME:$BACKUP_TAG" | grep -q .; then
        docker tag "$APP_NAME:$BACKUP_TAG" "$APP_NAME:$IMAGE_TAG"
        log_info "Rolled back to backup image"
        
        # Restart with backup
        docker-compose -f docker-compose.prod.yml up -d
    else
        log_error "No backup image found for rollback"
    fi
}

# Health check
health_check() {
    log_info "Performing health check..."
    
    local attempts=0
    local max_attempts=5
    
    while [[ $attempts -lt $max_attempts ]]; do
        if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
            log_success "Application is responding to health checks"
            return 0
        fi
        
        attempts=$((attempts + 1))
        log_info "Health check attempt $attempts/$max_attempts failed, retrying..."
        sleep 5
    done
    
    log_error "Health check failed after $max_attempts attempts"
    return 1
}

# Cleanup old images
cleanup() {
    log_info "Cleaning up old images..."
    
    # Remove images older than 7 days
    docker image prune -f --filter "until=168h"
    
    # Keep only the last 3 backup tags
    docker images "$APP_NAME" --format "table {{.Tag}}" | grep "backup-" | sort -r | tail -n +4 | xargs -I {} docker rmi "$APP_NAME:{}" 2>/dev/null || true
    
    log_success "Cleanup completed"
}

# Main deployment process
main() {
    log_info "Starting production deployment..."
    
    # Pre-deployment checks
    check_docker
    check_files
    
    # Backup current deployment
    backup_current
    
    # Build and deploy
    build_image
    deploy_new
    
    # Verify deployment
    if health_check; then
        log_success "Deployment completed successfully!"
        
        # Show container status
        log_info "Container status:"
        docker ps -f name="$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        
        # Cleanup
        cleanup
    else
        log_error "Deployment failed health checks"
        rollback
        exit 1
    fi
}

# Handle script arguments
case "${1:-}" in
    "rollback")
        rollback
        ;;
    "health")
        health_check
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  (no args)  Deploy new version"
        echo "  rollback   Rollback to previous version"
        echo "  health     Check application health"
        echo "  cleanup    Clean up old images"
        echo "  help       Show this help message"
        ;;
    *)
        main
        ;;
esac
