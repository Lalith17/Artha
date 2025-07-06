#!/bin/bash

# Docker deployment scripts for Personal Finance Visualizer

echo "🐳 Personal Finance Visualizer - Docker Deployment"
echo "=================================================="

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker and try again."
        exit 1
    fi
    echo "✅ Docker is running"
}

# Function to build and run production
deploy_production() {
    echo "🚀 Building and starting production deployment..."
    docker-compose down
    docker-compose up --build -d
    echo "✅ Production deployment started!"
    echo "📱 App: http://localhost:3000"
    echo "🗄️  MongoDB Express: http://localhost:8081 (admin/password)"
}

# Function to build and run development
deploy_development() {
    echo "🔧 Building and starting development deployment..."
    docker-compose -f docker-compose.dev.yml down
    docker-compose -f docker-compose.dev.yml up --build -d
    echo "✅ Development deployment started!"
    echo "📱 App: http://localhost:3000"
    echo "🗄️  MongoDB Express: http://localhost:8081 (admin/password)"
}

# Function to stop all containers
stop_all() {
    echo "🛑 Stopping all containers..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    echo "✅ All containers stopped"
}

# Function to view logs
view_logs() {
    echo "📋 Viewing application logs..."
    docker-compose logs -f finance-app
}

# Function to clean up Docker resources
cleanup() {
    echo "🧹 Cleaning up Docker resources..."
    docker system prune -f
    docker volume prune -f
    echo "✅ Cleanup completed"
}

# Main menu
show_menu() {
    echo ""
    echo "Choose an option:"
    echo "1. Deploy Production"
    echo "2. Deploy Development"
    echo "3. Stop All Containers"
    echo "4. View Logs"
    echo "5. Cleanup Docker Resources"
    echo "6. Exit"
}

# Main script execution
check_docker

while true; do
    show_menu
    read -p "Enter your choice (1-6): " choice
    
    case $choice in
        1)
            deploy_production
            ;;
        2)
            deploy_development
            ;;
        3)
            stop_all
            ;;
        4)
            view_logs
            ;;
        5)
            cleanup
            ;;
        6)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid option. Please try again."
            ;;
    esac
done
