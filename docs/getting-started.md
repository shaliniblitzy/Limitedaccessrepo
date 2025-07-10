# Getting Started with Node.js Tutorial HTTP Server

## Introduction

Welcome to the Node.js Tutorial HTTP Server! This project is designed to teach you the fundamentals of building HTTP servers using Node.js built-in modules. You'll learn how to create a simple web server that responds to HTTP requests without using any external frameworks or dependencies.

**What You'll Learn:**
- How to create an HTTP server using Node.js built-in modules
- Basic request routing and response generation
- HTTP status codes and error handling
- Server configuration and environment variables
- Process lifecycle management and graceful shutdown

**What You'll Build:**
A minimalist HTTP server with a single `/hello` endpoint that returns "Hello world" in plain text. This foundational example demonstrates core web server concepts and serves as a stepping stone for more complex applications.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Node.js Installation

**Required Version:** Node.js 22.x LTS or higher

1. **Download Node.js:**
   - Visit [nodejs.org](https://nodejs.org/)
   - Download the LTS (Long Term Support) version
   - Choose the installer for your operating system

2. **Install Node.js:**
   - Run the downloaded installer
   - Follow the installation wizard
   - Accept the default settings (includes npm)

3. **Verify Installation:**
   ```bash
   # Check Node.js version
   node --version
   # Expected output: v22.x.x or higher
   
   # Check npm version
   npm --version
   # Expected output: 11.4.2 or higher
   ```

### System Requirements

- **Operating System:** Windows 10+, macOS 10.15+, or Linux
- **Memory:** Minimum 2GB RAM
- **Disk Space:** At least 500MB free space
- **Network:** Internet connection for downloading dependencies (optional)

### Command Line Basics

You should be comfortable with basic command line operations:
- Navigating directories (`cd`, `ls`/`dir`)
- Running commands
- Understanding file paths

## Project Setup

### Directory Structure

The project is organized as follows:

```
project-root/
├── src/backend/
│   ├── server.mjs              # Main server entry point
│   ├── routes/
│   │   ├── index.mjs          # Route exports
│   │   └── router.mjs         # URL routing logic
│   ├── handlers/
│   │   ├── helloHandler.mjs   # /hello endpoint handler
│   │   └── errorHandler.mjs   # Error response handler
│   ├── utils/
│   │   ├── httpUtils.mjs      # HTTP utility functions
│   │   └── logger.mjs         # Logging utilities
│   ├── scripts/
│   │   ├── start.mjs          # Production startup script
│   │   └── dev.mjs            # Development startup script
│   ├── config.mjs             # Server configuration
│   ├── package.json           # Project metadata
│   └── README.md              # Backend documentation
└── docs/
    ├── getting-started.md     # This file
    ├── api.md                 # API documentation
    └── architecture.md        # System architecture
```

### Project Navigation

1. **Navigate to the backend directory:**
   ```bash
   cd src/backend
   ```

2. **Verify project files:**
   ```bash
   # List files (Linux/macOS)
   ls -la
   
   # List files (Windows)
   dir
   ```

   You should see files like `server.mjs`, `package.json`, and directories like `routes/`, `handlers/`, etc.

## Running the Server

The server can be started in multiple ways, depending on your needs:

### Method 1: Using npm Scripts (Recommended)

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm run start
```

### Method 2: Direct Node.js Execution

**Basic Server Start:**
```bash
node server.mjs
```

**Using Development Script:**
```bash
node scripts/dev.mjs
```

**Using Production Script:**
```bash
node scripts/start.mjs
```

### Expected Output

When the server starts successfully, you should see output similar to:

```
=== NODE.JS TUTORIAL HTTP SERVER STARTING ===
Node.js version: v22.x.x
Process ID: 12345
Platform: [your-platform]
Server configuration loaded - Port: 3000, Host: localhost, Environment: development
HTTP server successfully started and listening on localhost:3000
Tutorial endpoint available at: http://localhost:3000/hello
=== DEVELOPMENT SERVER READY FOR REQUESTS ===
```

### Server Configuration

The server uses environment variables for configuration:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | HTTP server port |
| `HOST` | localhost | Server host binding |
| `NODE_ENV` | development | Environment mode |

**Examples:**

```bash
# Custom port
PORT=8080 node server.mjs

# Custom host and port
HOST=0.0.0.0 PORT=8080 node server.mjs

# Production environment
NODE_ENV=production PORT=3000 node server.mjs
```

**Windows Users:**
```cmd
# Command Prompt
set PORT=8080
node server.mjs

# PowerShell
$env:PORT = "8080"
node server.mjs
```

## Testing the /hello Endpoint

Once your server is running, you can test the `/hello` endpoint using various methods:

### Method 1: Web Browser

1. Open your web browser
2. Navigate to: `http://localhost:3000/hello`
3. You should see: `Hello world`

### Method 2: cURL Command

```bash
# Basic request
curl http://localhost:3000/hello

# With headers displayed
curl -i http://localhost:3000/hello

# Verbose output
curl -v http://localhost:3000/hello
```

**Expected Response:**
```
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Connection: keep-alive

Hello world
```

### Method 3: JavaScript Fetch

```javascript
// Using fetch API
fetch('http://localhost:3000/hello')
  .then(response => response.text())
  .then(data => console.log(data)); // "Hello world"

// Using async/await
async function testHello() {
  const response = await fetch('http://localhost:3000/hello');
  const text = await response.text();
  console.log(text); // "Hello world"
}
```

### Method 4: Node.js HTTP Client

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

## Error Handling and Troubleshooting

### Understanding Error Responses

The server implements proper HTTP error handling:

**404 Not Found:**
```bash
curl http://localhost:3000/invalid-path
# Response: 404 Not Found
```

**405 Method Not Allowed:**
```bash
curl -X POST http://localhost:3000/hello
# Response: 405 Method Not Allowed
```

### Common Issues and Solutions

#### Issue 1: Port Already in Use

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**
1. **Use a different port:**
   ```bash
   PORT=3001 node server.mjs
   ```

2. **Find and stop the conflicting process:**
   ```bash
   # Find process using port 3000
   lsof -i :3000          # macOS/Linux
   netstat -ano | findstr :3000  # Windows
   
   # Stop the process
   kill -9 [PID]          # macOS/Linux
   taskkill /PID [PID] /F # Windows
   ```

3. **Use kill-port utility:**
   ```bash
   npx kill-port 3000
   ```

#### Issue 2: Permission Denied

**Error Message:**
```
Error: listen EACCES: permission denied
```

**Solutions:**
1. **Use a port above 1024:**
   ```bash
   PORT=3001 node server.mjs
   ```

2. **Avoid running as administrator** (security risk)

#### Issue 3: Node.js Version Issues

**Error Message:**
```
SyntaxError: Cannot use import statement outside a module
```

**Solutions:**
1. **Update Node.js to version 22.x or higher**
2. **Verify ES modules support:**
   ```bash
   node --version
   # Ensure version is 22.x.x or higher
   ```

#### Issue 4: Module Not Found

**Error Message:**
```
Cannot find module './routes/index.mjs'
```

**Solutions:**
1. **Verify you're in the correct directory:**
   ```bash
   pwd  # Should show .../src/backend
   ```

2. **Check file permissions:**
   ```bash
   ls -la routes/  # Verify files exist and are readable
   ```

### Network Troubleshooting

**Test network connectivity:**
```bash
# Test if server is listening
telnet localhost 3000

# Test with curl
curl -v http://localhost:3000/hello

# Check firewall settings (if applicable)
```

**Verify server configuration:**
```bash
# Check environment variables
echo $PORT
echo $HOST
echo $NODE_ENV
```

### Graceful Shutdown

Stop the server gracefully using:
- **Ctrl+C** (Windows/Linux)
- **Cmd+C** (macOS)

You should see shutdown messages:
```
SIGINT signal received (Ctrl+C) - initiating graceful shutdown...
HTTP server closed successfully
Graceful shutdown completed - exiting with success code 0
```

## Project Structure Overview

Understanding the project structure helps you navigate and extend the codebase:

### Core Files

#### `server.mjs`
- **Purpose:** Main server entry point
- **Function:** Creates HTTP server, handles startup/shutdown
- **Key Features:** Configuration loading, process signal handling

#### `config.mjs`
- **Purpose:** Server configuration management
- **Function:** Loads environment variables with defaults
- **Exports:** `getConfig()` function
- **Configuration:**
  - `DEFAULT_PORT`: 3000
  - `DEFAULT_HOST`: 'localhost'
  - `DEFAULT_ENV`: 'development'

#### `package.json`
- **Purpose:** Project metadata and scripts
- **Scripts:**
  - `start`: Production server startup
  - `dev`: Development server startup
  - `test`: Run tests
  - `coverage`: Run tests with coverage

### Directory Structure

#### `routes/`
- **`index.mjs`:** Route exports and main router
- **`router.mjs`:** URL routing logic and request dispatch

#### `handlers/`
- **`helloHandler.mjs`:** Handles `/hello` endpoint requests
- **`errorHandler.mjs`:** Handles 404 and error responses

#### `utils/`
- **`httpUtils.mjs`:** HTTP response utilities
- **`logger.mjs`:** Logging functions (logInfo, logWarn, logError)

#### `scripts/`
- **`start.mjs`:** Production server startup script
- **`dev.mjs`:** Development server startup script with enhanced logging

#### `docs/`
- **`api.md`:** API documentation and endpoint reference
- **`architecture.md`:** System architecture and design patterns

### Key Design Patterns

**Modular Architecture:**
- Separation of concerns between routing, handling, and utilities
- Clear interfaces between components
- Testable and maintainable code structure

**Configuration Management:**
- Environment variable support with sensible defaults
- Centralized configuration loading
- Validation and error handling

**Error Handling:**
- Comprehensive error responses with appropriate HTTP status codes
- Graceful degradation and recovery
- Security-conscious error messages

## Next Steps and Further Reading

### Immediate Next Steps

1. **Explore the Codebase:**
   - Read through `server.mjs` to understand server initialization
   - Examine `routes/router.mjs` to see how URL routing works
   - Study `handlers/helloHandler.mjs` to understand response generation

2. **Experiment with Configuration:**
   - Try different port numbers
   - Test various environment settings
   - Explore logging output in development mode

3. **Test Different Scenarios:**
   - Test valid and invalid endpoints
   - Try different HTTP methods
   - Observe error handling behavior

### Learning Resources

#### Backend Documentation
- **[Backend README](../backend/README.md):** Comprehensive backend documentation
- **[API Documentation](api.md):** Detailed endpoint specifications
- **[Architecture Documentation](architecture.md):** System design and patterns

#### Node.js Resources
- **[Node.js Official Documentation](https://nodejs.org/docs/):** Complete Node.js reference
- **[Node.js HTTP Module](https://nodejs.org/api/http.html):** HTTP server documentation
- **[ES Modules Guide](https://nodejs.org/api/esm.html):** Modern JavaScript modules

#### Educational Extensions

**Beginner Extensions:**
1. Add a new endpoint (e.g., `/goodbye`)
2. Implement request logging
3. Add request method validation
4. Create custom error messages

**Intermediate Extensions:**
1. Add request body parsing
2. Implement basic authentication
3. Add request rate limiting
4. Create a simple middleware system

**Advanced Extensions:**
1. Add database integration
2. Implement RESTful API patterns
3. Add comprehensive testing
4. Deploy to cloud platforms

### Development Tools

**Recommended Tools:**
- **Visual Studio Code:** Excellent Node.js support
- **Postman:** API testing and development
- **cURL:** Command-line HTTP client
- **Git:** Version control (if extending the project)

**Browser Developer Tools:**
- Network tab for HTTP request inspection
- Console for JavaScript testing
- Application tab for debugging

### Community Resources

**Node.js Community:**
- **[Node.js GitHub](https://github.com/nodejs/node):** Source code and issues
- **[Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices):** Production guidelines
- **[Node.js Discord](https://discord.gg/nodejs):** Community support

**Learning Platforms:**
- **MDN Web Docs:** JavaScript and HTTP fundamentals
- **freeCodeCamp:** Node.js tutorials and projects
- **Node.js Official Guides:** Step-by-step tutorials

### Production Considerations

When you're ready to move beyond this tutorial:

1. **Frameworks:** Consider Express.js for more features
2. **Databases:** Learn MongoDB, PostgreSQL, or MySQL
3. **Authentication:** Implement JWT or OAuth
4. **Security:** Add HTTPS, input validation, and rate limiting
5. **Monitoring:** Use APM tools for production monitoring
6. **Deployment:** Explore cloud platforms like AWS, Azure, or Heroku

---

**Congratulations!** You now have a working Node.js HTTP server and understand the fundamentals of web server development. Use this foundation to build more complex applications and explore the rich Node.js ecosystem.

**Need Help?** 
- Check the [troubleshooting section](#error-handling-and-troubleshooting) above
- Review the [backend documentation](../backend/README.md)
- Study the [API documentation](api.md) for endpoint details
- Explore the [architecture documentation](architecture.md) for system design insights