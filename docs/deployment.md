# Node.js Tutorial HTTP Server Deployment Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Local Deployment](#local-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Docker Compose Orchestration](#docker-compose-orchestration)
6. [Environment Configuration](#environment-configuration)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices and Further Reading](#best-practices-and-further-reading)

## Introduction

This comprehensive deployment guide provides step-by-step instructions for running the Node.js tutorial HTTP server across multiple deployment scenarios. The guide supports local development, containerized deployment, and orchestrated multi-service environments, ensuring compatibility across Windows, macOS, and Linux platforms.

### Deployment Options Overview

The Node.js tutorial HTTP server supports three primary deployment methods:

- **Local Deployment**: Direct execution using Node.js runtime (recommended for development and learning)
- **Docker Deployment**: Containerized deployment for consistent environments and portability
- **Docker Compose Orchestration**: Multi-container setup with optional nginx reverse proxy

### Educational Focus

This guide emphasizes educational clarity and practical learning, providing detailed explanations of each deployment method, configuration options, and troubleshooting strategies. All instructions include command examples, expected output, and verification steps to ensure successful deployment.

## Prerequisites

Before deploying the Node.js tutorial HTTP server, ensure your system meets the following requirements:

### System Requirements

| Component | Minimum Version | Recommended Version | Platform Support |
|-----------|-----------------|-------------------|------------------|
| **Node.js** | 22.0.0 | 22.x LTS | Windows, macOS, Linux |
| **Memory** | 512 MB | 1 GB | All platforms |
| **Storage** | 100 MB | 500 MB | All platforms |
| **Network** | Available port | Port 3000 available | All platforms |

### Development Environment Requirements

#### Node.js Installation

**Verify Node.js Installation:**
```bash
node --version
```

**Expected Output:**
```
v22.x.x
```

**Install Node.js (if not present):**
- Visit [nodejs.org](https://nodejs.org/) and download the latest LTS version
- Follow the installation instructions for your operating system
- Verify installation with the version command above

#### Optional: Docker Installation

**For Docker deployment, verify Docker installation:**
```bash
docker --version
docker-compose --version
```

**Expected Output:**
```
Docker version 24.x.x
Docker Compose version v2.x.x
```

**Install Docker (if needed):**
- Visit [docker.com](https://www.docker.com/get-started) for installation instructions
- Install Docker Desktop for Windows/macOS or Docker Engine for Linux

## Local Deployment

Local deployment runs the Node.js HTTP server directly on your machine using the Node.js runtime. This method provides the fastest development cycle and is ideal for learning and experimentation.

### Step 1: Clone and Navigate to Project

```bash
# Clone the repository (if using version control)
git clone <repository-url>
cd nodejs-tutorial

# Navigate to the backend directory
cd src/backend
```

### Step 2: Verify Project Structure

Ensure the following files are present:
```
src/backend/
├── server.mjs           # Main HTTP server implementation
├── config.mjs           # Configuration management
├── package.json         # Project metadata and scripts
├── scripts/
│   ├── start.mjs        # Production startup script
│   └── dev.mjs          # Development startup script
├── routes/
│   ├── index.mjs        # Main routing logic
│   └── router.mjs       # Router utilities
├── handlers/
│   ├── helloHandler.mjs # Hello endpoint handler
│   └── errorHandler.mjs # Error handling logic
└── utils/
    ├── logger.mjs       # Logging utilities
    └── httpUtils.mjs    # HTTP utility functions
```

### Step 3: Configure Environment (Optional)

Set environment variables to customize the server configuration:

```bash
# Set custom port (default: 3000)
export PORT=4000

# Set custom host (default: localhost)
export HOST=0.0.0.0

# Set environment mode (default: development)
export NODE_ENV=development
```

**Windows Command Prompt:**
```cmd
set PORT=4000
set HOST=0.0.0.0
set NODE_ENV=development
```

**Windows PowerShell:**
```powershell
$env:PORT = "4000"
$env:HOST = "0.0.0.0"
$env:NODE_ENV = "development"
```

### Step 4: Start the Server

#### Method 1: Using npm scripts (Recommended)

```bash
# Start in production mode
npm start

# Start in development mode
npm run dev
```

#### Method 2: Direct Node.js execution

```bash
# Start using the startup script
node ./scripts/start.mjs

# Start using the main server file
node server.mjs
```

### Step 5: Verify Server Operation

**Check server logs:**
The server will display startup information similar to:
```
[2024-01-15T10:30:00.000Z] [INFO] === Node.js Tutorial HTTP Server Starting ===
[2024-01-15T10:30:00.001Z] [INFO] Node.js version: v22.x.x
[2024-01-15T10:30:00.002Z] [INFO] Server configuration loaded - Port: 3000, Host: localhost, Environment: development
[2024-01-15T10:30:00.003Z] [INFO] Server successfully started and listening on localhost:3000
[2024-01-15T10:30:00.004Z] [INFO] Tutorial endpoint available at: http://localhost:3000/hello
```

**Test the hello endpoint:**
```bash
# Using curl
curl http://localhost:3000/hello

# Using browser
# Navigate to http://localhost:3000/hello
```

**Expected Response:**
```
Hello world
```

### Step 6: Stop the Server

Press `Ctrl+C` to gracefully stop the server. The server will display shutdown information:
```
[2024-01-15T10:35:00.000Z] [INFO] SIGINT signal received (Ctrl+C) - initiating graceful shutdown...
[2024-01-15T10:35:00.001Z] [INFO] HTTP server closed successfully
[2024-01-15T10:35:00.002Z] [INFO] Graceful shutdown completed - exiting with success code 0
```

## Docker Deployment

Docker deployment provides a consistent, isolated environment for running the Node.js HTTP server. This method ensures reproducible deployments across different systems and environments.

### Step 1: Verify Docker Installation

```bash
docker --version
```

**Expected Output:**
```
Docker version 24.x.x, build xxxxxxx
```

### Step 2: Navigate to Project Root

```bash
cd nodejs-tutorial
```

### Step 3: Build Docker Image

```bash
# Build the Docker image using the provided Dockerfile
docker build -f infrastructure/Dockerfile -t nodejs-tutorial-backend .
```

**Expected Output:**
```
Step 1/7 : FROM node:22-slim
 ---> xxxxxxxx
Step 2/7 : WORKDIR /usr/src/app
 ---> xxxxxxxx
...
Successfully built xxxxxxxx
Successfully tagged nodejs-tutorial-backend:latest
```

### Step 4: Run Docker Container

#### Basic Container Run

```bash
docker run -p 3000:3000 --name nodejs-tutorial-backend nodejs-tutorial-backend
```

#### Container Run with Custom Environment

```bash
# Run with custom port mapping and environment variables
docker run -p 4000:3000 -e PORT=3000 -e NODE_ENV=production --name nodejs-tutorial-backend nodejs-tutorial-backend
```

#### Container Run in Detached Mode

```bash
# Run in background (detached mode)
docker run -d -p 3000:3000 --name nodejs-tutorial-backend nodejs-tutorial-backend
```

### Step 5: Verify Container Operation

**Check container status:**
```bash
docker ps
```

**Expected Output:**
```
CONTAINER ID   IMAGE                       COMMAND           CREATED         STATUS         PORTS                    NAMES
xxxxxxxx       nodejs-tutorial-backend     "node server.mjs" 2 minutes ago   Up 2 minutes   0.0.0.0:3000->3000/tcp   nodejs-tutorial-backend
```

**View container logs:**
```bash
docker logs nodejs-tutorial-backend
```

**Test the application:**
```bash
curl http://localhost:3000/hello
```

**Expected Response:**
```
Hello world
```

### Step 6: Container Management

#### Stop Container
```bash
docker stop nodejs-tutorial-backend
```

#### Start Stopped Container
```bash
docker start nodejs-tutorial-backend
```

#### Remove Container
```bash
docker rm nodejs-tutorial-backend
```

#### Remove Docker Image
```bash
docker rmi nodejs-tutorial-backend
```

## Docker Compose Orchestration

Docker Compose orchestration provides a complete multi-container environment with the Node.js backend and optional nginx reverse proxy. This deployment method demonstrates service orchestration and reverse proxy concepts.

### Step 1: Verify Docker Compose Installation

```bash
docker-compose --version
```

**Expected Output:**
```
Docker Compose version v2.x.x
```

### Step 2: Navigate to Project Root

```bash
cd nodejs-tutorial
```

### Step 3: Review Docker Compose Configuration

The `infrastructure/docker-compose.yml` file defines two services:
- **backend**: Node.js HTTP server
- **nginx**: Reverse proxy (optional)

### Step 4: Start the Application Stack

#### Start All Services

```bash
# Start and build all services
docker-compose -f infrastructure/docker-compose.yml up --build

# Start services in detached mode
docker-compose -f infrastructure/docker-compose.yml up -d --build
```

#### Start Specific Service

```bash
# Start only the backend service
docker-compose -f infrastructure/docker-compose.yml up backend

# Start only the nginx service (requires backend)
docker-compose -f infrastructure/docker-compose.yml up nginx
```

### Step 5: Verify Service Operation

**Check service status:**
```bash
docker-compose -f infrastructure/docker-compose.yml ps
```

**Expected Output:**
```
Name                        Command               State           Ports
---------------------------------------------------------------------------------
nodejs-tutorial-backend     node server.mjs                 Up      0.0.0.0:3000->3000/tcp
nodejs-tutorial-nginx       /docker-entrypoint.sh nginx     Up      0.0.0.0:8080->80/tcp
```

**View service logs:**
```bash
# View all service logs
docker-compose -f infrastructure/docker-compose.yml logs

# View backend service logs
docker-compose -f infrastructure/docker-compose.yml logs backend

# View nginx service logs
docker-compose -f infrastructure/docker-compose.yml logs nginx

# Follow log output
docker-compose -f infrastructure/docker-compose.yml logs -f backend
```

### Step 6: Test Service Endpoints

**Test backend service directly:**
```bash
curl http://localhost:3000/hello
```

**Test nginx reverse proxy:**
```bash
curl http://localhost:8080/hello
```

**Test nginx health check:**
```bash
curl http://localhost:8080/health
```

**Expected Responses:**
```
# Backend and nginx proxy response
Hello world

# Nginx health check response
nginx proxy healthy
```

### Step 7: Service Management

#### Stop All Services
```bash
docker-compose -f infrastructure/docker-compose.yml down
```

#### Stop and Remove Volumes
```bash
docker-compose -f infrastructure/docker-compose.yml down -v
```

#### Restart Services
```bash
docker-compose -f infrastructure/docker-compose.yml restart
```

#### Scale Services (for testing)
```bash
# Scale backend service to 2 instances
docker-compose -f infrastructure/docker-compose.yml up --scale backend=2
```

## Environment Configuration

The Node.js tutorial HTTP server supports flexible configuration through environment variables. This section explains how to customize server behavior for different deployment scenarios.

### Configuration Parameters

| Parameter | Default Value | Description | Example Values |
|-----------|---------------|-------------|----------------|
| `PORT` | 3000 | HTTP server listening port | 3000, 4000, 8080 |
| `HOST` | localhost | HTTP server binding address | localhost, 0.0.0.0, 127.0.0.1 |
| `NODE_ENV` | development | Node.js environment mode | development, production |

### Local Environment Configuration

#### Using Environment Variables

**Linux/macOS:**
```bash
export PORT=4000
export HOST=0.0.0.0
export NODE_ENV=production
node ./scripts/start.mjs
```

**Windows Command Prompt:**
```cmd
set PORT=4000
set HOST=0.0.0.0
set NODE_ENV=production
node ./scripts/start.mjs
```

**Windows PowerShell:**
```powershell
$env:PORT = "4000"
$env:HOST = "0.0.0.0"
$env:NODE_ENV = "production"
node ./scripts/start.mjs
```

#### Using .env Files (if supported)

Create a `.env` file in the backend directory:
```env
PORT=4000
HOST=0.0.0.0
NODE_ENV=production
```

### Docker Environment Configuration

#### Using Docker Run Commands

```bash
# Pass environment variables using -e flag
docker run -p 4000:3000 -e PORT=3000 -e NODE_ENV=production nodejs-tutorial-backend
```

#### Using Environment Files

Create a `docker.env` file:
```env
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
```

Run with environment file:
```bash
docker run -p 3000:3000 --env-file docker.env nodejs-tutorial-backend
```

### Docker Compose Environment Configuration

#### Method 1: Direct Environment Variables

Modify `docker-compose.yml`:
```yaml
services:
  backend:
    environment:
      - PORT=4000
      - HOST=0.0.0.0
      - NODE_ENV=production
```

#### Method 2: Environment Files

Create a `compose.env` file:
```env
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
```

Update `docker-compose.yml`:
```yaml
services:
  backend:
    env_file:
      - compose.env
```

### Configuration Validation

The server validates all configuration parameters at startup:

**Valid Port Range:** 1025-65535
**Valid Host Formats:** IP addresses, hostnames, 0.0.0.0 (all interfaces)
**Valid Environments:** Any non-empty string (commonly: development, production, staging)

**Configuration Loading Logs:**
```
[2024-01-15T10:30:00.000Z] [INFO] Loading server configuration...
[2024-01-15T10:30:00.001Z] [INFO] Using PORT from environment variable: 4000
[2024-01-15T10:30:00.002Z] [INFO] Using HOST from environment variable: 0.0.0.0
[2024-01-15T10:30:00.003Z] [INFO] Using NODE_ENV from environment variable: production
[2024-01-15T10:30:00.004Z] [INFO] Server configuration loaded successfully - Port: 4000, Host: 0.0.0.0, Environment: production
```

## Troubleshooting

This section provides solutions for common deployment issues and debugging strategies.

### Common Issues and Solutions

#### Issue 1: Port Already in Use

**Error Message:**
```
[2024-01-15T10:30:00.000Z] [ERROR] Port 3000 is already in use. Please try a different port or stop the conflicting service.
```

**Solutions:**
```bash
# Option 1: Use a different port
export PORT=4000
node ./scripts/start.mjs

# Option 2: Find and stop the conflicting process
# Linux/macOS:
lsof -i :3000
kill -9 <PID>

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Option 3: Use Docker with port mapping
docker run -p 4000:3000 nodejs-tutorial-backend
```

#### Issue 2: Permission Denied (Port Access)

**Error Message:**
```
[2024-01-15T10:30:00.000Z] [ERROR] Access denied when binding to port 80. Please check permissions or use a port above 1024.
```

**Solutions:**
```bash
# Option 1: Use a non-privileged port (recommended)
export PORT=3000
node ./scripts/start.mjs

# Option 2: Run with elevated permissions (not recommended for development)
# Linux/macOS:
sudo node ./scripts/start.mjs

# Windows: Run Command Prompt as Administrator
```

#### Issue 3: Docker Build Failures

**Error Message:**
```
ERROR: failed to solve: failed to compute cache key: failed to walk /var/lib/docker/tmp/buildkit-mount123456789/src/backend: lstat /var/lib/docker/tmp/buildkit-mount123456789/src/backend: no such file or directory
```

**Solutions:**
```bash
# Verify correct build context and file paths
docker build -f infrastructure/Dockerfile -t nodejs-tutorial-backend .

# Check file structure
ls -la src/backend/

# Rebuild without cache
docker build --no-cache -f infrastructure/Dockerfile -t nodejs-tutorial-backend .
```

#### Issue 4: Container Not Accessible

**Error Message:**
```
curl: (7) Failed to connect to localhost port 3000: Connection refused
```

**Solutions:**
```bash
# Check container status
docker ps

# Check port mapping
docker port nodejs-tutorial-backend

# Verify container logs
docker logs nodejs-tutorial-backend

# Test with correct port mapping
docker run -p 3000:3000 nodejs-tutorial-backend
```

#### Issue 5: Docker Compose Service Dependencies

**Error Message:**
```
ERROR: for nginx  Container "nodejs-tutorial-backend" is unhealthy
```

**Solutions:**
```bash
# Check service health
docker-compose -f infrastructure/docker-compose.yml ps

# View service logs
docker-compose -f infrastructure/docker-compose.yml logs backend

# Restart unhealthy services
docker-compose -f infrastructure/docker-compose.yml restart backend

# Force rebuild
docker-compose -f infrastructure/docker-compose.yml up --build --force-recreate
```

### Debugging Strategies

#### Enable Debug Logging

```bash
# Enable debug logging for local deployment
export DEBUG=nodejs-tutorial:*
node ./scripts/start.mjs

# Enable debug logging for Docker
docker run -p 3000:3000 -e DEBUG=nodejs-tutorial:* nodejs-tutorial-backend
```

#### Check Network Connectivity

```bash
# Test local connectivity
curl -v http://localhost:3000/hello

# Test container connectivity
docker exec -it nodejs-tutorial-backend curl http://localhost:3000/hello

# Test from another container
docker run --rm --network container:nodejs-tutorial-backend curlimages/curl curl http://localhost:3000/hello
```

#### Monitor Resource Usage

```bash
# Check system resources
htop
# or
top

# Check Docker resource usage
docker stats nodejs-tutorial-backend

# Check Docker Compose resource usage
docker-compose -f infrastructure/docker-compose.yml top
```

### Log Analysis

#### Understanding Server Logs

**Startup Logs:**
```
[INFO] === Node.js Tutorial HTTP Server Starting ===
[INFO] Node.js version: v22.x.x
[INFO] Server configuration loaded - Port: 3000, Host: localhost, Environment: development
[INFO] Server successfully started and listening on localhost:3000
```

**Request Logs:**
```
[INFO] New client connection established from ::1:12345
[INFO] GET /hello - 200 OK (5ms)
```

**Error Logs:**
```
[ERROR] Server error occurred: EADDRINUSE: address already in use :::3000
[ERROR] Port 3000 is already in use. Please try a different port or stop the conflicting service.
```

**Shutdown Logs:**
```
[INFO] SIGINT signal received (Ctrl+C) - initiating graceful shutdown...
[INFO] HTTP server closed successfully
[INFO] Graceful shutdown completed - exiting with success code 0
```

### Getting Help

If you encounter issues not covered in this troubleshooting guide:

1. **Check the server logs** for specific error messages
2. **Verify your environment** matches the prerequisites
3. **Test with minimal configuration** using default settings
4. **Consult the Node.js documentation** for platform-specific issues
5. **Review Docker documentation** for containerization problems

## Best Practices and Further Reading

### Development Best Practices

#### Local Development Workflow

1. **Use the development script** for local development:
   ```bash
   npm run dev
   ```

2. **Set appropriate environment variables**:
   ```bash
   export NODE_ENV=development
   export DEBUG=nodejs-tutorial:*
   ```

3. **Use version control** to track configuration changes:
   ```bash
   git add .env.example
   git commit -m "Add environment configuration example"
   ```

#### Production Deployment

1. **Use production environment settings**:
   ```bash
   export NODE_ENV=production
   export PORT=3000
   ```

2. **Remove debug logging** in production:
   ```bash
   unset DEBUG
   ```

3. **Use process managers** for production deployments:
   ```bash
   # Using PM2 (if available)
   pm2 start ./scripts/start.mjs --name nodejs-tutorial
   ```

### Docker Best Practices

#### Container Security

1. **Use non-root user** in containers (already implemented in Dockerfile)
2. **Minimize container attack surface** using slim base images
3. **Keep containers up to date** with latest security patches

#### Container Optimization

1. **Use multi-stage builds** for larger applications
2. **Optimize layer caching** by organizing Dockerfile commands
3. **Use .dockerignore** to exclude unnecessary files

#### Container Monitoring

1. **Implement health checks** (configured in docker-compose.yml)
2. **Use proper logging** for container observability
3. **Monitor resource usage** with Docker stats

### Educational Resources

#### Node.js Documentation

- [Node.js Official Documentation](https://nodejs.org/en/docs/)
- [Node.js HTTP Module Guide](https://nodejs.org/api/http.html)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)

#### Docker Documentation

- [Docker Getting Started](https://docs.docker.com/get-started/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/best-practices/)

#### Related Project Files

- **Backend README**: `src/backend/README.md` - Detailed backend implementation guide
- **Server Implementation**: `src/backend/server.mjs` - Main HTTP server code
- **Configuration Module**: `src/backend/config.mjs` - Environment configuration logic
- **Docker Configuration**: `infrastructure/Dockerfile` - Container build instructions
- **Compose Configuration**: `infrastructure/docker-compose.yml` - Multi-container orchestration

### Next Steps

After successfully deploying the Node.js tutorial HTTP server, consider these learning extensions:

1. **Add More Endpoints**: Extend the server with additional routes and handlers
2. **Implement Middleware**: Add logging, authentication, or validation middleware
3. **Add Database Integration**: Connect to databases for persistent data storage
4. **Implement Testing**: Add unit tests, integration tests, and performance tests
5. **Production Deployment**: Deploy to cloud platforms like AWS, Google Cloud, or Azure
6. **Monitoring and Observability**: Add metrics, tracing, and alerting
7. **CI/CD Integration**: Implement automated testing and deployment pipelines

### Conclusion

This deployment guide provides comprehensive instructions for running the Node.js tutorial HTTP server across multiple environments. The step-by-step approach ensures successful deployment while maintaining educational clarity and practical applicability.

The deployment methods covered in this guide provide a foundation for understanding modern application deployment patterns, from local development to containerized production environments. Each method builds upon fundamental concepts while introducing more sophisticated orchestration and configuration management techniques.

For additional support and advanced deployment scenarios, consult the referenced documentation and explore the provided project files for deeper implementation details.