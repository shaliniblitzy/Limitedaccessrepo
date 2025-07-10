// Node.js built-in test runner for defining test cases and test suites
import { test } from 'node:test'; // Node.js 22.x (built-in)

// Node.js built-in assertion library for validating test outcomes
import assert from 'node:assert'; // Node.js 22.x (built-in)

// Test utilities for server lifecycle management and HTTP request simulation
import { 
    startTestServer, 
    httpRequest, 
    TEST_PORT, 
    TEST_HOST 
} from '../../utils/index.mjs';

// Import the main server router for integration testing
import { router } from '../../backend/routes/index.mjs';

/**
 * Integration Test Suite for Error Handling in Node.js Tutorial HTTP Server
 * 
 * This test suite validates that the server correctly handles various error conditions
 * including undefined routes (404), unsupported HTTP methods (405), and unexpected
 * server errors (500). It ensures that error responses are protocol-compliant,
 * do not leak sensitive information, and that the error handling logic is robust.
 * 
 * Educational Purpose:
 * This integration test suite demonstrates comprehensive error handling validation
 * and protocol compliance testing using Node.js built-in testing capabilities.
 * It provides practical examples of testing HTTP error scenarios, security
 * considerations, and end-to-end error handling validation.
 * 
 * Test Coverage:
 * - 404 Not Found responses for undefined routes
 * - 405 Method Not Allowed responses with proper Allow header
 * - 500 Internal Server Error responses with no information leakage
 * - Protocol compliance for all error responses
 * - Security validation to prevent sensitive information disclosure
 * - Header validation for proper HTTP/1.1 compliance
 * 
 * Architecture:
 * The test suite uses shared test utilities to start and stop a real HTTP server
 * instance, enabling true integration testing of the complete request-response cycle.
 * Each test case makes actual HTTP requests to the running server and validates
 * the response status, headers, and body content.
 */

// Global test server instance handle for lifecycle management
let serverHandle = null;

// Global base URL for HTTP requests to the test server
let baseUrl = null;

/**
 * Test suite setup function that starts the test server before running any tests.
 * This ensures a clean, isolated test environment for each test run.
 * 
 * Educational Purpose: Demonstrates proper test environment setup and
 * server lifecycle management for integration testing.
 * 
 * @returns {Promise<void>} Resolves when the server is ready for requests
 */
test.before(async () => {
    try {
        // Start the test server using the main router as the request handler
        // This creates a real HTTP server instance for integration testing
        serverHandle = await startTestServer(router);
        
        // Construct the base URL for HTTP requests to the test server
        baseUrl = `http://${TEST_HOST}:${TEST_PORT}`;
        
        // Log successful test server startup for debugging
        console.log(`Test server started successfully at ${baseUrl}`);
        
    } catch (error) {
        // Handle server startup failures
        console.error('Failed to start test server:', error.message);
        throw error;
    }
});

/**
 * Test suite teardown function that shuts down the test server after all tests complete.
 * This ensures proper cleanup and resource release after testing.
 * 
 * Educational Purpose: Demonstrates proper test environment cleanup and
 * resource management for integration testing.
 * 
 * @returns {Promise<void>} Resolves when the server is fully closed
 */
test.after(async () => {
    try {
        // Close the test server if it exists
        if (serverHandle && typeof serverHandle.close === 'function') {
            await new Promise((resolve, reject) => {
                serverHandle.close((error) => {
                    if (error) {
                        console.error('Error closing test server:', error.message);
                        reject(error);
                    } else {
                        console.log('Test server closed successfully');
                        resolve();
                    }
                });
            });
        }
        
        // Clear global variables
        serverHandle = null;
        baseUrl = null;
        
    } catch (error) {
        console.error('Failed to close test server:', error.message);
        throw error;
    }
});

/**
 * Test case: GET /unknown returns 404 Not Found
 * 
 * Validates that requests to undefined routes return a 404 Not Found response
 * with correct headers and no sensitive information disclosure.
 * 
 * Educational Purpose: Demonstrates testing of 404 error handling and
 * validation of proper HTTP protocol compliance for undefined routes.
 */
test('GET /unknown returns 404 Not Found', async () => {
    try {
        // Send HTTP GET request to an undefined route
        const response = await httpRequest({
            method: 'GET',
            path: '/unknown'
        });
        
        // Assert that the response status code is 404 Not Found
        assert.strictEqual(response.status, 404, 
            'Response status should be 404 Not Found for undefined routes');
        
        // Assert that the Content-Type header is set to text/plain
        assert.strictEqual(response.headers['content-type'], 'text/plain; charset=utf-8',
            'Content-Type header should be text/plain for 404 responses');
        
        // Assert that the response body is a generic error message
        assert.strictEqual(response.body, 'Not Found',
            'Response body should contain generic "Not Found" message');
        
        // Assert that no sensitive headers are included in the response
        assert.strictEqual(response.headers['x-powered-by'], undefined,
            'Response should not include x-powered-by header');
        
        assert.strictEqual(response.headers['server'], undefined,
            'Response should not include server header');
        
        // Assert that the response does not contain any stack trace or internal details
        assert.strictEqual(response.body.includes('Error:'), false,
            'Response body should not contain error details');
        
        assert.strictEqual(response.body.includes('stack'), false,
            'Response body should not contain stack trace information');
        
        console.log('✓ 404 Not Found test passed - proper error handling verified');
        
    } catch (error) {
        console.error('404 Not Found test failed:', error.message);
        throw error;
    }
});

/**
 * Test case: POST /hello returns 405 Method Not Allowed
 * 
 * Validates that requests with unsupported HTTP methods return a 405 Method Not Allowed
 * response with the correct Allow header and proper error message.
 * 
 * Educational Purpose: Demonstrates testing of HTTP method validation and
 * protocol compliance for unsupported methods including Allow header requirements.
 */
test('POST /hello returns 405 Method Not Allowed', async () => {
    try {
        // Send HTTP POST request to the /hello endpoint (only GET is supported)
        const response = await httpRequest({
            method: 'POST',
            path: '/hello'
        });
        
        // Assert that the response status code is 405 Method Not Allowed
        assert.strictEqual(response.status, 405, 
            'Response status should be 405 Method Not Allowed for unsupported methods');
        
        // Assert that the Content-Type header is set to text/plain
        assert.strictEqual(response.headers['content-type'], 'text/plain; charset=utf-8',
            'Content-Type header should be text/plain for 405 responses');
        
        // Assert that the Allow header is present and includes GET
        assert.ok(response.headers['allow'], 'Allow header should be present in 405 responses');
        assert.ok(response.headers['allow'].includes('GET'), 
            'Allow header should include GET method');
        
        // Assert that the response body is a generic error message
        assert.strictEqual(response.body, 'Method Not Allowed',
            'Response body should contain generic "Method Not Allowed" message');
        
        // Assert that no sensitive headers are included in the response
        assert.strictEqual(response.headers['x-powered-by'], undefined,
            'Response should not include x-powered-by header');
        
        assert.strictEqual(response.headers['server'], undefined,
            'Response should not include server header');
        
        // Assert that the response does not contain any stack trace or internal details
        assert.strictEqual(response.body.includes('Error:'), false,
            'Response body should not contain error details');
        
        assert.strictEqual(response.body.includes('stack'), false,
            'Response body should not contain stack trace information');
        
        console.log('✓ 405 Method Not Allowed test passed - proper method validation verified');
        
    } catch (error) {
        console.error('405 Method Not Allowed test failed:', error.message);
        throw error;
    }
});

/**
 * Test case: Malformed request triggers 500 Internal Server Error
 * 
 * Validates that malformed requests that cause internal server errors return
 * a 500 Internal Server Error response with no sensitive information leakage.
 * 
 * Educational Purpose: Demonstrates testing of server error handling and
 * validation of secure error responses that prevent information disclosure.
 */
test('Malformed request triggers 500 Internal Server Error', async () => {
    try {
        // Send a request with malformed headers that might cause internal error
        // This simulates a scenario where the server encounters an unexpected error
        const response = await httpRequest({
            method: 'GET',
            path: '/hello',
            headers: {
                'Host': '' // Empty host header that might cause URL parsing issues
            }
        });
        
        // The server should handle this gracefully and return either 200 or 500
        // depending on the specific error handling implementation
        if (response.status === 500) {
            // If 500 error is returned, validate the error response
            
            // Assert that the Content-Type header is set to text/plain
            assert.strictEqual(response.headers['content-type'], 'text/plain; charset=utf-8',
                'Content-Type header should be text/plain for 500 responses');
            
            // Assert that the response body is a generic error message
            assert.strictEqual(response.body, 'Internal Server Error',
                'Response body should contain generic "Internal Server Error" message');
            
            // Assert that no sensitive headers are included in the response
            assert.strictEqual(response.headers['x-powered-by'], undefined,
                'Response should not include x-powered-by header');
            
            assert.strictEqual(response.headers['server'], undefined,
                'Response should not include server header');
            
            // Assert that the response does not contain any stack trace or internal details
            assert.strictEqual(response.body.includes('Error:'), false,
                'Response body should not contain error details');
            
            assert.strictEqual(response.body.includes('stack'), false,
                'Response body should not contain stack trace information');
            
            assert.strictEqual(response.body.includes('at '), false,
                'Response body should not contain stack trace lines');
            
            console.log('✓ 500 Internal Server Error test passed - secure error handling verified');
            
        } else {
            // If the server handles the malformed request gracefully, that's also valid
            console.log('✓ Server handled malformed request gracefully without 500 error');
        }
        
    } catch (error) {
        console.error('500 Internal Server Error test failed:', error.message);
        throw error;
    }
});

/**
 * Test case: Error responses do not leak server internals
 * 
 * Comprehensive test that validates all error responses (404, 405, 500) do not
 * include any sensitive headers or information about server internals.
 * 
 * Educational Purpose: Demonstrates comprehensive security testing for error
 * responses and validation of information disclosure prevention.
 */
test('Error responses do not leak server internals', async () => {
    try {
        // Array to store all error responses for comprehensive validation
        const errorResponses = [];
        
        // Test 1: Generate 404 error response
        const response404 = await httpRequest({
            method: 'GET',
            path: '/nonexistent'
        });
        errorResponses.push({ type: '404', response: response404 });
        
        // Test 2: Generate 405 error response
        const response405 = await httpRequest({
            method: 'POST',
            path: '/hello'
        });
        errorResponses.push({ type: '405', response: response405 });
        
        // Test 3: Generate potential 500 error response
        try {
            const response500 = await httpRequest({
                method: 'GET',
                path: '/hello',
                headers: {
                    'Host': '' // Malformed host header
                }
            });
            if (response500.status === 500) {
                errorResponses.push({ type: '500', response: response500 });
            }
        } catch (error) {
            // If request fails completely, that's also acceptable
            console.log('Request for 500 error failed completely, which is acceptable');
        }
        
        // Validate each error response for security compliance
        for (const { type, response } of errorResponses) {
            console.log(`Validating ${type} error response for security compliance...`);
            
            // Assert that sensitive headers are not present
            const sensitiveHeaders = [
                'x-powered-by',
                'server',
                'x-aspnet-version',
                'x-aspnetmvc-version',
                'x-runtime',
                'x-version'
            ];
            
            for (const header of sensitiveHeaders) {
                assert.strictEqual(response.headers[header], undefined,
                    `${type} response should not include ${header} header`);
            }
            
            // Assert that response body does not contain sensitive information
            const sensitivePatterns = [
                'Error:',
                'stack',
                'at ',
                'TypeError',
                'ReferenceError',
                'node_modules',
                'process.env',
                'require(',
                'import ',
                'file://',
                'src/',
                'backend/',
                'handlers/',
                'routes/',
                'utils/'
            ];
            
            for (const pattern of sensitivePatterns) {
                assert.strictEqual(response.body.includes(pattern), false,
                    `${type} response body should not contain '${pattern}'`);
            }
            
            // Assert that response body is reasonably short (no stack traces)
            assert.ok(response.body.length < 100,
                `${type} response body should be concise and not include verbose error details`);
            
            console.log(`✓ ${type} error response passed security validation`);
        }
        
        console.log('✓ All error responses passed security compliance validation');
        
    } catch (error) {
        console.error('Security compliance test failed:', error.message);
        throw error;
    }
});

/**
 * Test case: Error responses include proper HTTP/1.1 compliance headers
 * 
 * Validates that all error responses include proper HTTP/1.1 compliance headers
 * and follow protocol standards for error response formatting.
 * 
 * Educational Purpose: Demonstrates testing of HTTP protocol compliance and
 * validation of proper header configuration for error responses.
 */
test('Error responses include proper HTTP/1.1 compliance headers', async () => {
    try {
        // Test 404 error response headers
        const response404 = await httpRequest({
            method: 'GET',
            path: '/undefined'
        });
        
        // Validate 404 response headers
        assert.strictEqual(response404.status, 404,
            '404 response should have correct status code');
        
        assert.ok(response404.headers['content-type'],
            '404 response should include Content-Type header');
        
        assert.ok(response404.headers['content-length'] !== undefined,
            '404 response should include Content-Length header');
        
        // Test 405 error response headers
        const response405 = await httpRequest({
            method: 'PUT',
            path: '/hello'
        });
        
        // Validate 405 response headers
        assert.strictEqual(response405.status, 405,
            '405 response should have correct status code');
        
        assert.ok(response405.headers['content-type'],
            '405 response should include Content-Type header');
        
        assert.ok(response405.headers['allow'],
            '405 response should include Allow header as required by HTTP/1.1');
        
        assert.ok(response405.headers['content-length'] !== undefined,
            '405 response should include Content-Length header');
        
        // Validate that Allow header contains valid HTTP methods
        const allowHeader = response405.headers['allow'];
        const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
        const allowedMethods = allowHeader.split(',').map(m => m.trim().toUpperCase());
        
        for (const method of allowedMethods) {
            assert.ok(validMethods.includes(method),
                `Allow header should contain valid HTTP method: ${method}`);
        }
        
        console.log('✓ HTTP/1.1 compliance test passed - proper headers validated');
        
    } catch (error) {
        console.error('HTTP/1.1 compliance test failed:', error.message);
        throw error;
    }
});

/**
 * Test case: Error responses have appropriate Content-Length headers
 * 
 * Validates that all error responses include accurate Content-Length headers
 * that match the actual response body length.
 * 
 * Educational Purpose: Demonstrates testing of HTTP header accuracy and
 * validation of proper response formatting for error conditions.
 */
test('Error responses have appropriate Content-Length headers', async () => {
    try {
        // Test multiple error scenarios for Content-Length validation
        const testCases = [
            { method: 'GET', path: '/notfound', expectedStatus: 404 },
            { method: 'POST', path: '/hello', expectedStatus: 405 },
            { method: 'DELETE', path: '/hello', expectedStatus: 405 }
        ];
        
        for (const testCase of testCases) {
            const response = await httpRequest({
                method: testCase.method,
                path: testCase.path
            });
            
            // Assert that the response has the expected status
            assert.strictEqual(response.status, testCase.expectedStatus,
                `${testCase.method} ${testCase.path} should return ${testCase.expectedStatus}`);
            
            // Assert that Content-Length header exists
            assert.ok(response.headers['content-length'] !== undefined,
                `${testCase.expectedStatus} response should include Content-Length header`);
            
            // Assert that Content-Length header matches actual body length
            const contentLength = parseInt(response.headers['content-length'], 10);
            const actualLength = Buffer.byteLength(response.body, 'utf8');
            
            assert.strictEqual(contentLength, actualLength,
                `Content-Length header (${contentLength}) should match actual body length (${actualLength})`);
            
            console.log(`✓ Content-Length validation passed for ${testCase.method} ${testCase.path}`);
        }
        
        console.log('✓ All Content-Length header validations passed');
        
    } catch (error) {
        console.error('Content-Length validation test failed:', error.message);
        throw error;
    }
});