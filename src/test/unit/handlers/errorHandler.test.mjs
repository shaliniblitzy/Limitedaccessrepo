// Node.js built-in test module for defining and running unit test cases
import { test } from 'node:test'; // Node.js 22.x (built-in)

// Node.js built-in assertion module for verifying test outcomes
import { assert } from 'node:assert'; // Node.js 22.x (built-in)

// Import the functions under test from the error handler module
import { 
    handleNotFound, 
    handleMethodNotAllowed, 
    handleServerError 
} from '../../../backend/handlers/errorHandler.mjs';

// Import test helper functions for creating mock HTTP request/response objects
import { mockRequest, mockResponse } from '../../utils/testHelpers.mjs';

/**
 * Unit Test Suite: Error Handler Functions
 * 
 * This test suite verifies the correct behavior of error handler functions
 * that manage HTTP error responses for undefined routes, unsupported methods,
 * and server errors. The tests ensure protocol compliance, proper logging,
 * and security through prevention of sensitive information leakage.
 * 
 * Educational Purpose: Demonstrates comprehensive unit testing techniques
 * for HTTP error handlers, including mock object usage, assertion patterns,
 * and security validation for production-ready error handling.
 */

/**
 * Test: handleNotFound returns 404 Not Found
 * 
 * Verifies that the handleNotFound function correctly processes requests
 * to undefined routes by returning an HTTP 404 status code with appropriate
 * headers and message body. This test ensures proper HTTP protocol compliance
 * and validates the error response format for educational clarity.
 */
test('handleNotFound returns 404 Not Found', async (t) => {
    // Create mock request object for testing undefined route handling
    // Uses default GET method and custom URL path to simulate client request
    const req = mockRequest({ 
        method: 'GET', 
        url: '/undefined-route' 
    });
    
    // Create mock response object to capture HTTP response data
    // Initializes with default status code that will be overridden by handler
    const res = mockResponse();
    
    // Execute the function under test with mock request and response objects
    // This simulates the server calling handleNotFound for an undefined route
    handleNotFound(req, res);
    
    // Assert that the response status code is 404 (Not Found)
    // This verifies compliance with HTTP protocol for undefined routes
    assert.strictEqual(res.statusCode, 404, 
        'Response status code should be 404 for undefined routes');
    
    // Assert that the Content-Type header is set to plain text with UTF-8 encoding
    // This ensures proper content type declaration for HTTP protocol compliance
    assert.strictEqual(res.getHeader('Content-Type'), 'text/plain; charset=utf-8',
        'Content-Type header should be set to text/plain with charset=utf-8');
    
    // Assert that the response body contains the standard "Not Found" message
    // This validates the error message format and content for user feedback
    assert.strictEqual(res.getBody(), 'Not Found',
        'Response body should contain the standard "Not Found" message');
    
    // Assert that the response stream has been properly ended
    // This ensures complete HTTP response transmission to the client
    assert.strictEqual(res.isEnded(), true,
        'Response should be properly ended after sending 404 response');
    
    // Assert that headers have been sent to prevent further modifications
    // This validates proper HTTP response state management
    assert.strictEqual(res.headersSent, true,
        'Headers should be marked as sent after response completion');
});

/**
 * Test: handleMethodNotAllowed returns 405 and Allow header
 * 
 * Verifies that the handleMethodNotAllowed function correctly processes requests
 * with unsupported HTTP methods by returning an HTTP 405 status code with
 * the required Allow header. This test ensures HTTP protocol compliance
 * and validates proper method validation for educational understanding.
 */
test('handleMethodNotAllowed returns 405 and Allow header', async (t) => {
    // Create mock request object for testing unsupported method handling
    // Uses POST method to simulate a client request with unsupported method
    const req = mockRequest({ 
        method: 'POST', 
        url: '/hello' 
    });
    
    // Create mock response object to capture HTTP response data
    // Initializes with default status code that will be overridden by handler
    const res = mockResponse();
    
    // Define allowed methods array for the endpoint under test
    // This simulates the server's supported HTTP methods for the route
    const allowedMethods = ['GET'];
    
    // Execute the function under test with mock objects and allowed methods
    // This simulates the server calling handleMethodNotAllowed for unsupported method
    handleMethodNotAllowed(req, res, allowedMethods);
    
    // Assert that the response status code is 405 (Method Not Allowed)
    // This verifies compliance with HTTP protocol for unsupported methods
    assert.strictEqual(res.statusCode, 405,
        'Response status code should be 405 for unsupported HTTP methods');
    
    // Assert that the Content-Type header is set to plain text with UTF-8 encoding
    // This ensures proper content type declaration for HTTP protocol compliance
    assert.strictEqual(res.getHeader('Content-Type'), 'text/plain; charset=utf-8',
        'Content-Type header should be set to text/plain with charset=utf-8');
    
    // Assert that the Allow header contains the supported HTTP methods
    // This is required by HTTP/1.1 specification for 405 responses
    assert.strictEqual(res.getHeader('Allow'), 'GET',
        'Allow header should contain the supported HTTP methods');
    
    // Assert that the response body contains the standard "Method Not Allowed" message
    // This validates the error message format and content for user feedback
    assert.strictEqual(res.getBody(), 'Method Not Allowed',
        'Response body should contain the standard "Method Not Allowed" message');
    
    // Assert that the response stream has been properly ended
    // This ensures complete HTTP response transmission to the client
    assert.strictEqual(res.isEnded(), true,
        'Response should be properly ended after sending 405 response');
    
    // Assert that headers have been sent to prevent further modifications
    // This validates proper HTTP response state management
    assert.strictEqual(res.headersSent, true,
        'Headers should be marked as sent after response completion');
});

/**
 * Test: handleServerError returns 500 and does not leak error details
 * 
 * Verifies that the handleServerError function correctly processes unexpected
 * server errors by returning an HTTP 500 status code with a generic message
 * that does not expose sensitive error information. This test ensures both
 * HTTP protocol compliance and security through information disclosure prevention.
 */
test('handleServerError returns 500 and does not leak error details', async (t) => {
    // Create mock request object for testing server error handling
    // Uses default GET method and URL to simulate a normal client request
    const req = mockRequest({ 
        method: 'GET', 
        url: '/hello' 
    });
    
    // Create mock response object to capture HTTP response data
    // Initializes with default status code that will be overridden by handler
    const res = mockResponse();
    
    // Create a sample error object with sensitive information
    // This simulates a real server error that might contain sensitive details
    const testError = new Error('Database connection failed: username=admin, password=secret123');
    testError.stack = 'Error: Database connection failed\n    at /app/db.js:42:15\n    at /app/server.js:123:8';
    
    // Execute the function under test with mock objects and error
    // This simulates the server calling handleServerError for an unexpected error
    handleServerError(req, res, testError);
    
    // Assert that the response status code is 500 (Internal Server Error)
    // This verifies compliance with HTTP protocol for server errors
    assert.strictEqual(res.statusCode, 500,
        'Response status code should be 500 for internal server errors');
    
    // Assert that the Content-Type header is set to plain text with UTF-8 encoding
    // This ensures proper content type declaration for HTTP protocol compliance
    assert.strictEqual(res.getHeader('Content-Type'), 'text/plain; charset=utf-8',
        'Content-Type header should be set to text/plain with charset=utf-8');
    
    // Assert that the response body contains only the generic error message
    // This validates that sensitive information is not exposed to clients
    assert.strictEqual(res.getBody(), 'Internal Server Error',
        'Response body should contain only the generic "Internal Server Error" message');
    
    // Assert that the response body does not contain the original error message
    // This is critical for security - prevents sensitive information disclosure
    assert.strictEqual(res.getBody().includes('Database connection failed'), false,
        'Response body should not contain sensitive error details');
    
    // Assert that the response body does not contain sensitive data from the error
    // This validates that credentials and other sensitive information are not leaked
    assert.strictEqual(res.getBody().includes('username=admin'), false,
        'Response body should not contain sensitive credentials');
    
    // Assert that the response body does not contain the error stack trace
    // This prevents disclosure of internal application structure and file paths
    assert.strictEqual(res.getBody().includes('at /app/db.js'), false,
        'Response body should not contain stack trace information');
    
    // Assert that the response stream has been properly ended
    // This ensures complete HTTP response transmission to the client
    assert.strictEqual(res.isEnded(), true,
        'Response should be properly ended after sending 500 response');
    
    // Assert that headers have been sent to prevent further modifications
    // This validates proper HTTP response state management
    assert.strictEqual(res.headersSent, true,
        'Headers should be marked as sent after response completion');
});

/**
 * Test: handleMethodNotAllowed handles multiple allowed methods
 * 
 * Verifies that the handleMethodNotAllowed function correctly formats
 * the Allow header when multiple HTTP methods are supported. This test
 * ensures proper HTTP protocol compliance for endpoints with multiple
 * supported methods and validates header formatting for educational clarity.
 */
test('handleMethodNotAllowed handles multiple allowed methods', async (t) => {
    // Create mock request object for testing multiple method support
    // Uses PUT method to simulate a client request with unsupported method
    const req = mockRequest({ 
        method: 'PUT', 
        url: '/api/resource' 
    });
    
    // Create mock response object to capture HTTP response data
    const res = mockResponse();
    
    // Define multiple allowed methods for the endpoint under test
    // This simulates a RESTful endpoint supporting multiple HTTP methods
    const allowedMethods = ['GET', 'POST', 'DELETE'];
    
    // Execute the function under test with multiple allowed methods
    handleMethodNotAllowed(req, res, allowedMethods);
    
    // Assert that the response status code is 405 (Method Not Allowed)
    assert.strictEqual(res.statusCode, 405,
        'Response status code should be 405 for unsupported HTTP methods');
    
    // Assert that the Allow header contains all supported methods, comma-separated
    // This validates proper formatting of multiple methods in the Allow header
    assert.strictEqual(res.getHeader('Allow'), 'GET, POST, DELETE',
        'Allow header should contain all supported HTTP methods, comma-separated');
    
    // Assert that the response body contains the standard error message
    assert.strictEqual(res.getBody(), 'Method Not Allowed',
        'Response body should contain the standard "Method Not Allowed" message');
    
    // Assert that the response is properly completed
    assert.strictEqual(res.isEnded(), true,
        'Response should be properly ended after sending 405 response');
});

/**
 * Test: handleServerError handles missing error object gracefully
 * 
 * Verifies that the handleServerError function correctly handles cases
 * where no error object is provided, ensuring robust error handling
 * and preventing application crashes. This test validates defensive
 * programming practices for educational and production readiness.
 */
test('handleServerError handles missing error object gracefully', async (t) => {
    // Create mock request object for testing error handling without error object
    const req = mockRequest({ 
        method: 'GET', 
        url: '/hello' 
    });
    
    // Create mock response object to capture HTTP response data
    const res = mockResponse();
    
    // Execute the function under test without providing an error object
    // This simulates cases where handleServerError is called without error details
    handleServerError(req, res);
    
    // Assert that the response status code is 500 (Internal Server Error)
    // This verifies that the function handles missing error objects gracefully
    assert.strictEqual(res.statusCode, 500,
        'Response status code should be 500 even when no error object is provided');
    
    // Assert that the Content-Type header is properly set
    assert.strictEqual(res.getHeader('Content-Type'), 'text/plain; charset=utf-8',
        'Content-Type header should be set to text/plain with charset=utf-8');
    
    // Assert that the response body contains the generic error message
    assert.strictEqual(res.getBody(), 'Internal Server Error',
        'Response body should contain the generic "Internal Server Error" message');
    
    // Assert that the response is properly completed
    assert.strictEqual(res.isEnded(), true,
        'Response should be properly ended after sending 500 response');
});

/**
 * Test: handleMethodNotAllowed handles empty allowed methods array
 * 
 * Verifies that the handleMethodNotAllowed function correctly handles
 * edge cases where an empty or invalid allowed methods array is provided.
 * This test ensures robust input validation and defensive programming
 * practices for educational and production environments.
 */
test('handleMethodNotAllowed handles empty allowed methods array', async (t) => {
    // Create mock request object for testing edge case handling
    const req = mockRequest({ 
        method: 'POST', 
        url: '/hello' 
    });
    
    // Create mock response object to capture HTTP response data
    const res = mockResponse();
    
    // Execute the function under test with an empty allowed methods array
    // This tests the function's ability to handle invalid input gracefully
    handleMethodNotAllowed(req, res, []);
    
    // Assert that the response status code is 405 (Method Not Allowed)
    // This verifies that the function handles empty arrays gracefully
    assert.strictEqual(res.statusCode, 405,
        'Response status code should be 405 even with empty allowed methods array');
    
    // Assert that the Allow header contains the default GET method
    // This validates the function's fallback behavior for invalid input
    assert.strictEqual(res.getHeader('Allow'), 'GET',
        'Allow header should default to GET when empty allowed methods array is provided');
    
    // Assert that the response body contains the standard error message
    assert.strictEqual(res.getBody(), 'Method Not Allowed',
        'Response body should contain the standard "Method Not Allowed" message');
    
    // Assert that the response is properly completed
    assert.strictEqual(res.isEnded(), true,
        'Response should be properly ended after sending 405 response');
});