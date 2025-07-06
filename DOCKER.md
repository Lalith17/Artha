# 🐳 Docker Deployment Guide

This guide explains how to deploy the Personal Finance Visualizer using Docker.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- [Docker Compose](https://docs.docker.com/compose/) (included with Docker Desktop)

## Quick Start

### Option 1: Using PowerShell Script (Windows)

```powershell
./docker-deploy.ps1
```

### Option 2: Using Bash Script (Linux/Mac)

```bash
chmod +x docker-deploy.sh
./docker-deploy.sh
```

### Option 3: Manual Commands

#### Production Deployment

```bash
# Build and start production containers
docker-compose up --build -d

# Access the application
# App: http://localhost:3000
# MongoDB Express: http://localhost:8081 (admin/password)
```

#### Development Deployment

```bash
# Build and start development containers with hot reload
docker-compose -f docker-compose.dev.yml up --build -d

# Access the application
# App: http://localhost:3000 (with hot reload)
# MongoDB Express: http://localhost:8081 (admin/password)
```

## Services

The Docker setup includes:

### 1. **finance-app** - Next.js Application

- **Port**: 3000
- **Environment**: Production optimized
- **Features**: Standalone build for minimal image size

### 2. **mongo** - MongoDB Database

- **Port**: 27017
- **Version**: MongoDB 7.0
- **Data**: Persisted in Docker volume

### 3. **mongo-express** - Database Management UI

- **Port**: 8081
- **Credentials**: admin/password
- **Purpose**: Visual database management

## Environment Variables

The application uses these environment variables in Docker:

```env
NODE_ENV=production
MONGODB_URI=mongodb://mongo:27017
MONGODB_DB=finance_manager
```

## Docker Files

### `Dockerfile` (Production)

- Multi-stage build for optimization
- Standalone Next.js output
- Non-root user for security
- Minimal Alpine Linux base

### `Dockerfile.dev` (Development)

- Hot reload support
- Volume mounting for live changes
- Development dependencies included

### `docker-compose.yml` (Production)

- Production-ready configuration
- Persistent MongoDB volume
- Network isolation

### `docker-compose.dev.yml` (Development)

- Development configuration
- Volume mounting for hot reload
- Same database setup

## Useful Commands

### NPM Scripts

```bash
npm run docker:build    # Build production image
npm run docker:run      # Run single container
npm run docker:prod     # Start production stack
npm run docker:dev      # Start development stack
npm run docker:stop     # Stop all containers
npm run docker:logs     # View application logs
```

### Direct Docker Commands

```bash
# View running containers
docker ps

# View logs
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

- Volume name: `mongodb_data`
- Location: Managed by Docker
- Backup: Use `mongodump` or MongoDB Express export

## Troubleshooting

### Port Already in Use

```bash
# Stop containers using the ports
docker-compose down

# Or change ports in docker-compose.yml
```

### Database Connection Issues

```bash
# Check if MongoDB container is running
docker ps

# Check MongoDB logs
docker-compose logs mongo

# Restart MongoDB
docker-compose restart mongo
```

### Application Won't Start

```bash
# Check application logs
docker-compose logs finance-app

# Rebuild containers
docker-compose up --build
```

### Out of Disk Space

```bash
# Clean up Docker resources
docker system prune -a
docker volume prune
```

## Production Deployment

For production deployment on a server:

1. **Update environment variables** in `docker-compose.yml`
2. **Use proper secrets** for MongoDB
3. **Set up reverse proxy** (nginx/traefik)
4. **Configure SSL/TLS** certificates
5. **Set up monitoring** and logging
6. **Regular backups** of MongoDB data

### Example Production docker-compose.yml updates:

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

## Development Workflow

1. **Start development stack**:

   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Make changes** to your code (hot reload enabled)

3. **View logs** to debug:

   ```bash
   docker-compose -f docker-compose.dev.yml logs -f finance-app-dev
   ```

4. **Stop when done**:
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

## Security Notes

- Change default MongoDB Express credentials
- Use environment files for sensitive data
- Run containers as non-root user (already configured)
- Regular security updates for base images
- Network isolation between services

## Support

If you encounter issues:

1. Check the logs: `docker-compose logs`
2. Verify Docker is running: `docker info`
3. Ensure ports are available: `netstat -an | grep 3000`
4. Try rebuilding: `docker-compose up --build`
