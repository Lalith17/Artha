# PowerShell deployment script for Personal Finance Visualizer

Write-Host "🐳 Personal Finance Visualizer - Docker Deployment" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Function to check if Docker is running
function Test-DockerRunning {
    try {
        docker info | Out-Null
        Write-Host "✅ Docker is running" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Docker is not running. Please start Docker and try again." -ForegroundColor Red
        return $false
    }
}

# Function to build and run production
function Deploy-Production {
    Write-Host "🚀 Building and starting production deployment..." -ForegroundColor Yellow
    docker-compose down
    docker-compose up --build -d
    Write-Host "✅ Production deployment started!" -ForegroundColor Green
    Write-Host "📱 App: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "🗄️  MongoDB Express: http://localhost:8081 (admin/password)" -ForegroundColor Cyan
}

# Function to build and run development
function Deploy-Development {
    Write-Host "🔧 Building and starting development deployment..." -ForegroundColor Yellow
    docker-compose -f docker-compose.dev.yml down
    docker-compose -f docker-compose.dev.yml up --build -d
    Write-Host "✅ Development deployment started!" -ForegroundColor Green
    Write-Host "📱 App: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "🗄️  MongoDB Express: http://localhost:8081 (admin/password)" -ForegroundColor Cyan
}

# Function to stop all containers
function Stop-AllContainers {
    Write-Host "🛑 Stopping all containers..." -ForegroundColor Yellow
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    Write-Host "✅ All containers stopped" -ForegroundColor Green
}

# Function to view logs
function Show-Logs {
    Write-Host "📋 Viewing application logs..." -ForegroundColor Yellow
    docker-compose logs -f finance-app
}

# Function to clean up Docker resources
function Invoke-Cleanup {
    Write-Host "🧹 Cleaning up Docker resources..." -ForegroundColor Yellow
    docker system prune -f
    docker volume prune -f
    Write-Host "✅ Cleanup completed" -ForegroundColor Green
}

# Function to show menu
function Show-Menu {
    Write-Host ""
    Write-Host "Choose an option:" -ForegroundColor White
    Write-Host "1. Deploy Production" -ForegroundColor White
    Write-Host "2. Deploy Development" -ForegroundColor White
    Write-Host "3. Stop All Containers" -ForegroundColor White
    Write-Host "4. View Logs" -ForegroundColor White
    Write-Host "5. Cleanup Docker Resources" -ForegroundColor White
    Write-Host "6. Exit" -ForegroundColor White
}

# Main script execution
if (-not (Test-DockerRunning)) {
    exit 1
}

do {
    Show-Menu
    $choice = Read-Host "Enter your choice (1-6)"
    
    switch ($choice) {
        "1" {
            Deploy-Production
        }
        "2" {
            Deploy-Development
        }
        "3" {
            Stop-AllContainers
        }
        "4" {
            Show-Logs
        }
        "5" {
            Invoke-Cleanup
        }
        "6" {
            Write-Host "👋 Goodbye!" -ForegroundColor Cyan
            exit 0
        }
        default {
            Write-Host "❌ Invalid option. Please try again." -ForegroundColor Red
        }
    }
} while ($true)
