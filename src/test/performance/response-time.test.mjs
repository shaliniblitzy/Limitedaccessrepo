// Node.js built-in test runner for defining test cases and integration with test framework
import { test } from 'node:test'; // Node.js 22.x (built-in)

// Node.js built-in assertion library for test outcome validation and verification
import assert from 'node:assert'; // Node.js 22.x (built-in)

// Import test utilities for server lifecycle management, HTTP requests, and performance measurement
import { 
    startTestServer, 
    httpRequest, 
    measureTime, 
    TEST_PORT, 
    TEST_HOST 
} from '../../test/utils/index.mjs';

// Import the main router function for handling HTTP requests in the test server
import { router } from '../../backend/routes/index.mjs';

/**
 * Performance Test Suite for Node.js Tutorial HTTP Server - Response Time Validation
 * 
 * This test suite validates the response time performance of the '/hello' endpoint
 * in the Node.js tutorial HTTP server. It ensures that the server meets the required
 * response latency criteria (<100ms) for the '/hello' endpoint under normal conditions.
 * 
 * Educational Purpose:
 * This performance test demonstrates fundamental concepts of:
 * - Performance testing methodologies and practices
 * - HTTP request-response cycle timing measurement
 * - Test isolation using dedicated server instances
 * - Node.js built-in test runner capabilities
 * - Assertion-based validation of performance requirements
 * - Integration testing with real HTTP server instances
 * 
 * Test Design Principles:
 * - Reproducibility: Uses isolated test server instances for consistent results
 * - Clarity: Educational focus with comprehensive documentation
 * - Simplicity: Zero external dependencies, using only Node.js built-in capabilities
 * - Reliability: Proper setup/teardown and error handling
 * - Observability: Comprehensive logging for test analysis and debugging
 * 
 * Performance Criteria:
 * - Response time must be less than 100ms for the '/hello' endpoint
 * - Response status code must be 200 OK
 * - Response body must contain exactly 'Hello world'
 * - Response Content-Type header must be 'text/plain'
 * 
 * Test Architecture:
 * The test uses a dedicated HTTP server instance running on TEST_HOST:TEST_PORT
 * to ensure isolation from other tests and the main application server. This approach
 * provides reliable, repeatable test results and prevents port conflicts.
 */

// Global test constants for performance criteria and endpoint validation
// These constants define the performance requirements and expected response characteristics

/**
 * Maximum acceptable response time threshold in milliseconds
 * This value aligns with the technical specification requirement for response latency
 */
const RESPONSE_TIME_THRESHOLD_MS = 100;

/**
 * URL path for the hello endpoint being tested
 * This constant ensures consistent endpoint testing across the test suite
 */
const HELLO_PATH = '/hello';

/**
 * Expected response body content for the hello endpoint
 * This constant validates the correct response content generation
 */
const EXPECTED_BODY = 'Hello world';

/**
 * Measures the response time for a single HTTP GET request to the '/hello' endpoint
 * and returns the response data along with the elapsed time in milliseconds.
 * 
 * This function encapsulates the core performance measurement logic, combining
 * HTTP request execution with precise timing measurement to validate response
 * latency requirements.
 * 
 * Educational Purpose:
 * Demonstrates how to measure HTTP request performance using Node.js built-in
 * performance measurement utilities and HTTP request capabilities.
 * 
 * @param {Object} serverInfo - Server instance information (not used in current implementation)
 * @returns {Promise<Object>} Promise that resolves to { ms, response } where:
 *                           - ms is the elapsed time in milliseconds
 *                           - response contains { status, headers, body }
 */
async function measureHelloEndpointResponseTime(serverInfo) {
    // Step 1: Construct HTTP request options for GET /hello using TEST_HOST and TEST_PORT
    const requestOptions = {
        method: 'GET',
        path: HELLO_PATH,
        headers: {
            'Host': `${TEST_HOST}:${TEST_PORT}`,
            'User-Agent': 'Node.js-Performance-Test/1.0',
            'Accept': 'text/plain'
        }
    };
    
    // Step 2: Use measureTime to wrap an async function that performs httpRequest to '/hello'
    // This provides precise timing measurement using Node.js performance hooks
    const measurementResult = await measureTime(async () => {
        // Perform the HTTP request to the test server
        const response = await httpRequest(requestOptions);
        
        // Return the response object for further validation
        return response;
    });
    
    // Step 3: Return the elapsed time (ms) and the response object
    // This structure provides both timing and response data for comprehensive validation
    return {
        ms: measurementResult.ms,
        response: measurementResult.result
    };
}

/**
 * Performance Test Case: Response Time Validation for '/hello' Endpoint
 * 
 * This test case validates that the HTTP server responds to GET requests
 * to the '/hello' endpoint within the specified performance criteria while
 * returning the correct response content and headers.
 * 
 * Test Scenario:
 * 1. Start a dedicated test server instance with the main router
 * 2. Send a GET request to '/hello' and measure response time
 * 3. Validate response status, body, headers, and performance
 * 4. Clean up test server resources
 * 
 * Educational Value:
 * This test demonstrates integration testing, performance measurement,
 * and comprehensive validation of HTTP server behavior under test conditions.
 */
test('should respond to GET /hello in under 100ms with correct body and status', async () => {
    // Initialize test server variable for cleanup in finally block
    let testServer = null;
    
    try {
        // Step 1: Start a dedicated test server instance using startTestServer with the main router
        // This creates an isolated HTTP server for performance testing
        testServer = await startTestServer(router);
        
        // Step 2: Wait for the server to be listening on TEST_HOST:TEST_PORT
        // The startTestServer function already ensures the server is listening before resolving
        assert(testServer.listening, 'Test server should be listening after startup');
        
        // Verify server is bound to correct address
        const serverAddress = testServer.address();
        assert.strictEqual(serverAddress.address, TEST_HOST, 
            `Server should be bound to ${TEST_HOST}, got ${serverAddress.address}`);
        assert.strictEqual(serverAddress.port, TEST_PORT, 
            `Server should be bound to port ${TEST_PORT}, got ${serverAddress.port}`);
        
        // Step 3: Call measureHelloEndpointResponseTime to send GET request and measure elapsed time
        const { ms, response } = await measureHelloEndpointResponseTime(testServer);
        
        // Step 4: Assert that the response status is 200
        assert.strictEqual(response.status, 200, 
            `Expected status 200, got ${response.status}`);
        
        // Step 5: Assert that the response body is exactly 'Hello world'
        assert.strictEqual(response.body, EXPECTED_BODY, 
            `Expected body '${EXPECTED_BODY}', got '${response.body}'`);
        
        // Step 6: Assert that the Content-Type header is 'text/plain'
        assert.strictEqual(response.headers['content-type'], 'text/plain', 
            `Expected Content-Type 'text/plain', got '${response.headers['content-type']}'`);
        
        // Step 7: Assert that the measured response time (ms) is less than RESPONSE_TIME_THRESHOLD_MS
        assert(ms < RESPONSE_TIME_THRESHOLD_MS, 
            `Response time ${ms}ms exceeds threshold of ${RESPONSE_TIME_THRESHOLD_MS}ms`);
        
        // Additional validation: Verify response headers for HTTP compliance
        assert(response.headers['content-length'], 
            'Response should include Content-Length header');
        assert.strictEqual(response.headers['content-length'], EXPECTED_BODY.length.toString(), 
            `Content-Length should be ${EXPECTED_BODY.length}, got ${response.headers['content-length']}`);
        
        // Performance analysis logging for educational purposes
        console.log(`✓ Performance test passed - Response time: ${ms.toFixed(2)}ms (threshold: ${RESPONSE_TIME_THRESHOLD_MS}ms)`);
        console.log(`✓ Response validation passed - Status: ${response.status}, Body: '${response.body}'`);
        console.log(`✓ Header validation passed - Content-Type: ${response.headers['content-type']}`);
        
    } catch (error) {
        // Handle test execution errors with comprehensive error reporting
        console.error('Performance test failed with error:', error.message);
        console.error('Error details:', error.stack);
        
        // Re-throw error to ensure test failure is properly reported
        throw error;
        
    } finally {
        // Step 8: Close the test server and clean up resources
        if (testServer && testServer.listening) {
            await new Promise((resolve, reject) => {
                testServer.close((error) => {
                    if (error) {
                        console.error('Error closing test server:', error.message);
                        reject(error);
                    } else {
                        console.log('✓ Test server closed successfully');
                        resolve();
                    }
                });
            });
        }
    }
});

/**
 * Test Suite Documentation and Learning Notes
 * 
 * Performance Testing Best Practices Demonstrated:
 * 1. Isolated Test Environment: Uses dedicated server instance to prevent interference
 * 2. Precise Timing Measurement: Uses Node.js performance hooks for accurate measurements
 * 3. Comprehensive Validation: Tests performance, functionality, and HTTP compliance
 * 4. Resource Management: Proper setup and teardown of test resources
 * 5. Error Handling: Comprehensive error handling and reporting
 * 
 * Educational Extensions:
 * This test can be extended to demonstrate advanced performance testing concepts:
 * - Multiple iteration testing for average/median response times
 * - Load testing with concurrent requests
 * - Performance regression detection over time
 * - Memory usage monitoring during requests
 * - Network latency simulation and testing
 * 
 * Integration with CI/CD:
 * The test is designed to work with Node.js built-in test runner:
 * - Run with: node --test src/test/performance/response-time.test.mjs
 * - Generate coverage: node --test --experimental-test-coverage
 * - Watch mode: node --test --watch src/test/performance/response-time.test.mjs
 * 
 * Production Considerations:
 * While this test is educational, it demonstrates patterns applicable to production:
 * - Performance SLA validation
 * - Automated performance regression detection
 * - Service health monitoring
 * - API contract validation
 * - Response time alerting thresholds
 */