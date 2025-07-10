# Node.js Tutorial Backend

A simple, educational HTTP server implementation demonstrating Node.js fundamentals and web server development concepts using only built-in Node.js modules.

## Project Overview

This backend application serves as a foundational example for learning Node.js server-side development. It implements a minimal HTTP server with a single `/hello` endpoint that returns "Hello world" in plain text. The project emphasizes understanding core HTTP server concepts without the complexity of external frameworks or dependencies.

**Key Features:**
- **Zero External Dependencies**: Uses only Node.js built-in HTTP module
- **Educational Focus**: Clear, well-documented code suitable for beginners
- **Event-Driven Architecture**: Demonstrates Node.js single-threaded event loop
- **Cross-Platform Compatibility**: Works on Windows, macOS, and Linux
- **Modern JavaScript**: Utilizes ES Modules (ESM) with Node.js 22.x LTS

**Technologies Used:**
- Node.js 22.x LTS (Active LTS until October 2025)
- ES Modules (ESM) for modern JavaScript standards
- Built-in HTTP module for server functionality
- No external dependencies for educational clarity

## Getting Started

### Prerequisites

- **Node.js**: Version 22.x LTS or higher (recommended for production applications)
- **npm**: Version 11.4.2 or higher (bundled with Node.js)

### Installation

1. **Install Node.js**: Download and install Node.js 22.x LTS from [nodejs.org](https://nodejs.org/)

2. **Verify Installation**:
   ```bash
   node --version
   # Expected output: v22.x.x
   
   npm --version
   # Expected output: 11.4.2 or higher
   ```

3. **Clone the Repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

4. **Navigate to Backend Directory**:
   ```bash
   cd src/backend
   ```

### Dependencies

This project intentionally uses **zero external dependencies** to maintain educational clarity and demonstrate Node.js built-in capabilities. All required functionality is provided by:
- Node.js built-in HTTP module (`node:http`)
- Node.js built-in URL utilities
- Standard JavaScript ES Module system

## Running the Server

### Basic Server Start

Start the HTTP server using Node.js directly:

```bash
node server.mjs
```

### Expected Output

```
Server is running on http://localhost:3000
Server ready to accept requests on /hello endpoint
```

### Port Configuration

**Default Port**: The server runs on port 3000 by default.

**Custom Port**: Set a different port using the `PORT` environment variable:

```bash
# Using environment variable
PORT=8080 node server.mjs

# Or export the variable (Unix/Linux/macOS)
export PORT=8080
node server.mjs

# Windows Command Prompt
set PORT=8080
node server.mjs

# Windows PowerShell
$env:PORT = "8080"
node server.mjs
```

### Server Configuration

The server can be configured through environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | HTTP server port |
| `HOST` | localhost | Server host binding |
| `NODE_ENV` | development | Environment mode |

### Stopping the Server

Stop the server using:
- **Ctrl+C** (Windows/Linux)
- **Cmd+C** (macOS)

## API Endpoints

### GET /hello

Returns a simple "Hello world" message in plain text format.

**Request:**
```http
GET /hello HTTP/1.1
Host: localhost:3000
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 11

Hello world
```

**Example Usage:**

**Using curl:**
```bash
curl http://localhost:3000/hello
# Response: Hello world
```

**Using Web Browser:**
Navigate to `http://localhost:3000/hello` to see the response.

**Using JavaScript fetch:**
```javascript
fetch('http://localhost:3000/hello')
  .then(response => response.text())
  .then(data => console.log(data)); // "Hello world"
```

### Response Details

- **Status Code**: 200 OK
- **Content-Type**: text/plain
- **Response Body**: "Hello world"
- **Response Time**: Typically < 50ms

## Error Handling

The server implements basic error handling for undefined routes and invalid requests.

### 404 Not Found

Any request to a path other than `/hello` returns a 404 error.

**Request:**
```http
GET /invalid-path HTTP/1.1
Host: localhost:3000
```

**Response:**
```http
HTTP/1.1 404 Not Found
Content-Type: text/plain
Content-Length: 13

404 Not Found
```

### Supported HTTP Methods

- **GET**: Only GET requests are supported
- **Other Methods**: POST, PUT, DELETE, etc., will return 404 Not Found

### Error Behavior

- **Undefined Routes**: Returns 404 Not Found with generic error message
- **Invalid Requests**: Handled gracefully with appropriate HTTP status codes
- **Server Errors**: Logged to console with generic client response
- **Network Errors**: Automatic connection cleanup and resource management

## Project Structure

```
src/backend/
├── server.mjs              # Main server file and entry point
├── routes/                 # Route handling modules
│   └── router.mjs         # URL routing logic
├── handlers/               # Request handlers
│   ├── helloHandler.mjs   # /hello endpoint handler
│   └── errorHandler.mjs   # 404 error handler
├── utils/                  # Utility functions
│   └── logger.mjs         # Basic logging utilities
├── test/                   # Test files
│   ├── server.test.mjs    # Server integration tests
│   └── handlers.test.mjs  # Handler unit tests
├── package.json           # Project configuration
└── README.md             # This file
```

### Key Files Description

- **server.mjs**: Main application entry point containing HTTP server setup and configuration
- **routes/router.mjs**: URL routing logic that matches incoming requests to appropriate handlers
- **handlers/helloHandler.mjs**: Handles GET requests to `/hello` endpoint and generates response
- **handlers/errorHandler.mjs**: Manages 404 responses for undefined routes
- **utils/logger.mjs**: Simple logging utilities for development and debugging
- **test/**: Contains test files using Node.js built-in test runner

## Development and Testing

### Running Tests

This project uses Node.js built-in test runner (available in Node.js 22.x):

```bash
# Run all tests
node --test

# Run tests with coverage
node --test --experimental-test-coverage

# Run tests in watch mode during development
node --test --watch
```

### Test Structure

```bash
# Run specific test file
node --test test/server.test.mjs

# Run tests matching a pattern
node --test test/*.test.mjs
```

### Development Commands

Common npm scripts for development:

```bash
# Start development server
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Code Quality

The project follows these development practices:

- **ES Modules**: Modern JavaScript module system
- **Async/Await**: Promise-based asynchronous programming
- **Error Handling**: Comprehensive error management
- **Code Comments**: Educational documentation throughout
- **Test Coverage**: Comprehensive test suite with high coverage

### Contributing

When extending or modifying the backend:

1. **Maintain Educational Focus**: Keep code simple and well-documented
2. **Zero Dependencies**: Avoid external packages unless absolutely necessary
3. **Follow Patterns**: Maintain consistent code structure and naming
4. **Add Tests**: Include tests for new functionality
5. **Update Documentation**: Keep README and comments current

## Architecture Summary

### Server Architecture

The backend follows a **single-threaded event-driven architecture** that demonstrates Node.js core concepts:

- **Event Loop**: Single-threaded processing with asynchronous I/O
- **Non-Blocking I/O**: Handles multiple concurrent connections efficiently
- **Stateless Design**: No server-side state or session management
- **Minimal Footprint**: Lightweight server with minimal resource usage

### Request Processing Flow

```
HTTP Request → Node.js HTTP Server → Router → Handler → Response
```

1. **Request Reception**: HTTP server receives incoming request
2. **URL Parsing**: Router extracts path and method from request
3. **Route Matching**: Router determines appropriate handler
4. **Handler Execution**: Handler generates response content
5. **Response Delivery**: Server sends HTTP response to client

### Design Principles

- **Simplicity**: Minimal complexity for educational clarity
- **Modularity**: Separated concerns with distinct modules
- **Reliability**: Robust error handling and resource management
- **Performance**: Efficient request processing with minimal overhead
- **Scalability**: Event-driven architecture supports concurrent connections

### Memory and Performance

- **Memory Usage**: Typically < 50MB during operation
- **Response Time**: < 50ms for /hello endpoint
- **Startup Time**: < 1 second for server initialization
- **Concurrent Connections**: Handles multiple simultaneous requests

## Further Reading

### Related Documentation

- **Main Project README**: `../../README.md` - Overall project documentation
- **Technical Specifications**: Project architecture and design decisions
- **API Documentation**: Detailed endpoint specifications and examples

### Node.js Resources

- **Official Node.js Documentation**: [nodejs.org/docs](https://nodejs.org/docs)
- **Node.js HTTP Module**: [nodejs.org/api/http.html](https://nodejs.org/api/http.html)
- **ES Modules Guide**: [nodejs.org/api/esm.html](https://nodejs.org/api/esm.html)
- **Node.js Best Practices**: [github.com/goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices)

### Educational Resources

- **Node.js Tutorial Series**: Building more complex applications
- **HTTP Protocol Fundamentals**: Understanding web communication
- **JavaScript Async Programming**: Mastering promises and async/await
- **Server-Side Development**: Moving beyond tutorial examples

### Next Steps

After mastering this basic server, consider exploring:

1. **Express.js Framework**: Popular Node.js web framework
2. **Database Integration**: Adding data persistence with MongoDB or PostgreSQL
3. **Authentication**: Implementing user management and security
4. **REST API Design**: Building comprehensive API endpoints
5. **Production Deployment**: Deploying to cloud platforms

---

**Note**: This is an educational project designed for learning Node.js fundamentals. For production applications, consider using established frameworks like Express.js and implementing comprehensive security, logging, and monitoring solutions.