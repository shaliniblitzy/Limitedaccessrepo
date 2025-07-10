# Node.js Tutorial HTTP Server API Documentation

## Introduction

This documentation provides a comprehensive reference for the Node.js tutorial HTTP server API. The server is designed as an educational tool to demonstrate fundamental HTTP concepts, request routing, response generation, and error handling using Node.js built-in modules.

### Purpose

The API serves as a minimalist HTTP server implementation that:
- Demonstrates core HTTP server concepts without external dependencies
- Provides a single `/hello` endpoint for educational purposes
- Implements proper HTTP protocol compliance and error handling
- Serves as a foundation for learning Node.js web development

### Architecture Overview

The server follows a modular design with clear separation of concerns:
- **Router**: Central request routing and URL parsing
- **Handlers**: Endpoint-specific request processing
- **Utilities**: Shared HTTP response and logging functions
- **Error Handling**: Comprehensive error response management

For detailed architectural information, see [architecture.md](architecture.md).

## Endpoints

### GET /hello

Returns a static "Hello world" message demonstrating basic HTTP response generation.

**Request Format:**
```
GET /hello HTTP/1.1
Host: localhost:3000
```

**Response Format:**
```
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Connection: keep-alive

Hello world
```

**Parameters:**
- None required

**Success Response:**
- **Status Code:** 200 OK
- **Content-Type:** text/plain; charset=utf-8
- **Body:** "Hello world"

**Example Request:**
```bash
curl -X GET http://localhost:3000/hello
```

**Example Response:**
```
Hello world
```

## Status Codes

The server uses standard HTTP status codes to indicate request outcomes:

### 200 OK
- **Meaning:** Request processed successfully
- **When Returned:** GET requests to `/hello` endpoint
- **Response Body:** "Hello world"

### 404 Not Found
- **Meaning:** Requested resource does not exist
- **When Returned:** Requests to any path other than `/hello`
- **Response Body:** "Not Found"

### 405 Method Not Allowed
- **Meaning:** HTTP method not supported for the requested resource
- **When Returned:** Non-GET requests to `/hello` endpoint
- **Response Body:** "Method Not Allowed"
- **Headers:** Includes `Allow` header with supported methods

### 500 Internal Server Error
- **Meaning:** Unexpected server error occurred
- **When Returned:** Server-side errors during request processing
- **Response Body:** "Internal Server Error"

## Error Handling

The server implements comprehensive error handling following HTTP protocol standards:

### Error Response Format

All error responses follow a consistent structure:

```
HTTP/1.1 [STATUS_CODE] [REASON_PHRASE]
Content-Type: text/plain; charset=utf-8
Connection: keep-alive

[ERROR_MESSAGE]
```

### Error Scenarios

#### Undefined Routes (404)
**Scenario:** Request to any path other than `/hello`

**Example:**
```bash
curl -X GET http://localhost:3000/invalid-path
```

**Response:**
```
HTTP/1.1 404 Not Found
Content-Type: text/plain; charset=utf-8
Connection: keep-alive

Not Found
```

#### Unsupported Methods (405)
**Scenario:** Non-GET request to `/hello` endpoint

**Example:**
```bash
curl -X POST http://localhost:3000/hello
```

**Response:**
```
HTTP/1.1 405 Method Not Allowed
Content-Type: text/plain; charset=utf-8
Connection: keep-alive
Allow: GET

Method Not Allowed
```

#### Server Errors (500)
**Scenario:** Unexpected server-side error

**Response:**
```
HTTP/1.1 500 Internal Server Error
Content-Type: text/plain; charset=utf-8
Connection: keep-alive

Internal Server Error
```

**Security Note:** Error responses use generic messages to prevent information disclosure.

## Usage Examples

### Basic Usage

**Start the server:**
```bash
node src/backend/server.mjs
```

**Test the hello endpoint:**
```bash
curl http://localhost:3000/hello
```

**Expected output:**
```
Hello world
```

### Testing Error Scenarios

**Test 404 Not Found:**
```bash
curl -i http://localhost:3000/nonexistent
```

**Test 405 Method Not Allowed:**
```bash
curl -i -X POST http://localhost:3000/hello
```

**Test with verbose output:**
```bash
curl -v http://localhost:3000/hello
```

### Browser Testing

Open your browser and navigate to:
- `http://localhost:3000/hello` - Success response
- `http://localhost:3000/test` - 404 error response

### Programming Examples

**Node.js fetch example:**
```javascript
const response = await fetch('http://localhost:3000/hello');
const text = await response.text();
console.log(text); // "Hello world"
```

**cURL with headers:**
```bash
curl -H "Accept: text/plain" -H "User-Agent: Tutorial-Client/1.0" http://localhost:3000/hello
```

## Headers

The server sets standard HTTP headers for all responses:

### Standard Response Headers

#### Content-Type
- **Value:** `text/plain; charset=utf-8`
- **Purpose:** Indicates response content format and character encoding
- **Included In:** All responses

#### Connection
- **Value:** `keep-alive`
- **Purpose:** Maintains persistent HTTP connection for efficiency
- **Included In:** All responses

### Method-Specific Headers

#### Allow Header (405 Responses)
- **Value:** Comma-separated list of supported HTTP methods
- **Purpose:** Informs client of supported methods for the resource
- **Example:** `Allow: GET`
- **Included In:** 405 Method Not Allowed responses only

### Security Headers

The server implements basic security headers:
- **X-Content-Type-Options:** `nosniff` (prevents MIME type sniffing)
- **Content-Type:** Explicit charset specification prevents encoding attacks

## Performance Characteristics

### Response Times
- **Hello endpoint:** < 10ms typical response time
- **Error responses:** < 5ms typical response time

### Concurrency
- **Model:** Single-threaded event loop
- **Concurrent connections:** Supported via Node.js asynchronous I/O
- **Memory usage:** < 50MB typical footprint

### Scalability Notes
- Designed for educational and development use
- Production deployments should consider load balancing and clustering
- No built-in rate limiting or request throttling

## Cross-References

### Related Documentation
- [Architecture Overview](architecture.md) - System design and component interaction
- [Technical Specification](../../../docs/technical-specification.md) - Detailed requirements and implementation

### Source Code References
- [Server Entry Point](../server.mjs) - Main server initialization
- [Router Implementation](../routes/router.mjs) - Request routing logic
- [Hello Handler](../handlers/helloHandler.mjs) - `/hello` endpoint implementation
- [Error Handler](../handlers/errorHandler.mjs) - Error response management
- [HTTP Utilities](../utils/httpUtils.mjs) - Response generation utilities

### Dependencies
- **Node.js:** Version 22.x LTS or later
- **Built-in Modules:** `http`, `util` (no external dependencies)

## Educational Notes

### Learning Objectives
This API demonstrates:
- Basic HTTP server creation using Node.js built-in modules
- Request routing and URL parsing concepts
- HTTP status code usage and protocol compliance
- Error handling best practices and security considerations
- Structured logging for observability and debugging

### Extension Opportunities
Students can extend this API by:
- Adding new endpoints and HTTP methods
- Implementing request body parsing for POST requests
- Adding basic authentication or request validation
- Implementing middleware concepts for request processing
- Adding database integration for dynamic content

### Best Practices Demonstrated
- Modular code organization with clear separation of concerns
- Comprehensive error handling with appropriate status codes
- Security-conscious error messages that prevent information disclosure
- Consistent HTTP header usage for protocol compliance
- Structured logging for debugging and monitoring