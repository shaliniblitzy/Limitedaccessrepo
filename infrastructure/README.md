# Node.js Tutorial HTTP Server Infrastructure

## Table of Contents

1. [Introduction](#introduction)
2. [Infrastructure Overview](#infrastructure-overview)
3. [File Descriptions](#file-descriptions)
4. [Quickstart Guide](#quickstart-guide)
5. [Service Details](#service-details)
6. [Customization Options](#customization-options)
7. [Troubleshooting](#troubleshooting)
8. [Educational Notes](#educational-notes)
9. [References](#references)

## Introduction

This infrastructure layer provides a **cross-platform, reproducible development and demonstration environment** for the Node.js tutorial HTTP server project. Built using Docker and Docker Compose, it creates a containerized environment that eliminates the "it works on my machine" problem while demonstrating real-world deployment patterns in a simplified, educational context.

### Purpose and Educational Value

The infrastructure demonstrates fundamental concepts in modern application deployment:
- **Containerization**: Using Docker to package applications with their dependencies
- **Service Orchestration**: Using Docker Compose to manage multi-container applications
- **Reverse Proxy**: Using nginx to forward requests to backend services
- **Development Workflow**: Creating reproducible environments for collaborative development

### Key Features

- **Zero External Dependencies**: Uses only Docker and Docker Compose
- **Cross-Platform Compatibility**: Works on Windows, macOS, and Linux
- **Educational Focus**: Transparent, well-documented configuration files
- **Production Patterns**: Demonstrates real-world deployment concepts in a simplified way
- **Optional Complexity**: nginx reverse proxy can be used or bypassed based on learning objectives

## Infrastructure Overview

The infrastructure consists of three main components working together to create a complete development environment:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Docker Compose Stack                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │   nginx:latest  │    │  backend:built  │                    │
│  │   Port: 8080    │───▶│   Port: 3000    │                    │
│  │   (Reverse      │    │   (Node.js      │                    │
│  │    Proxy)       │    │    Server)      │                    │
│  └─────────────────┘    └─────────────────┘                    │
│                                                                 │
│  Network: nodejs-tutorial-bridge (172.20.0.0/16)              │
│  Volumes: nginx-logs, backend-src                              │
└─────────────────────────────────────────────────────────────────┘
```

### Service Communication Flow

1. **Client Request**: HTTP request sent to `http://localhost:8080/hello`
2. **nginx Proxy**: Receives request on port 8080, forwards to backend service
3. **Backend Processing**: Node.js server processes request and returns "Hello world"
4. **Response Chain**: nginx forwards response back to client

## File Descriptions

### docker-compose.yml

**Purpose**: Orchestrates the multi-container application stack for local development.

**Key Features**:
- **Backend Service**: Builds and runs the Node.js HTTP server
- **nginx Service**: Provides reverse proxy functionality
- **Network Configuration**: Creates isolated bridge network for service communication
- **Volume Management**: Handles persistent data and development workflow
- **Health Checks**: Monitors service availability and readiness

**Service Configuration**:
```yaml
services:
  backend:
    build: 
      context: ../src/backend
      dockerfile: ../../infrastructure/Dockerfile
    ports: ["3000:3000"]
    environment:
      - NODE_ENV=development
      - PORT=3000
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/hello"]
      interval: 10s
      timeout: 3s
      retries: 3
  
  nginx:
    image: nginx:latest
    ports: ["8080:80"]
    depends_on:
      backend:
        condition: service_healthy
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
```

### Dockerfile

**Purpose**: Builds the backend Node.js HTTP server container image.

**Build Process**:
1. **Base Image**: Uses `node:22-slim` for minimal, secure foundation
2. **Working Directory**: Sets `/usr/src/app` as the container working directory
3. **Source Copy**: Copies all backend source code into the container
4. **Environment Setup**: Configures `NODE_ENV=production` and `PORT=3000`
5. **Port Exposure**: Exposes port 3000 for HTTP communication
6. **Entrypoint**: Starts the server with `node server.mjs`

**Container Characteristics**:
- **Minimal Size**: Using slim base image reduces attack surface
- **No npm install**: Backend uses only Node.js built-in modules
- **Production Ready**: Optimized for production deployment patterns
- **Educational**: Transparent build process for learning Docker concepts

### nginx.conf

**Purpose**: Configures nginx as a reverse proxy service for the Node.js backend.

**Configuration Highlights**:
- **Upstream Backend**: Defines backend server group for load balancing
- **Proxy Settings**: Headers, timeouts, and connection management
- **Error Handling**: Custom error pages and graceful failure handling
- **Health Endpoints**: `/health` and `/nginx-status` for monitoring
- **Security Headers**: Basic security headers for development use

**Proxy Configuration**:
```nginx
upstream backend {
    server backend:3000;
    keepalive 32;
    keepalive_requests 100;
    keepalive_timeout 60s;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Quickstart Guide

### Prerequisites

Ensure you have the following installed on your system:

- **Docker**: Version 20.10+ ([Installation Guide](https://docs.docker.com/get-docker/))
- **Docker Compose**: Version 2.0+ ([Installation Guide](https://docs.docker.com/compose/install/))

### Step-by-Step Instructions

1. **Navigate to Infrastructure Directory**:
   ```bash
   cd infrastructure
   ```

2. **Start the Application Stack**:
   ```bash
   docker-compose up --build
   ```
   This command will:
   - Build the backend Node.js container image
   - Start both backend and nginx services
   - Create the necessary networks and volumes
   - Display logs from both services

3. **Access the Application**:
   - **Direct Backend Access**: `http://localhost:3000/hello`
   - **Via nginx Proxy**: `http://localhost:8080/hello`
   - **nginx Health Check**: `http://localhost:8080/health`

4. **Verify Services Are Running**:
   ```bash
   docker-compose ps
   ```
   Expected output:
   ```
   Name                          Command               State           Ports
   nodejs-tutorial-backend       node server.mjs              Up      0.0.0.0:3000->3000/tcp
   nodejs-tutorial-nginx         nginx -g daemon off;         Up      0.0.0.0:8080->80/tcp
   ```

5. **Stop the Application Stack**:
   ```bash
   docker-compose down
   ```

### Alternative Usage Commands

**Start in Detached Mode** (background):
```bash
docker-compose up -d --build
```

**View Logs**:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f nginx
```

**Execute Commands in Containers**:
```bash
# Check Node.js version in backend
docker-compose exec backend node --version

# Check nginx configuration
docker-compose exec nginx nginx -t
```

**Remove Volumes and Networks**:
```bash
docker-compose down -v
```

## Service Details

### Backend Service (Node.js HTTP Server)

**Service Configuration**:
- **Container Name**: `nodejs-tutorial-backend`
- **Base Image**: `node:22-slim`
- **Internal Port**: 3000
- **External Port**: 3000 (mapped to host)
- **Environment**: Development mode with debugging enabled

**Health Check**:
- **Endpoint**: `http://localhost:3000/hello`
- **Interval**: 10 seconds
- **Timeout**: 3 seconds
- **Retries**: 3 attempts before marking unhealthy

**Volume Mounts**:
- **Source Code**: `../src/backend:/usr/src/app:ro` (read-only for development)
- **Package Config**: `../src/backend/package.json:/usr/src/app/package.json:ro`

**Resource Limits**:
- **Memory**: 256MB limit, 128MB reserved
- **CPU**: 0.5 CPU limit, 0.25 CPU reserved

### nginx Service (Reverse Proxy)

**Service Configuration**:
- **Container Name**: `nodejs-tutorial-nginx`
- **Base Image**: `nginx:latest`
- **Internal Port**: 80
- **External Port**: 8080 (mapped to host)
- **Dependencies**: Waits for backend service to be healthy

**Volume Mounts**:
- **Configuration**: `./nginx.conf:/etc/nginx/nginx.conf:ro`
- **Error Pages**: `./html:/usr/share/nginx/html:ro`
- **Logs**: `nginx-logs:/var/log/nginx`

**Health Check**:
- **Endpoint**: `http://localhost/health`
- **Interval**: 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3 attempts before marking unhealthy

**Resource Limits**:
- **Memory**: 128MB limit, 64MB reserved
- **CPU**: 0.25 CPU limit, 0.1 CPU reserved

### Network Configuration

**Network Name**: `nodejs-tutorial-bridge`
**Driver**: bridge
**Subnet**: 172.20.0.0/16
**Gateway**: 172.20.0.1

**Service Discovery**:
- Backend accessible at `backend:3000` within the network
- nginx accessible at `nginx:80` within the network
- DNS resolution provided by Docker's embedded DNS server

## Customization Options

### Port Configuration

**Change Backend Port**:
```yaml
# In docker-compose.yml
services:
  backend:
    ports:
      - "3001:3000"  # Host port 3001, container port 3000
    environment:
      - PORT=3000    # Keep container port consistent
```

**Change nginx Port**:
```yaml
# In docker-compose.yml
services:
  nginx:
    ports:
      - "8081:80"    # Host port 8081, container port 80
```

### Environment Variables

**Backend Environment**:
```yaml
# In docker-compose.yml
services:
  backend:
    environment:
      - NODE_ENV=production        # Change to production mode
      - PORT=3000                  # Application port
      - DEBUG=nodejs-tutorial:*    # Debug logging
      - LOG_LEVEL=info            # Custom logging level
```

**nginx Environment**:
```yaml
# In docker-compose.yml
services:
  nginx:
    environment:
      - NGINX_WORKER_PROCESSES=2         # Increase worker processes
      - NGINX_WORKER_CONNECTIONS=2048    # Increase connections per worker
      - BACKEND_HOST=backend             # Backend service hostname
      - BACKEND_PORT=3000               # Backend service port
```

### Adding Services

**Add a Database Service**:
```yaml
# In docker-compose.yml
services:
  # ... existing services ...
  
  database:
    image: postgres:15
    container_name: nodejs-tutorial-db
    environment:
      - POSTGRES_DB=tutorial
      - POSTGRES_USER=tutorial
      - POSTGRES_PASSWORD=tutorial
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

### Custom nginx Configuration

**Create Custom Error Pages**:
```bash
# Create custom error pages directory
mkdir -p html

# Create custom 404 page
cat > html/404.html << 'EOF'
<!DOCTYPE html>
<html>
<head><title>404 Not Found</title></head>
<body>
    <h1>404 - Page Not Found</h1>
    <p>The requested resource was not found on this server.</p>
</body>
</html>
EOF
```

**Add SSL/TLS Support**:
```nginx
# In nginx.conf
server {
    listen 80;
    listen 443 ssl;
    
    ssl_certificate /etc/nginx/certs/cert.pem;
    ssl_certificate_key /etc/nginx/certs/key.pem;
    
    # ... rest of configuration
}
```

## Troubleshooting

### Common Issues and Solutions

#### Port Already in Use

**Error**:
```
ERROR: for nodejs-tutorial-backend  Cannot start service backend: 
Ports are not available: port is already allocated
```

**Solution**:
```bash
# Check what's using the port
sudo netstat -tulpn | grep :3000

# Kill the process using the port
sudo kill -9 <PID>

# Or change the port in docker-compose.yml
services:
  backend:
    ports:
      - "3001:3000"  # Use different host port
```

#### Backend Service Unhealthy

**Error**:
```
backend_1  | health check failed: curl: (7) Failed to connect to localhost port 3000
```

**Solution**:
```bash
# Check backend logs
docker-compose logs backend

# Verify the server is starting correctly
docker-compose exec backend node --version

# Check if the /hello endpoint is implemented
curl http://localhost:3000/hello
```

#### nginx Configuration Error

**Error**:
```
nginx_1  | nginx: [emerg] invalid number of arguments in "proxy_pass" directive
```

**Solution**:
```bash
# Test nginx configuration
docker-compose exec nginx nginx -t

# Check nginx configuration file
cat nginx.conf

# Reload nginx configuration
docker-compose exec nginx nginx -s reload
```

#### Volume Mount Issues

**Error**:
```
backend_1  | Error: Cannot find module '/usr/src/app/server.mjs'
```

**Solution**:
```bash
# Verify source code exists
ls -la ../src/backend/

# Check volume mount paths in docker-compose.yml
# Ensure paths are correct relative to docker-compose.yml location
```

### Network Connectivity Issues

**Test Service Communication**:
```bash
# Test backend directly
curl http://localhost:3000/hello

# Test nginx proxy
curl http://localhost:8080/hello

# Test nginx health
curl http://localhost:8080/health

# Check service networking
docker-compose exec nginx ping backend
```

### Performance Issues

**Monitor Resource Usage**:
```bash
# Check container resource usage
docker stats

# Check service logs for performance issues
docker-compose logs --tail=50 backend
docker-compose logs --tail=50 nginx
```

**Optimize Resource Limits**:
```yaml
# In docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M    # Increase memory limit
          cpus: '1.0'     # Increase CPU limit
```

## Educational Notes

### Learning Objectives

This infrastructure setup demonstrates several key concepts for modern application deployment:

#### 1. Containerization Concepts

**Docker Fundamentals**:
- **Image vs Container**: Understanding the difference between templates (images) and running instances (containers)
- **Dockerfile Best Practices**: Multi-stage builds, layer caching, and security considerations
- **Container Lifecycle**: Build, run, stop, and remove operations

**Educational Value**:
- Shows how to package a Node.js application with its runtime dependencies
- Demonstrates reproducible environments across different development machines
- Illustrates the benefits of container isolation and resource management

#### 2. Service Orchestration

**Docker Compose Fundamentals**:
- **Service Definition**: Defining multiple services and their relationships
- **Network Management**: Creating isolated networks for service communication
- **Volume Management**: Handling persistent data and development workflows
- **Dependency Management**: Controlling service startup order and health dependencies

**Educational Value**:
- Demonstrates how real-world applications consist of multiple interconnected services
- Shows how to manage complex application stacks with simple configuration files
- Illustrates the importance of service discovery and inter-service communication

#### 3. Reverse Proxy Concepts

**nginx as Reverse Proxy**:
- **Load Balancing**: Distributing requests across multiple backend instances
- **Request Routing**: Directing requests based on paths, headers, or other criteria
- **Header Management**: Preserving client information through proxy chains
- **Error Handling**: Graceful handling of backend failures

**Educational Value**:
- Demonstrates how production applications handle client requests
- Shows the separation of concerns between web servers and application servers
- Illustrates common patterns for scaling web applications

#### 4. Development Workflow

**Local Development Environment**:
- **Hot Reloading**: Automatically restarting services when code changes
- **Log Aggregation**: Collecting and viewing logs from multiple services
- **Health Monitoring**: Ensuring services are running and responding correctly
- **Environment Configuration**: Managing different settings for development vs production

**Educational Value**:
- Shows how to create productive development environments
- Demonstrates the importance of monitoring and observability
- Illustrates best practices for local development that translate to production

### Best Practices Demonstrated

#### 1. Security Considerations

**Container Security**:
- **Minimal Base Images**: Using slim images to reduce attack surface
- **Non-Root Users**: Running services as non-privileged users
- **Resource Limits**: Preventing resource exhaustion attacks
- **Network Isolation**: Limiting inter-service communication

**Application Security**:
- **Error Handling**: Preventing information disclosure through error messages
- **Header Security**: Adding security headers to protect against common attacks
- **Input Validation**: Validating and sanitizing user inputs

#### 2. Operational Excellence

**Monitoring and Observability**:
- **Health Checks**: Implementing health endpoints for service monitoring
- **Logging**: Structured logging for debugging and analysis
- **Metrics**: Collecting performance and usage metrics
- **Alerting**: Setting up notifications for service failures

**Deployment Practices**:
- **Graceful Shutdown**: Properly handling service termination
- **Rolling Updates**: Updating services without downtime
- **Configuration Management**: Externalizing configuration from code
- **Backup and Recovery**: Protecting against data loss

#### 3. Scalability Patterns

**Horizontal Scaling**:
- **Load Balancing**: Distributing load across multiple instances
- **Stateless Services**: Designing services that can be easily replicated
- **Service Discovery**: Dynamically finding and connecting to services
- **Auto-scaling**: Automatically adjusting capacity based on demand

**Vertical Scaling**:
- **Resource Optimization**: Tuning CPU and memory allocation
- **Performance Monitoring**: Identifying bottlenecks and optimization opportunities
- **Capacity Planning**: Predicting and preparing for growth

### Extending the Infrastructure

#### 1. Adding Monitoring

**Prometheus and Grafana**:
```yaml
# Add to docker-compose.yml
services:
  prometheus:
    image: prom/prometheus:latest
    container_name: nodejs-tutorial-prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
  
  grafana:
    image: grafana/grafana:latest
    container_name: nodejs-tutorial-grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana
    depends_on:
      - prometheus

volumes:
  prometheus-data:
  grafana-data:
```

#### 2. Adding Logging

**ELK Stack (Elasticsearch, Logstash, Kibana)**:
```yaml
# Add to docker-compose.yml
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.14.0
    container_name: nodejs-tutorial-elasticsearch
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch-data:/usr/share/elasticsearch/data
  
  logstash:
    image: docker.elastic.co/logstash/logstash:7.14.0
    container_name: nodejs-tutorial-logstash
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    depends_on:
      - elasticsearch
  
  kibana:
    image: docker.elastic.co/kibana/kibana:7.14.0
    container_name: nodejs-tutorial-kibana
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch

volumes:
  elasticsearch-data:
```

#### 3. Adding Database

**PostgreSQL with Persistent Storage**:
```yaml
# Add to docker-compose.yml
services:
  database:
    image: postgres:15
    container_name: nodejs-tutorial-postgres
    environment:
      - POSTGRES_DB=tutorial
      - POSTGRES_USER=tutorial
      - POSTGRES_PASSWORD=tutorial
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U tutorial"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres-data:
```

## References

### Documentation

- **Docker Documentation**: [https://docs.docker.com/](https://docs.docker.com/)
- **Docker Compose Documentation**: [https://docs.docker.com/compose/](https://docs.docker.com/compose/)
- **nginx Documentation**: [https://nginx.org/en/docs/](https://nginx.org/en/docs/)
- **Node.js Documentation**: [https://nodejs.org/en/docs/](https://nodejs.org/en/docs/)

### Docker Best Practices

- **Dockerfile Best Practices**: [https://docs.docker.com/develop/dev-best-practices/](https://docs.docker.com/develop/dev-best-practices/)
- **Docker Security**: [https://docs.docker.com/engine/security/](https://docs.docker.com/engine/security/)
- **Multi-stage Builds**: [https://docs.docker.com/develop/dev-best-practices/#use-multi-stage-builds](https://docs.docker.com/develop/dev-best-practices/#use-multi-stage-builds)

### nginx Configuration

- **nginx Reverse Proxy Guide**: [https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- **nginx Load Balancing**: [https://docs.nginx.com/nginx/admin-guide/load-balancer/](https://docs.nginx.com/nginx/admin-guide/load-balancer/)
- **nginx Security**: [https://nginx.org/en/docs/http/ngx_http_ssl_module.html](https://nginx.org/en/docs/http/ngx_http_ssl_module.html)

### Node.js Resources

- **Node.js Getting Started**: [https://nodejs.org/en/docs/guides/getting-started-guide/](https://nodejs.org/en/docs/guides/getting-started-guide/)
- **Node.js Best Practices**: [https://github.com/goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices)
- **Node.js Security**: [https://nodejs.org/en/docs/guides/security/](https://nodejs.org/en/docs/guides/security/)

### Container Orchestration

- **Docker Swarm**: [https://docs.docker.com/engine/swarm/](https://docs.docker.com/engine/swarm/)
- **Kubernetes**: [https://kubernetes.io/docs/home/](https://kubernetes.io/docs/home/)
- **Container Orchestration Patterns**: [https://kubernetes.io/docs/concepts/](https://kubernetes.io/docs/concepts/)

### Monitoring and Observability

- **Prometheus**: [https://prometheus.io/docs/introduction/overview/](https://prometheus.io/docs/introduction/overview/)
- **Grafana**: [https://grafana.com/docs/grafana/latest/](https://grafana.com/docs/grafana/latest/)
- **ELK Stack**: [https://www.elastic.co/what-is/elk-stack](https://www.elastic.co/what-is/elk-stack)

---

**Note**: This infrastructure is designed for educational purposes and local development. For production deployment, additional considerations such as security hardening, scalability planning, backup strategies, and monitoring solutions would be required.

**License**: MIT License - Feel free to use, modify, and distribute this infrastructure for educational purposes.

**Contributions**: This infrastructure is part of a Node.js tutorial project. Contributions and improvements are welcome through pull requests and issue reports.