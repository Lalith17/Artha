#!/bin/bash

# Simple Docker deployment for Personal Finance Visualizer

echo "🐳 Personal Finance Visualizer - Docker Deployment"
echo "=================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi
echo "✅ Docker is running"

# Function to deploy
deploy() {
    echo "🚀 Building and starting the application..."
    docker-compose down
    docker-compose up --build -d
    echo ""
    echo "✅ Deployment complete!"
    echo "📱 App: http://localhost:3000"
    echo "🗄️  Database Admin: http://localhost:8081 (admin/password)"
    echo ""
    echo "To stop: docker-compose down"
    echo "To view logs: docker-compose logs -f"
}

# Function to stop
stop() {
    echo "🛑 Stopping containers..."
    docker-compose down
    echo "✅ Stopped"
}

# Function to show logs
logs() {
    echo "📋 Application logs (Ctrl+C to exit):"
    docker-compose logs -f
}

# Simple menu
if [ "$1" = "stop" ]; then
    stop
elif [ "$1" = "logs" ]; then
    logs
else
    deploy
fi
