// Node.js built-in test runner for defining and running unit test cases
import { test, describe } from 'node:test'; // Node.js 22.x (built-in)

// Node.js built-in assertion library for verifying test expectations
import { assert } from 'node:assert'; // Node.js 22.x (built-in)

// Import the main router function under test
// This function is responsible for dispatching requests to handlers based on path and method
import { router } from '../../../backend/routes/router.mjs';

// Import test utility functions for creating mock HTTP request and response objects
// These utilities enable isolated unit testing without starting a real server
import { mockRequest, mockResponse } from '../../utils/index.mjs';

/**
 * Unit Test Suite for Router Function
 * 
 * This test suite verifies that the router correctly dispatches requests to the appropriate
 * handlers based on URL path and HTTP method, returns 404 for undefined routes, 405 for
 * unsupported methods, and logs routing decisions for observability.
 * 
 * Educational Purpose: Demonstrates comprehensive unit testing patterns for HTTP routing
 * logic, including successful routing, error handling, protocol compliance, and logging
 * verification. The tests ensure the router maintains educational clarity while providing
 * production-ready functionality.
 * 
 * Test Coverage:
 * - Successful GET /hello routing and response generation
 * - 404 handling for undefined routes
 * - 405 handling for unsupported methods with Allow header
 * - Path normalization (trailing slash handling)
 * - Logging verification for routing decisions
 * - Error handling and protocol compliance
 */
describe('router', () => {
    
    /**
     * Test: Should dispatch GET /hello to handleHello and return 200 with 'Hello world'
     * 
     * This test verifies that the router correctly routes GET requests to the '/hello' endpoint
     * and generates the expected response with proper status code, headers, and body content.
     * 
     * Educational Purpose: Demonstrates successful routing logic testing, including verification
     * of HTTP protocol compliance with status codes, headers, and response body content.
     */
    test('should dispatch GET /hello to handleHello and return 200 with "Hello world"', async () => {
        // Arrange: Create mock request and response objects
        const req = mockRequest({
            method: 'GET',
            url: '/hello',
            headers: {
                'host': 'localhost:3000',
                'user-agent': 'Test Agent/1.0',
                'accept': 'text/plain'
            }
        });
        
        const res = mockResponse();
        
        // Act: Invoke the router function with the mock request and response
        router(req, res);
        
        // Assert: Verify that the response has the expected status code
        assert.strictEqual(res.statusCode, 200, 'Response status code should be 200 OK');
        
        // Assert: Verify that the response body contains 'Hello world'
        const responseBody = res.getBody();
        assert.strictEqual(responseBody, 'Hello world', 'Response body should contain "Hello world"');
        
        // Assert: Verify that the Content-Type header is set to 'text/plain; charset=utf-8'
        const contentType = res.getHeader('Content-Type');
        assert.strictEqual(contentType, 'text/plain; charset=utf-8', 
            'Content-Type header should be "text/plain; charset=utf-8"');
        
        // Assert: Verify that the Connection header is set to 'keep-alive'
        const connection = res.getHeader('Connection');
        assert.strictEqual(connection, 'keep-alive', 
            'Connection header should be "keep-alive"');
        
        // Assert: Verify that the response has been ended
        assert.strictEqual(res.isEnded(), true, 'Response should be ended');
        
        // Assert: Verify that headers have been sent
        assert.strictEqual(res.headersSent, true, 'Headers should be sent');
    });
    
    /**
     * Test: Should return 404 Not Found for undefined route
     * 
     * This test verifies that the router correctly handles requests to undefined routes
     * by returning a 404 status code with appropriate error message and headers.
     * 
     * Educational Purpose: Demonstrates error handling testing for undefined routes,
     * including verification of proper HTTP error response format and protocol compliance.
     */
    test('should return 404 Not Found for undefined route', async () => {
        // Arrange: Create mock request for undefined route
        const req = mockRequest({
            method: 'GET',
            url: '/unknown',
            headers: {
                'host': 'localhost:3000',
                'user-agent': 'Test Agent/1.0'
            }
        });
        
        const res = mockResponse();
        
        // Act: Invoke the router function with the mock request and response
        router(req, res);
        
        // Assert: Verify that the response has 404 status code
        assert.strictEqual(res.statusCode, 404, 'Response status code should be 404 Not Found');
        
        // Assert: Verify that the response body contains 'Not Found'
        const responseBody = res.getBody();
        assert.strictEqual(responseBody, 'Not Found', 'Response body should contain "Not Found"');
        
        // Assert: Verify that the Content-Type header is set correctly
        const contentType = res.getHeader('Content-Type');
        assert.strictEqual(contentType, 'text/plain; charset=utf-8', 
            'Content-Type header should be "text/plain; charset=utf-8"');
        
        // Assert: Verify that the response has been ended
        assert.strictEqual(res.isEnded(), true, 'Response should be ended');
        
        // Assert: Verify that headers have been sent
        assert.strictEqual(res.headersSent, true, 'Headers should be sent');
    });
    
    /**
     * Test: Should return 405 Method Not Allowed for unsupported method
     * 
     * This test verifies that the router correctly handles unsupported HTTP methods
     * on defined routes by returning 405 status code and setting the Allow header.
     * 
     * Educational Purpose: Demonstrates HTTP method validation testing, including
     * verification of proper Allow header setting and protocol compliance for 405 responses.
     */
    test('should return 405 Method Not Allowed for unsupported method', async () => {
        // Arrange: Create mock request with unsupported method (POST) on defined route
        const req = mockRequest({
            method: 'POST',
            url: '/hello',
            headers: {
                'host': 'localhost:3000',
                'user-agent': 'Test Agent/1.0',
                'content-type': 'application/json'
            }
        });
        
        const res = mockResponse();
        
        // Act: Invoke the router function with the mock request and response
        router(req, res);
        
        // Assert: Verify that the response has 405 status code
        assert.strictEqual(res.statusCode, 405, 'Response status code should be 405 Method Not Allowed');
        
        // Assert: Verify that the Allow header is set to 'GET'
        const allowHeader = res.getHeader('Allow');
        assert.strictEqual(allowHeader, 'GET', 'Allow header should be "GET"');
        
        // Assert: Verify that the response body contains 'Method Not Allowed'
        const responseBody = res.getBody();
        assert.strictEqual(responseBody, 'Method Not Allowed', 
            'Response body should contain "Method Not Allowed"');
        
        // Assert: Verify that the Content-Type header is set correctly
        const contentType = res.getHeader('Content-Type');
        assert.strictEqual(contentType, 'text/plain; charset=utf-8', 
            'Content-Type header should be "text/plain; charset=utf-8"');
        
        // Assert: Verify that the response has been ended
        assert.strictEqual(res.isEnded(), true, 'Response should be ended');
        
        // Assert: Verify that headers have been sent
        assert.strictEqual(res.headersSent, true, 'Headers should be sent');
    });
    
    /**
     * Test: Should normalize path and handle trailing slashes
     * 
     * This test verifies that the router correctly normalizes URL paths by removing
     * trailing slashes and still routes to the correct handler.
     * 
     * Educational Purpose: Demonstrates URL normalization testing, ensuring that
     * variations in URL format (with/without trailing slashes) are handled consistently.
     */
    test('should normalize path and handle trailing slashes', async () => {
        // Arrange: Create mock request with trailing slash
        const req = mockRequest({
            method: 'GET',
            url: '/hello/',
            headers: {
                'host': 'localhost:3000',
                'user-agent': 'Test Agent/1.0'
            }
        });
        
        const res = mockResponse();
        
        // Act: Invoke the router function with the mock request and response
        router(req, res);
        
        // Assert: Verify that the response has 200 status code (route was found after normalization)
        assert.strictEqual(res.statusCode, 200, 'Response status code should be 200 OK');
        
        // Assert: Verify that the response body contains 'Hello world'
        const responseBody = res.getBody();
        assert.strictEqual(responseBody, 'Hello world', 'Response body should contain "Hello world"');
        
        // Assert: Verify that the Content-Type header is set correctly
        const contentType = res.getHeader('Content-Type');
        assert.strictEqual(contentType, 'text/plain; charset=utf-8', 
            'Content-Type header should be "text/plain; charset=utf-8"');
        
        // Assert: Verify that the response has been ended
        assert.strictEqual(res.isEnded(), true, 'Response should be ended');
    });
    
    /**
     * Test: Should log routing decisions for observability
     * 
     * This test verifies that the router logs routing decisions and request processing
     * events for observability and debugging purposes.
     * 
     * Educational Purpose: Demonstrates logging verification in unit tests, including
     * capturing console output and verifying that appropriate log messages are generated.
     */
    test('should log routing decisions for observability', async () => {
        // Arrange: Capture console output for log verification
        const originalConsoleLog = console.log;
        const capturedLogs = [];
        
        // Mock console.log to capture log messages
        console.log = (message) => {
            capturedLogs.push(message);
        };
        
        try {
            // Create mock request and response
            const req = mockRequest({
                method: 'GET',
                url: '/hello',
                headers: {
                    'host': 'localhost:3000',
                    'user-agent': 'Test Agent/1.0'
                }
            });
            
            const res = mockResponse();
            
            // Act: Invoke the router function
            router(req, res);
            
            // Assert: Verify that routing decision was logged
            const routingLogs = capturedLogs.filter(log => 
                log.includes('Processing request') && 
                log.includes('Method: GET') && 
                log.includes('Path: /hello')
            );
            
            assert.strictEqual(routingLogs.length >= 1, true, 
                'Should log routing decision for request processing');
            
            // Assert: Verify that route found event was logged
            const routeFoundLogs = capturedLogs.filter(log => 
                log.includes('Route found for path: /hello')
            );
            
            assert.strictEqual(routeFoundLogs.length >= 1, true, 
                'Should log route found event');
            
            // Assert: Verify that handler dispatch was logged
            const handlerDispatchLogs = capturedLogs.filter(log => 
                log.includes('Method GET is supported') && 
                log.includes('dispatching to handler')
            );
            
            assert.strictEqual(handlerDispatchLogs.length >= 1, true, 
                'Should log handler dispatch event');
            
        } finally {
            // Restore original console.log
            console.log = originalConsoleLog;
        }
    });
    
    /**
     * Test: Should handle multiple request variations correctly
     * 
     * This test verifies that the router handles various request scenarios correctly,
     * including different HTTP methods, URL variations, and header configurations.
     * 
     * Educational Purpose: Demonstrates comprehensive testing patterns that cover
     * edge cases and ensure robust router behavior across different request types.
     */
    test('should handle multiple request variations correctly', async () => {
        // Test Case 1: GET /hello with minimal headers
        const req1 = mockRequest({
            method: 'GET',
            url: '/hello',
            headers: {
                'host': 'localhost'
            }
        });
        const res1 = mockResponse();
        
        router(req1, res1);
        
        assert.strictEqual(res1.statusCode, 200, 'Should handle minimal headers correctly');
        assert.strictEqual(res1.getBody(), 'Hello world', 'Should return correct body');
        
        // Test Case 2: Undefined route with query parameters
        const req2 = mockRequest({
            method: 'GET',
            url: '/nonexistent?param=value',
            headers: {
                'host': 'localhost:3000'
            }
        });
        const res2 = mockResponse();
        
        router(req2, res2);
        
        assert.strictEqual(res2.statusCode, 404, 'Should return 404 for undefined route with query params');
        assert.strictEqual(res2.getBody(), 'Not Found', 'Should return Not Found message');
        
        // Test Case 3: Unsupported method (PUT) on defined route
        const req3 = mockRequest({
            method: 'PUT',
            url: '/hello',
            headers: {
                'host': 'localhost:3000',
                'content-type': 'application/json'
            }
        });
        const res3 = mockResponse();
        
        router(req3, res3);
        
        assert.strictEqual(res3.statusCode, 405, 'Should return 405 for unsupported method');
        assert.strictEqual(res3.getHeader('Allow'), 'GET', 'Should set Allow header correctly');
        assert.strictEqual(res3.getBody(), 'Method Not Allowed', 'Should return Method Not Allowed message');
    });
    
    /**
     * Test: Should not leak internal errors or stack traces in responses
     * 
     * This test verifies that the router handles unexpected errors gracefully without
     * exposing internal error details or stack traces in the response body.
     * 
     * Educational Purpose: Demonstrates secure error handling testing, ensuring that
     * error responses maintain security best practices by not exposing sensitive information.
     */
    test('should not leak internal errors or stack traces in responses', async () => {
        // Arrange: Create a mock request that might trigger an error scenario
        const req = mockRequest({
            method: 'GET',
            url: '/hello',
            headers: {
                // Missing host header to potentially trigger error handling
            }
        });
        
        const res = mockResponse();
        
        // Act: Invoke the router function
        router(req, res);
        
        // Assert: Verify that the response does not contain stack traces
        const responseBody = res.getBody();
        assert.strictEqual(responseBody.includes('Error:'), false, 
            'Response should not contain error details');
        assert.strictEqual(responseBody.includes('at '), false, 
            'Response should not contain stack trace information');
        assert.strictEqual(responseBody.includes('node:'), false, 
            'Response should not contain Node.js internal paths');
        
        // Assert: Verify that the response is either successful or a standard error
        const isValidResponse = res.statusCode === 200 || 
                               res.statusCode === 404 || 
                               res.statusCode === 405 || 
                               res.statusCode === 500;
        assert.strictEqual(isValidResponse, true, 
            'Response should have valid HTTP status code');
        
        // Assert: Verify that any error response uses generic messages
        if (res.statusCode >= 400) {
            const hasGenericMessage = responseBody === 'Not Found' || 
                                     responseBody === 'Method Not Allowed' || 
                                     responseBody === 'Internal Server Error';
            assert.strictEqual(hasGenericMessage, true, 
                'Error responses should use generic messages');
        }
    });
    
    /**
     * Test: Should handle URL parsing edge cases
     * 
     * This test verifies that the router correctly handles various URL parsing scenarios
     * including URLs with query parameters, fragments, and special characters.
     * 
     * Educational Purpose: Demonstrates URL parsing robustness testing, ensuring that
     * the router can handle real-world URL variations without errors.
     */
    test('should handle URL parsing edge cases', async () => {
        // Test Case 1: URL with query parameters
        const req1 = mockRequest({
            method: 'GET',
            url: '/hello?param=value&other=test',
            headers: {
                'host': 'localhost:3000'
            }
        });
        const res1 = mockResponse();
        
        router(req1, res1);
        
        assert.strictEqual(res1.statusCode, 200, 'Should handle query parameters correctly');
        assert.strictEqual(res1.getBody(), 'Hello world', 'Should ignore query parameters in routing');
        
        // Test Case 2: URL with encoded characters
        const req2 = mockRequest({
            method: 'GET',
            url: '/hello%20world',
            headers: {
                'host': 'localhost:3000'
            }
        });
        const res2 = mockResponse();
        
        router(req2, res2);
        
        assert.strictEqual(res2.statusCode, 404, 'Should return 404 for encoded path that does not match');
        
        // Test Case 3: Root path
        const req3 = mockRequest({
            method: 'GET',
            url: '/',
            headers: {
                'host': 'localhost:3000'
            }
        });
        const res3 = mockResponse();
        
        router(req3, res3);
        
        assert.strictEqual(res3.statusCode, 404, 'Should return 404 for root path');
        assert.strictEqual(res3.getBody(), 'Not Found', 'Should return Not Found for root path');
    });
    
    /**
     * Test: Should maintain protocol compliance for all responses
     * 
     * This test verifies that all responses generated by the router maintain
     * HTTP protocol compliance with proper status codes, headers, and message format.
     * 
     * Educational Purpose: Demonstrates protocol compliance testing, ensuring that
     * all router responses adhere to HTTP standards and best practices.
     */
    test('should maintain protocol compliance for all responses', async () => {
        // Define test scenarios covering different response types
        const testScenarios = [
            {
                name: 'Successful GET /hello',
                request: { method: 'GET', url: '/hello', headers: { 'host': 'localhost:3000' } },
                expectedStatus: 200,
                expectedBody: 'Hello world'
            },
            {
                name: 'Undefined route',
                request: { method: 'GET', url: '/nonexistent', headers: { 'host': 'localhost:3000' } },
                expectedStatus: 404,
                expectedBody: 'Not Found'
            },
            {
                name: 'Unsupported method',
                request: { method: 'DELETE', url: '/hello', headers: { 'host': 'localhost:3000' } },
                expectedStatus: 405,
                expectedBody: 'Method Not Allowed'
            }
        ];
        
        // Test each scenario
        for (const scenario of testScenarios) {
            const req = mockRequest(scenario.request);
            const res = mockResponse();
            
            router(req, res);
            
            // Assert: Verify status code compliance
            assert.strictEqual(res.statusCode, scenario.expectedStatus, 
                `${scenario.name}: Should have correct status code`);
            
            // Assert: Verify response body compliance
            assert.strictEqual(res.getBody(), scenario.expectedBody, 
                `${scenario.name}: Should have correct response body`);
            
            // Assert: Verify Content-Type header is set
            const contentType = res.getHeader('Content-Type');
            assert.strictEqual(contentType, 'text/plain; charset=utf-8', 
                `${scenario.name}: Should have correct Content-Type header`);
            
            // Assert: Verify response is properly ended
            assert.strictEqual(res.isEnded(), true, 
                `${scenario.name}: Response should be ended`);
            
            // Assert: Verify headers are sent
            assert.strictEqual(res.headersSent, true, 
                `${scenario.name}: Headers should be sent`);
            
            // Assert: Verify 405 responses have Allow header
            if (scenario.expectedStatus === 405) {
                const allowHeader = res.getHeader('Allow');
                assert.strictEqual(typeof allowHeader, 'string', 
                    `${scenario.name}: Should have Allow header for 405 responses`);
                assert.strictEqual(allowHeader.length > 0, true, 
                    `${scenario.name}: Allow header should not be empty`);
            }
        }
    });
});