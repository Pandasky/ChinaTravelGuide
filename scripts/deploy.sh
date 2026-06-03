#!/bin/bash

# ==========================================
# ChinaWise Production Deployment Script
# ==========================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
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

# Check if .env file exists
if [ ! -f .env ]; then
    log_error ".env file not found! Please copy .env.example to .env and configure your environment variables."
    exit 1
fi

# Check Docker and Docker Compose
if ! command -v docker &> /dev/null; then
    log_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Parse command line arguments
ACTION=${1:-deploy}
BACKUP_BEFORE_DEPLOY=${BACKUP:-true}

log_info "Starting deployment process..."
log_info "Action: $ACTION"

# Function to create backup
create_backup() {
    log_info "Creating database backup..."
    BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"

    if docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U "${DB_USER:-chinawise}" -d "${DB_NAME:-chinawise}" > "$BACKUP_DIR/backup.sql"; then
        log_success "Backup created at $BACKUP_DIR/backup.sql"
    else
        log_warning "Backup failed, but continuing with deployment..."
    fi
}

# Function to deploy
deploy() {
    log_info "Pulling latest images..."
    docker-compose -f docker-compose.prod.yml pull

    log_info "Building and starting services..."
    docker-compose -f docker-compose.prod.yml up -d --build

    log_info "Running database migrations..."
    docker-compose -f docker-compose.prod.yml exec -T api npx prisma migrate deploy

    log_info "Generating Prisma client..."
    docker-compose -f docker-compose.prod.yml exec -T api npx prisma generate

    log_success "Deployment completed successfully!"
}

# Function to rollback
rollback() {
    log_warning "Rolling back to previous version..."
    docker-compose -f docker-compose.prod.yml down
    docker-compose -f docker-compose.prod.yml up -d
    log_success "Rollback completed!"
}

# Function to check health
check_health() {
    log_info "Checking service health..."

    # Check API health
    API_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health || echo "000")
    if [ "$API_HEALTH" = "200" ]; then
        log_success "API is healthy"
    else
        log_error "API health check failed (HTTP $API_HEALTH)"
        return 1
    fi

    # Check Web health
    WEB_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost || echo "000")
    if [ "$WEB_HEALTH" = "200" ]; then
        log_success "Web is healthy"
    else
        log_error "Web health check failed (HTTP $WEB_HEALTH)"
        return 1
    fi

    return 0
}

# Function to show logs
show_logs() {
    docker-compose -f docker-compose.prod.yml logs -f
}

# Function to stop services
stop_services() {
    log_info "Stopping all services..."
    docker-compose -f docker-compose.prod.yml down
    log_success "All services stopped"
}

# Function to view status
show_status() {
    docker-compose -f docker-compose.prod.yml ps
}

# Function to clean up
cleanup() {
    log_warning "Cleaning up unused Docker resources..."
    docker system prune -f
    docker volume prune -f
    log_success "Cleanup completed"
}

# Main logic
case $ACTION in
    deploy|up)
        if [ "$BACKUP_BEFORE_DEPLOY" = "true" ]; then
            create_backup
        fi
        deploy
        sleep 10
        check_health
        ;;
    rollback)
        rollback
        ;;
    health|check)
        check_health
        ;;
    logs)
        show_logs
        ;;
    stop|down)
        stop_services
        ;;
    status|ps)
        show_status
        ;;
    backup)
        create_backup
        ;;
    cleanup)
        cleanup
        ;;
    restart)
        stop_services
        deploy
        check_health
        ;;
    *)
        echo "Usage: $0 {deploy|rollback|health|logs|stop|status|backup|cleanup|restart}"
        echo ""
        echo "Commands:"
        echo "  deploy    - Deploy the application (default)"
        echo "  rollback  - Rollback to previous version"
        echo "  health    - Check service health"
        echo "  logs      - View service logs"
        echo "  stop      - Stop all services"
        echo "  status    - Show service status"
        echo "  backup    - Create database backup"
        echo "  cleanup   - Clean up unused Docker resources"
        echo "  restart   - Restart all services"
        echo ""
        echo "Environment variables:"
        echo "  BACKUP=false  - Skip backup before deploy"
        exit 1
        ;;
esac
