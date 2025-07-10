// Node.js built-in test runner for creating and running integration test cases
import { test } from 'node:test'; // Node.js 22.x (built-in)

// Node.js built-in assertion library for validating test outcomes and expectations
import assert from 'node:assert'; // Node.js 22.x (built-in)

// Test utility functions for server lifecycle management and HTTP requests
// These utilities enable real integration testing against a running server instance
import { 
    startTestServer, 
    httpRequest, 
    TEST_PORT, 
    TEST_HOST 
} from '../../utils/index.mjs';

// Import the main router function to use as the request handler for the test server
// This provides the complete request routing and response generation functionality
import { router } from '../../backend/routes/index.mjs';

/**
 * Integration Test Suite for Hello Endpoint
 * 
 * This test suite validates the complete request-response cycle for the '/hello' endpoint
 * and related error handling scenarios. It uses real HTTP requests against a running
 * test server instance to ensure end-to-end functionality as specified in the technical
 * requirements.
 * 
 * Educational Purpose:
 * These integration tests demonstrate how to perform comprehensive end-to-end testing
 * of HTTP servers using Node.js built-in test runner and assertion library. The tests
 * validate protocol compliance, correct routing behavior, and proper error handling
 * without external testing dependencies.
 * 
 * Test Coverage:
 * - GET /hello endpoint returns correct response with proper headers
 * - Undefined routes return 404 Not Found with appropriate error message
 * - Unsupported HTTP methods return 405 Method Not Allowed with Allow header
 * - Server startup and shutdown lifecycle management
 * - HTTP protocol compliance validation
 * 
 * Requirements Addressed:
 * - F-002-RQ-001: Server must handle GET requests to '/hello' endpoint
 * - F-003-RQ-001: Server must return "Hello world" message for '/hello' endpoint
 * - F-003-RQ-002: Server must set appropriate HTTP headers for text response
 * - F-004-RQ-001: Server must return 404 status for undefined routes
 * - F-002-RQ-002: Server must handle unsupported HTTP methods with 405 response
 */

// Global server instance to hold the running test server for the duration of the test suite
// This enables proper server lifecycle management and resource cleanup
let server = null;

/**
 * Test suite setup - starts the test server before running integration tests
 * 
 * This setup function initializes a real HTTP server instance using the main router
 * function, ensuring that all integration tests run against the actual server code.
 * The server is started on the designated test port and host to avoid conflicts
 * with development or production servers.
 * 
 * Educational Purpose:
 * Demonstrates proper test environment setup, server lifecycle management, and
 * the importance of isolating test environments from other server instances.
 */
test('Setup - Start test server', async () => {
    try {
        // Start the test server using startTestServer utility with the main router
        // This creates a real HTTP server instance bound to TEST_PORT and TEST_HOST
        server = await startTestServer(router);
        
        // Verify that the server instance was created successfully
        assert.ok(server, 'Test server should be created successfully');
        
        // Verify that the server is listening on the expected port
        const address = server.address();
        assert.strictEqual(address.port, TEST_PORT, 'Server should be listening on TEST_PORT');
        assert.strictEqual(address.address, TEST_HOST, 'Server should be bound to TEST_HOST');
        
        // Log successful test server startup for observability
        console.log(`Test server started successfully on ${TEST_HOST}:${TEST_PORT}`);
        
    } catch (error) {
        // If server startup fails, the test should fail with detailed error information
        assert.fail(`Failed to start test server: ${error.message}`);
    }
});

/**
 * Integration test for successful GET request to '/hello' endpoint
 * 
 * This test validates that the server correctly handles HTTP GET requests to the
 * '/hello' endpoint, returning a 200 OK response with the exact 'Hello world' message
 * and proper HTTP headers as specified in the technical requirements.
 * 
 * Test Steps:
 * 1. Send HTTP GET request to '/hello' endpoint
 * 2. Verify response status is 200 OK
 * 3. Verify Content-Type header is 'text/plain; charset=utf-8'
 * 4. Verify response body contains exactly 'Hello world'
 * 5. Verify Connection header is 'keep-alive'
 * 
 * Requirements Validated:
 * - F-002-RQ-001: Endpoint routing for '/hello' path
 * - F-003-RQ-001: 'Hello world' message response
 * - F-003-RQ-002: Proper HTTP headers and status code
 */
test('GET /hello returns Hello world', async () => {
    try {
        // Send HTTP GET request to the '/hello' endpoint
        const response = await httpRequest({
            method: 'GET',
            path: '/hello'
        });
        
        // Verify the response status is 200 OK
        assert.strictEqual(response.status, 200, 'Response status should be 200 OK');
        
        // Verify the Content-Type header is correctly set for plain text
        assert.strictEqual(
            response.headers['content-type'], 
            'text/plain; charset=utf-8',
            'Content-Type header should be text/plain with UTF-8 charset'
        );
        
        // Verify the response body contains exactly 'Hello world'
        assert.strictEqual(response.body, 'Hello world', 'Response body should be exactly "Hello world"');
        
        // Verify the Connection header is set to keep-alive
        assert.strictEqual(
            response.headers['connection'], 
            'keep-alive',
            'Connection header should be keep-alive'
        );
        
        // Log successful test completion for observability
        console.log('✓ GET /hello endpoint test passed - correct response received');
        
    } catch (error) {
        // If the test fails, provide detailed error information
        assert.fail(`GET /hello test failed: ${error.message}`);
    }
});

/**
 * Integration test for undefined route handling (404 Not Found)
 * 
 * This test validates that the server correctly handles requests to undefined routes
 * by returning a 404 Not Found response with the appropriate error message and headers
 * as specified in the error handling requirements.
 * 
 * Test Steps:
 * 1. Send HTTP GET request to undefined route '/unknown'
 * 2. Verify response status is 404 Not Found
 * 3. Verify Content-Type header is 'text/plain; charset=utf-8'
 * 4. Verify response body contains 'Not Found' error message
 * 5. Verify Connection header is 'keep-alive'
 * 
 * Requirements Validated:
 * - F-004-RQ-001: 404 status for undefined routes
 * - Error handling protocol compliance
 * - Proper error message formatting
 */
test('GET /unknown returns 404', async () => {
    try {
        // Send HTTP GET request to an undefined route
        const response = await httpRequest({
            method: 'GET',
            path: '/unknown'
        });
        
        // Verify the response status is 404 Not Found
        assert.strictEqual(response.status, 404, 'Response status should be 404 Not Found');
        
        // Verify the Content-Type header is correctly set for plain text error response
        assert.strictEqual(
            response.headers['content-type'], 
            'text/plain; charset=utf-8',
            'Content-Type header should be text/plain with UTF-8 charset'
        );
        
        // Verify the response body contains the standard 'Not Found' error message
        assert.strictEqual(response.body, 'Not Found', 'Response body should be "Not Found"');
        
        // Verify the Connection header is set to keep-alive
        assert.strictEqual(
            response.headers['connection'], 
            'keep-alive',
            'Connection header should be keep-alive'
        );
        
        // Log successful test completion for observability
        console.log('✓ GET /unknown endpoint test passed - correct 404 response received');
        
    } catch (error) {
        // If the test fails, provide detailed error information
        assert.fail(`GET /unknown test failed: ${error.message}`);
    }
});

/**
 * Integration test for unsupported HTTP method handling (405 Method Not Allowed)
 * 
 * This test validates that the server correctly handles unsupported HTTP methods
 * on defined routes by returning a 405 Method Not Allowed response with the required
 * Allow header and appropriate error message as specified in the technical requirements.
 * 
 * Test Steps:
 * 1. Send HTTP POST request to '/hello' endpoint (unsupported method)
 * 2. Verify response status is 405 Method Not Allowed
 * 3. Verify Allow header contains 'GET' (the supported method)
 * 4. Verify Content-Type header is 'text/plain; charset=utf-8'
 * 5. Verify response body contains 'Method Not Allowed' error message
 * 6. Verify Connection header is 'keep-alive'
 * 
 * Requirements Validated:
 * - F-002-RQ-002: Method validation and 405 response
 * - HTTP protocol compliance for Allow header
 * - Proper error message formatting for method errors
 */
test('POST /hello returns 405', async () => {
    try {
        // Send HTTP POST request to '/hello' endpoint (unsupported method)
        const response = await httpRequest({
            method: 'POST',
            path: '/hello'
        });
        
        // Verify the response status is 405 Method Not Allowed
        assert.strictEqual(response.status, 405, 'Response status should be 405 Method Not Allowed');
        
        // Verify the Allow header is present and includes 'GET' as the supported method
        assert.ok(response.headers['allow'], 'Allow header should be present in 405 response');
        assert.ok(
            response.headers['allow'].includes('GET'),
            'Allow header should include GET as supported method'
        );
        
        // Verify the Content-Type header is correctly set for plain text error response
        assert.strictEqual(
            response.headers['content-type'], 
            'text/plain; charset=utf-8',
            'Content-Type header should be text/plain with UTF-8 charset'
        );
        
        // Verify the response body contains the standard 'Method Not Allowed' error message
        assert.strictEqual(
            response.body, 
            'Method Not Allowed', 
            'Response body should be "Method Not Allowed"'
        );
        
        // Verify the Connection header is set to keep-alive
        assert.strictEqual(
            response.headers['connection'], 
            'keep-alive',
            'Connection header should be keep-alive'
        );
        
        // Log successful test completion for observability
        console.log('✓ POST /hello endpoint test passed - correct 405 response received');
        
    } catch (error) {
        // If the test fails, provide detailed error information
        assert.fail(`POST /hello test failed: ${error.message}`);
    }
});

/**
 * Test suite cleanup - stops the test server after all integration tests complete
 * 
 * This cleanup function ensures that the test server is properly shut down and
 * all resources are released after the test suite completes. This prevents
 * resource leaks and ensures that the test environment is properly cleaned up.
 * 
 * Educational Purpose:
 * Demonstrates proper test environment cleanup, resource management, and the
 * importance of graceful shutdown in test scenarios to prevent port conflicts
 * and resource leaks that could affect other tests or processes.
 */
test('Cleanup - Stop test server', async () => {
    try {
        // Verify that the server instance exists before attempting to close it
        assert.ok(server, 'Test server should exist for cleanup');
        
        // Close the test server and wait for the close event
        await new Promise((resolve, reject) => {
            server.close((error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
        
        // Log successful test server cleanup for observability
        console.log('Test server stopped successfully - cleanup completed');
        
    } catch (error) {
        // If server cleanup fails, log the error but don't fail the test
        // This ensures that test results are not affected by cleanup issues
        console.warn(`Warning: Failed to stop test server cleanly: ${error.message}`);
    }
});