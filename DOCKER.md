# 🐳 Docker Deployment Guide

Production-ready Docker deployment for the Personal Finance Visualizer.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Linux/macOS terminal or Git Bash on Windows (for bash script)

## Quick Start

### Using the deployment script (recommended):

```bash
# Start the application
./docker-deploy.sh

# Stop the application
./docker-deploy.sh stop

# View logs
./docker-deploy.sh logs
```

### Manual commands:

```bash
# Start all services
docker-compose up --build -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
```

## Services

The Docker setup includes three services:

### 1. **finance-app** - Next.js Application

- **Port**: 3000
- **Environment**: Production optimized
- **Features**: Multi-stage build, standalone output, minimal image size

### 2. **mongo** - MongoDB Database

- **Port**: 27017
- **Version**: MongoDB 7.0
- **Data**: Persisted in Docker volume `mongodb_data`

### 3. **mongo-express** - Database Management UI

- **Port**: 8081
- **Credentials**: admin/password
- **Purpose**: Visual database management interface

## Environment Variables

The application uses these environment variables in Docker:

```env
NODE_ENV=production
MONGODB_URI=mongodb://mongo:27017
MONGODB_DB=finance_manager
```

## Docker Files

### `Dockerfile`

- Multi-stage build for production optimization
- Standalone Next.js output for minimal runtime
- Non-root user for security
- Alpine Linux base image

### `docker-compose.yml`

- Production-ready service configuration
- MongoDB with persistent volume
- Network isolation between services
- Automatic restart policies

### `docker-deploy.sh`

- Simple bash script for easy deployment
- Supports start, stop, and logs commands
- Includes error handling and status checks

## Useful Commands

### NPM Scripts

```bash
npm run docker:build    # Build production image
npm run docker:prod     # Start production stack
npm run docker:stop     # Stop all containers
npm run docker:logs     # View application logs
```

### Direct Docker Commands

```bash
# View running containers
docker ps

# View specific service logs
docker-compose logs -f finance-app

# Stop all containers
docker-compose down

# Remove volumes (WARNING: This deletes all data)
docker-compose down -v

# Clean up unused resources
docker system prune -f
```

## Accessing Services

After deployment, access these URLs:

- **Application**: http://localhost:3000
- **MongoDB Express**: http://localhost:8081
  - Username: `admin`
  - Password: `password`

## Data Persistence

MongoDB data is persisted using Docker volumes:

- **Volume name**: `mongodb_data`
- **Location**: Managed by Docker
- **Backup**: Use `mongodump` or MongoDB Express export

## Troubleshooting

### Port Already in Use

```bash
# Stop containers using the ports
docker-compose down

# Check what's using the port
lsof -i :3000  # Linux/macOS
netstat -ano | findstr :3000  # Windows
```

### Database Connection Issues

```bash
# Check if MongoDB container is running
docker ps

# Check MongoDB logs
docker-compose logs mongo

# Restart MongoDB service
docker-compose restart mongo
```

### Application Won't Start

```bash
# Check application logs
docker-compose logs finance-app

# Rebuild containers
docker-compose up --build

# Check container status
docker-compose ps
```

### Out of Disk Space

```bash
# Clean up Docker resources
docker system prune -a
docker volume prune
```

## Production Deployment

For production deployment on a server:

1. **Clone the repository** on your server
2. **Update environment variables** in `docker-compose.yml`
3. **Use proper secrets** for MongoDB authentication
4. **Set up reverse proxy** (nginx/traefik) for SSL/TLS
5. **Configure firewall** to restrict port access
6. **Set up monitoring** and logging
7. **Regular backups** of MongoDB data

### Example Production Enhancements:

```yaml
services:
  finance-app:
    # ... existing config
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017
      - MONGODB_DB=finance_manager
    restart: unless-stopped

  mongo:
    # ... existing config
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=your-secure-password
    restart: unless-stopped
```

## Security Notes

- Change default MongoDB Express credentials in production
- Use environment files for sensitive data
- Run containers as non-root user (already configured)
- Regular security updates for base images
- Network isolation between services
- Consider removing mongo-express in production

## Support

If you encounter issues:

1. **Check the logs**: `docker-compose logs`
2. **Verify Docker is running**: `docker info`
3. **Ensure ports are available**: `lsof -i :3000` or `netstat -an | grep 3000`
4. **Try rebuilding**: `docker-compose up --build`
5. **Check container status**: `docker-compose ps`

## Deployment Script Details

The `docker-deploy.sh` script provides these functions:

- **Default/start**: Builds and starts all services
- **stop**: Stops all services
- **logs**: Shows real-time logs from all services
- **Error handling**: Checks for Docker availability and provides helpful messages
