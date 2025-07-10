# Node.js Tutorial HTTP Server

A comprehensive educational HTTP server implementation demonstrating fundamental Node.js concepts using only built-in modules. This project serves as a hands-on learning resource for developers, students, and educators exploring server-side JavaScript development.

## 🎯 Project Overview

This tutorial project implements a minimalist HTTP server with a single `/hello` endpoint, designed to teach core Node.js web development concepts without the complexity of external frameworks. The implementation prioritizes educational clarity, comprehensive documentation, and production-ready patterns.

### Educational Purpose

- **Target Audience**: Beginning developers, students, and educators
- **Learning Focus**: HTTP server fundamentals, Node.js architecture, and web development patterns
- **Skill Level**: Beginner to intermediate
- **Prerequisites**: Basic JavaScript knowledge and command line familiarity

### Key Features

- 🚀 **Zero External Dependencies**: Uses only Node.js built-in modules
- 📚 **Educational Documentation**: Comprehensive guides and code comments
- 🔧 **Production Patterns**: Proper error handling, logging, and lifecycle management
- 🌐 **Cross-Platform**: Compatible with Windows, macOS, and Linux
- 🧪 **Built-in Testing**: Node.js native test runner with coverage reporting
- 📊 **Observable Behavior**: Comprehensive logging for learning and debugging

## 🚀 Quick Start

### Prerequisites

- **Node.js**: Version 22.x LTS or higher
- **npm**: Version 11.4.2 or higher
- **Operating System**: Windows 10+, macOS 10.15+, or Linux

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd nodejs-tutorial-http-server
   ```

2. **Navigate to the backend directory**:
   ```bash
   cd src/backend
   ```

3. **Verify Node.js installation**:
   ```bash
   node --version  # Should show v22.x.x or higher
   npm --version   # Should show 11.4.2 or higher
   ```

### Running the Server

**Development Mode (Recommended for learning)**:
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

**Direct Node.js execution**:
```bash
node server.mjs
```

### Expected Output

```
=== NODE.JS TUTORIAL HTTP SERVER STARTING ===
Node.js version: v22.x.x
Server configuration loaded - Port: 3000, Host: localhost, Environment: development
HTTP server successfully started and listening on localhost:3000
Tutorial endpoint available at: http://localhost:3000/hello
=== DEVELOPMENT SERVER READY FOR REQUESTS ===
```

## 📡 API Usage

### Available Endpoint

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/hello` | Returns greeting message | `Hello world` |

### Example Usage

**Web Browser**:
```
http://localhost:3000/hello
```

**cURL**:
```bash
# Basic request
curl http://localhost:3000/hello

# With headers
curl -i http://localhost:3000/hello

# Expected Response:
# HTTP/1.1 200 OK
# Content-Type: text/plain; charset=utf-8
# Connection: keep-alive
# 
# Hello world
```

**JavaScript Fetch**:
```javascript
// Using fetch API
const response = await fetch('http://localhost:3000/hello');
const text = await response.text();
console.log(text); // "Hello world"
```

**Node.js HTTP Client**:
```javascript
import http from 'node:http';

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/hello',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data)); // "Hello world"
});

req.end();
```

### Error Responses

**404 Not Found**:
```bash
curl http://localhost:3000/invalid-path
# HTTP/1.1 404 Not Found
# Content-Type: text/plain; charset=utf-8
# 
# Not Found
```

**405 Method Not Allowed**:
```bash
curl -X POST http://localhost:3000/hello
# HTTP/1.1 405 Method Not Allowed
# Allow: GET
# Content-Type: text/plain; charset=utf-8
# 
# Method Not Allowed
```

## 🏗️ Architecture Summary

### High-Level Design

The server implements a **minimalist single-threaded event-driven architecture** using Node.js built-in capabilities:

- **Event-Driven Processing**: Non-blocking I/O with the Node.js event loop
- **Stateless Design**: No database or session management
- **Modular Components**: Clear separation of concerns
- **Protocol Compliance**: HTTP/1.1 standards compliance

### Core Components

```
HTTP Server (server.mjs)
├── Configuration Manager (config.mjs)
├── Router Module (routes/router.mjs)
├── Request Handlers
│   ├── Hello Handler (handlers/helloHandler.mjs)
│   └── Error Handler (handlers/errorHandler.mjs)
└── Utilities
    ├── HTTP Utils (utils/httpUtils.mjs)
    └── Logger (utils/logger.mjs)
```

### Request Flow

```
HTTP Request → Node.js Server → Router → Handler → HTTP Response
```

1. **Request Reception**: Client sends HTTP request
2. **URL Parsing**: Router extracts path and method
3. **Route Matching**: Router selects appropriate handler
4. **Response Generation**: Handler creates HTTP response
5. **Response Transmission**: Server sends response to client

For detailed architecture information, see [Architecture Overview](docs/architecture-overview.md).

## 📁 Project Structure

```
nodejs-tutorial-http-server/
├── README.md                          # This file
├── src/backend/                       # Backend server implementation
│   ├── server.mjs                     # Main server entry point
│   ├── config.mjs                     # Configuration management
│   ├── package.json                   # Project metadata and scripts
│   ├── routes/
│   │   ├── index.mjs                  # Route exports
│   │   └── router.mjs                 # URL routing logic
│   ├── handlers/
│   │   ├── helloHandler.mjs           # /hello endpoint handler
│   │   └── errorHandler.mjs           # Error response handler
│   ├── utils/
│   │   ├── httpUtils.mjs              # HTTP response utilities
│   │   └── logger.mjs                 # Logging functions
│   └── scripts/
│       ├── start.mjs                  # Production startup script
│       └── dev.mjs                    # Development startup script
├── docs/                              # Comprehensive documentation
│   ├── getting-started.md             # Detailed setup guide
│   ├── architecture-overview.md       # System architecture
│   ├── testing-guide.md               # Testing strategy
│   └── deployment.md                  # Deployment instructions
├── src/test/                          # Test suite
│   ├── unit/                          # Unit tests
│   ├── integration/                   # Integration tests
│   └── performance/                   # Performance tests
└── infrastructure/                    # Deployment configurations
    ├── Dockerfile                     # Container configuration
    ├── docker-compose.yml             # Multi-container setup
    └── nginx.conf                     # Reverse proxy configuration
```

## 🧪 Testing

### Running Tests

The project uses Node.js built-in test runner with zero external dependencies:

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:performance

# Run tests with coverage
npm run coverage
```

### Test Coverage

- **Unit Tests**: Core functionality and components
- **Integration Tests**: HTTP request-response cycles
- **Performance Tests**: Response time and resource usage
- **Coverage Target**: 90%+ for educational completeness

For detailed testing information, see [Testing Guide](docs/testing-guide.md).

## 🚀 Deployment

### Local Development

```bash
# Development mode with enhanced logging
npm run dev

# Production mode
npm start

# Custom configuration
PORT=8080 HOST=0.0.0.0 node server.mjs
```

### Docker Deployment

```bash
# Build container
docker build -t nodejs-tutorial-server .

# Run container
docker run -p 3000:3000 nodejs-tutorial-server

# Using Docker Compose
docker-compose up
```

### Production Deployment

```bash
# Production environment
NODE_ENV=production PORT=3000 npm start
```

### Configuration Options

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port (1025-65535) |
| `HOST` | localhost | Server host binding |
| `NODE_ENV` | development | Environment mode |

For comprehensive deployment instructions, see [Deployment Guide](docs/deployment.md).

## 📖 Further Reading

### Core Documentation

- **[Getting Started Guide](docs/getting-started.md)**: Comprehensive setup and usage instructions
- **[Architecture Overview](docs/architecture-overview.md)**: Detailed system design and component responsibilities
- **[Testing Guide](docs/testing-guide.md)**: Testing strategy and best practices
- **[Deployment Guide](docs/deployment.md)**: Production deployment and configuration

### Backend Documentation

- **[Backend README](src/backend/README.md)**: Backend-specific documentation
- **[API Documentation](src/backend/docs/api.md)**: Detailed endpoint specifications
- **[Backend Architecture](src/backend/docs/architecture.md)**: Implementation details

### Learning Resources

#### Node.js Resources
- **[Node.js Official Documentation](https://nodejs.org/docs/)**: Complete Node.js reference
- **[Node.js HTTP Module](https://nodejs.org/api/http.html)**: HTTP server API documentation
- **[ES Modules Guide](https://nodejs.org/api/esm.html)**: Modern JavaScript module system

#### Educational Extensions

**Beginner Projects**:
- Add new endpoints (`/goodbye`, `/status`)
- Implement request logging middleware
- Add configuration validation
- Create custom error messages

**Intermediate Projects**:
- Add request body parsing
- Implement basic authentication
- Add rate limiting
- Create middleware system

**Advanced Projects**:
- Database integration (MongoDB, PostgreSQL)
- RESTful API implementation
- Comprehensive testing suite
- Cloud deployment (AWS, Azure, GCP)

## 🛠️ Development Tools

### Recommended Tools

- **Visual Studio Code**: Excellent Node.js support with extensions
- **Postman**: API testing and development
- **cURL**: Command-line HTTP client testing
- **Git**: Version control for extending the project

### Browser Developer Tools

- **Network Tab**: HTTP request/response inspection
- **Console**: JavaScript testing and debugging
- **Application Tab**: Local storage and debugging

## 🤝 Contributing

This is an educational project designed for learning. Students and educators are encouraged to:

1. **Fork the repository** for classroom use
2. **Extend functionality** with new features
3. **Create additional examples** for different concepts
4. **Improve documentation** with clearer explanations
5. **Add language translations** for broader accessibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Troubleshooting

**Common Issues**:
- **Port already in use**: Try `PORT=3001 npm start`
- **Node.js version**: Ensure Node.js 22.x or higher
- **Permission denied**: Use ports above 1024

**Getting Help**:
- Check [Getting Started Guide](docs/getting-started.md) for detailed setup
- Review [Architecture Overview](docs/architecture-overview.md) for design insights
- Study code comments for implementation details

### Community Resources

- **[Node.js Official Community](https://nodejs.org/community/)**: Support and discussions
- **[Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)**: Production guidelines
- **[MDN Web Docs](https://developer.mozilla.org/)**: HTTP and JavaScript fundamentals

---

**🎉 Congratulations!** You now have a working Node.js HTTP server and understand the fundamentals of web server development. Use this foundation to explore the rich Node.js ecosystem and build more complex applications.

**Ready to learn more?** Start with the [Getting Started Guide](docs/getting-started.md) for detailed tutorials and hands-on exercises.