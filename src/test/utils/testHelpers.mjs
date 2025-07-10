// Node.js built-in HTTP module for creating test servers and making HTTP requests
import { createServer, request } from 'node:http'; // Node.js 22.x (built-in)

// Node.js built-in EventEmitter for creating mock request/response objects
import { EventEmitter } from 'node:events'; // Node.js 22.x (built-in)

// Node.js built-in performance hooks for measuring execution time
import { performance } from 'node:perf_hooks'; // Node.js 22.x (built-in)

// Import server configuration function for test server setup
import { getConfig } from '../../backend/config.mjs';

// Import the main server instance for integration testing
import { server } from '../../backend/server.mjs';

// Import logging functions for test event tracking and observability
import { logInfo, logWarn, logError } from '../../backend/utils/logger.mjs';

/**
 * Test server configuration constants
 * These constants define the default host and port for test server instances,
 * ensuring consistent test environments and preventing conflicts with main server
 */
export const TEST_PORT = 3100;
export const TEST_HOST = '127.0.0.1';

/**
 * Creates a mock HTTP request object for unit tests, simulating the minimal interface
 * of Node.js IncomingMessage. The mock object extends EventEmitter to support event-driven
 * testing patterns and provides configurable properties for comprehensive test scenarios.
 * 
 * Educational Purpose: Demonstrates how to create test doubles for HTTP objects without
 * external mocking libraries, using Node.js built-in capabilities for test isolation.
 * 
 * @param {Object} options - Configuration object for the mock request
 * @param {string} [options.method='GET'] - HTTP method for the request
 * @param {string} [options.url='/'] - URL path for the request
 * @param {Object} [options.headers={}] - HTTP headers for the request
 * @param {string} [options.body=''] - Request body content
 * @returns {Object} A mock request object with event emitter capabilities and HTTP request properties
 */
export function mockRequest(options = {}) {
    // Create an EventEmitter instance to simulate Node.js IncomingMessage behavior
    const mockReq = new EventEmitter();
    
    // Set default values for HTTP request properties
    mockReq.method = options.method || 'GET';
    mockReq.url = options.url || '/';
    mockReq.headers = options.headers || {};
    
    // Set up body handling for requests that include body content
    const body = options.body || '';
    let bodyIndex = 0;
    
    // Implement minimal read interface for body content
    // This simulates the readable stream interface of IncomingMessage
    mockReq.read = function(size) {
        if (bodyIndex >= body.length) {
            return null; // End of stream
        }
        
        const chunk = body.slice(bodyIndex, bodyIndex + (size || body.length));
        bodyIndex += chunk.length;
        return chunk;
    };
    
    // Set up HTTP version and other common properties
    mockReq.httpVersion = '1.1';
    mockReq.httpVersionMajor = 1;
    mockReq.httpVersionMinor = 1;
    
    // Set up connection and socket properties (minimal implementation)
    mockReq.connection = {
        remoteAddress: '127.0.0.1',
        remotePort: 12345
    };
    mockReq.socket = mockReq.connection;
    
    // Set up complete flag for request completion
    mockReq.complete = body.length === 0;
    
    // Add method to simulate request body events
    mockReq.simulateData = function(data) {
        mockReq.emit('data', Buffer.from(data));
    };
    
    mockReq.simulateEnd = function() {
        mockReq.emit('end');
    };
    
    // Log mock request creation for test traceability
    logInfo('Mock HTTP request created - Method: %s, URL: %s', mockReq.method, mockReq.url);
    
    return mockReq;
}

/**
 * Creates a mock HTTP response object for unit tests, simulating the minimal interface
 * of Node.js ServerResponse. The mock captures all response data for test assertions
 * and provides event emitter capabilities for comprehensive testing scenarios.
 * 
 * Educational Purpose: Demonstrates how to create test doubles for HTTP response objects
 * that capture all response data for verification without external mocking libraries.
 * 
 * @param {Object} options - Configuration object for the mock response
 * @param {number} [options.statusCode=200] - Initial HTTP status code
 * @param {Object} [options.headers={}] - Initial HTTP headers
 * @returns {Object} A mock response object with captured output and HTTP response methods
 */
export function mockResponse(options = {}) {
    // Create an EventEmitter instance to simulate Node.js ServerResponse behavior
    const mockRes = new EventEmitter();
    
    // Initialize response properties
    mockRes.statusCode = options.statusCode || 200;
    mockRes.statusMessage = '';
    mockRes.headersSent = false;
    
    // Internal state for capturing response data
    const capturedHeaders = { ...options.headers } || {};
    const capturedData = [];
    let isEnded = false;
    
    // Implement setHeader method to capture headers
    mockRes.setHeader = function(name, value) {
        if (mockRes.headersSent) {
            throw new Error('Cannot set headers after they are sent');
        }
        capturedHeaders[name] = value;
        logInfo('Mock response header set - %s: %s', name, value);
    };
    
    // Implement getHeader method to retrieve headers
    mockRes.getHeader = function(name) {
        return capturedHeaders[name];
    };
    
    // Implement getHeaders method to retrieve all headers
    mockRes.getHeaders = function() {
        return { ...capturedHeaders };
    };
    
    // Implement hasHeader method to check header existence
    mockRes.hasHeader = function(name) {
        return name in capturedHeaders;
    };
    
    // Implement removeHeader method to remove headers
    mockRes.removeHeader = function(name) {
        if (mockRes.headersSent) {
            throw new Error('Cannot remove headers after they are sent');
        }
        delete capturedHeaders[name];
    };
    
    // Implement write method to capture response data
    mockRes.write = function(chunk, encoding) {
        if (isEnded) {
            throw new Error('Cannot write after response has ended');
        }
        
        const data = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding);
        capturedData.push(data);
        logInfo('Mock response write - Data length: %d bytes', data.length);
        return true;
    };
    
    // Implement end method to finalize response
    mockRes.end = function(chunk, encoding) {
        if (isEnded) {
            throw new Error('Response has already ended');
        }
        
        // Write final chunk if provided
        if (chunk !== undefined) {
            mockRes.write(chunk, encoding);
        }
        
        // Mark headers as sent and response as ended
        mockRes.headersSent = true;
        isEnded = true;
        
        // Emit finish event to simulate response completion
        process.nextTick(() => {
            mockRes.emit('finish');
        });
        
        logInfo('Mock response ended - Total data: %d bytes', mockRes.getBody().length);
    };
    
    // Add method to get captured response body
    mockRes.getBody = function() {
        return Buffer.concat(capturedData).toString();
    };
    
    // Add method to get captured headers
    mockRes.getCapturedHeaders = function() {
        return { ...capturedHeaders };
    };
    
    // Add method to check if response is ended
    mockRes.isEnded = function() {
        return isEnded;
    };
    
    // Log mock response creation for test traceability
    logInfo('Mock HTTP response created - Status: %d', mockRes.statusCode);
    
    return mockRes;
}

/**
 * Starts a real HTTP server instance for integration or E2E tests, binding to TEST_PORT
 * and TEST_HOST. Returns a promise that resolves when the server is listening and ready
 * to accept connections, enabling reliable integration testing scenarios.
 * 
 * Educational Purpose: Demonstrates how to programmatically start HTTP servers for testing
 * purposes, including proper error handling and async server startup coordination.
 * 
 * @param {Function} handler - Request listener function to handle incoming HTTP requests
 * @returns {Promise<Object>} Promise that resolves to the server instance when listening
 */
export function startTestServer(handler) {
    return new Promise((resolve, reject) => {
        try {
            // Create HTTP server with the provided handler
            const testServer = createServer(handler);
            
            // Set up error handling for server startup
            testServer.on('error', (error) => {
                logError('Test server startup error: %s', error.message);
                
                // Provide specific error messages for common startup issues
                if (error.code === 'EADDRINUSE') {
                    logError('Test port %d is already in use', TEST_PORT);
                } else if (error.code === 'EACCES') {
                    logError('Access denied when binding to test port %d', TEST_PORT);
                }
                
                reject(error);
            });
            
            // Set up listening event to resolve promise when server is ready
            testServer.on('listening', () => {
                const address = testServer.address();
                logInfo('Test server started successfully on %s:%d', TEST_HOST, TEST_PORT);
                logInfo('Test server ready to accept connections');
                resolve(testServer);
            });
            
            // Start the server on test port and host
            logInfo('Starting test server on %s:%d...', TEST_HOST, TEST_PORT);
            testServer.listen(TEST_PORT, TEST_HOST);
            
        } catch (error) {
            logError('Failed to create test server: %s', error.message);
            reject(error);
        }
    });
}

/**
 * Performs an HTTP request to the test server and returns a promise with the complete
 * response data including status, headers, and body. This utility function simplifies
 * making HTTP requests in integration and E2E tests.
 * 
 * Educational Purpose: Demonstrates how to make HTTP requests programmatically for testing
 * purposes, including proper error handling and response data collection.
 * 
 * @param {Object} options - HTTP request options
 * @param {string} [options.method='GET'] - HTTP method
 * @param {string} [options.path='/'] - URL path
 * @param {Object} [options.headers={}] - HTTP headers
 * @param {string} [options.body=''] - Request body
 * @returns {Promise<Object>} Promise that resolves to { status, headers, body }
 */
export function httpRequest(options = {}) {
    return new Promise((resolve, reject) => {
        try {
            // Set up request options with defaults
            const requestOptions = {
                hostname: TEST_HOST,
                port: TEST_PORT,
                method: options.method || 'GET',
                path: options.path || '/',
                headers: options.headers || {}
            };
            
            // Log the outgoing request for test traceability
            logInfo('Making HTTP request - %s %s:%d%s', 
                requestOptions.method, requestOptions.hostname, 
                requestOptions.port, requestOptions.path);
            
            // Create the HTTP request
            const req = request(requestOptions, (res) => {
                // Collect response data
                const responseData = [];
                
                // Handle response data chunks
                res.on('data', (chunk) => {
                    responseData.push(chunk);
                });
                
                // Handle response completion
                res.on('end', () => {
                    const body = Buffer.concat(responseData).toString();
                    
                    // Create response object for test assertions
                    const response = {
                        status: res.statusCode,
                        headers: res.headers,
                        body: body
                    };
                    
                    logInfo('HTTP request completed - Status: %d, Body length: %d', 
                        response.status, response.body.length);
                    
                    resolve(response);
                });
                
                // Handle response errors
                res.on('error', (error) => {
                    logError('HTTP response error: %s', error.message);
                    reject(error);
                });
            });
            
            // Handle request errors
            req.on('error', (error) => {
                logError('HTTP request error: %s', error.message);
                reject(error);
            });
            
            // Send request body if provided
            if (options.body) {
                req.write(options.body);
            }
            
            // End the request
            req.end();
            
        } catch (error) {
            logError('Failed to create HTTP request: %s', error.message);
            reject(error);
        }
    });
}

/**
 * Temporarily overrides process.env or config values for the duration of a test function,
 * then restores the original values afterward. This utility enables testing different
 * server configurations without affecting other tests or the global environment.
 * 
 * Educational Purpose: Demonstrates how to safely override environment variables and
 * configuration values in tests while ensuring proper cleanup and test isolation.
 * 
 * @param {Object} overrides - Object containing environment variables or config values to override
 * @param {Function} testFn - Async function to execute with the overridden configuration
 * @returns {Promise<any>} Promise that resolves to the result of testFn after restoring config
 */
export function withTestConfig(overrides, testFn) {
    return new Promise(async (resolve, reject) => {
        // Store original process.env values for restoration
        const originalEnv = {};
        
        try {
            // Step 1: Save original environment variable values
            for (const [key, value] of Object.entries(overrides)) {
                originalEnv[key] = process.env[key];
                
                // Apply the override
                process.env[key] = value;
                
                logInfo('Config override applied - %s: %s (was: %s)', 
                    key, value, originalEnv[key] || 'undefined');
            }
            
            // Step 2: Execute the test function with overrides active
            logInfo('Executing test function with config overrides...');
            const result = await testFn();
            
            // Step 3: Restore original environment values
            for (const [key, originalValue] of Object.entries(originalEnv)) {
                if (originalValue === undefined) {
                    delete process.env[key];
                } else {
                    process.env[key] = originalValue;
                }
                
                logInfo('Config restored - %s: %s', key, originalValue || 'undefined');
            }
            
            logInfo('Test function completed successfully with config overrides');
            resolve(result);
            
        } catch (error) {
            // Ensure environment is restored even if test function fails
            logError('Test function failed with config overrides: %s', error.message);
            
            // Restore original environment values
            for (const [key, originalValue] of Object.entries(originalEnv)) {
                if (originalValue === undefined) {
                    delete process.env[key];
                } else {
                    process.env[key] = originalValue;
                }
            }
            
            logWarn('Environment variables restored after test failure');
            reject(error);
        }
    });
}

/**
 * Measures the execution time of an async function for performance tests, returning
 * both the result of the function and the elapsed time in milliseconds. This utility
 * helps identify performance bottlenecks and validate performance requirements.
 * 
 * Educational Purpose: Demonstrates how to use Node.js performance measurement APIs
 * for benchmarking and performance testing in educational and development contexts.
 * 
 * @param {Function} fn - Async function to measure execution time
 * @returns {Promise<Object>} Promise that resolves to { result, ms } where ms is elapsed time
 */
export function measureTime(fn) {
    return new Promise(async (resolve, reject) => {
        try {
            // Record start time using high-resolution performance timer
            const startTime = performance.now();
            
            logInfo('Starting performance measurement...');
            
            // Execute the function and await its completion
            const result = await fn();
            
            // Record end time and calculate elapsed milliseconds
            const endTime = performance.now();
            const elapsedMs = endTime - startTime;
            
            logInfo('Performance measurement completed - Elapsed time: %d ms', elapsedMs);
            
            // Return both the result and timing information
            resolve({
                result: result,
                ms: elapsedMs
            });
            
        } catch (error) {
            logError('Performance measurement failed: %s', error.message);
            reject(error);
        }
    });
}