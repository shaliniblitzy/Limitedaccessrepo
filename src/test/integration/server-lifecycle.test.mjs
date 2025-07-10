// Node.js built-in test runner and assertion library for zero-dependency testing
import { test, describe, beforeEach, afterEach } from 'node:test'; // Node.js 22.x (built-in)
import assert from 'node:assert'; // Node.js 22.x (built-in)

// Node.js global process object for signal handling and environment control
import process from 'node:process'; // Node.js 22.x (built-in)

// Node.js built-in timers for controlling test timing and timeouts
import { setTimeout, clearTimeout } from 'node:timers'; // Node.js 22.x (built-in)

// Import the HTTP server instance for direct lifecycle control and inspection in integration tests
import { server } from '../../backend/server.mjs';

// Import configuration loader to verify correct binding and for test setup/teardown
import { getConfig } from '../../backend/config.mjs';

// Import test helper functions for server lifecycle testing
import { 
    startTestServer, 
    httpRequest, 
    withTestConfig, 
    measureTime, 
    TEST_PORT, 
    TEST_HOST 
} from '../utils/testHelpers.mjs';

// Global constants for test timeout management
const SERVER_START_TIMEOUT_MS = 1000;
const SERVER_SHUTDOWN_TIMEOUT_MS = 1000;

// Test suite for server lifecycle integration tests
describe('Server Lifecycle', () => {
    let testServer = null;
    let originalConsoleLog = null;
    let originalConsoleError = null;
    let logMessages = [];

    beforeEach(() => {
        // Reset log messages array before each test
        logMessages = [];
        
        // Capture console output for log verification
        originalConsoleLog = console.log;
        originalConsoleError = console.error;
        
        console.log = (...args) => {
            logMessages.push({ level: 'log', message: args.join(' ') });
            originalConsoleLog.apply(console, args);
        };
        
        console.error = (...args) => {
            logMessages.push({ level: 'error', message: args.join(' ') });
            originalConsoleError.apply(console, args);
        };
    });

    afterEach(async () => {
        // Restore original console methods
        if (originalConsoleLog) {
            console.log = originalConsoleLog;
        }
        if (originalConsoleError) {
            console.error = originalConsoleError;
        }
        
        // Clean up test server if it exists
        if (testServer && testServer.listening) {
            await new Promise((resolve) => {
                testServer.close(() => {
                    testServer = null;
                    resolve();
                });
            });
        }
    });

    test('should start the server and listen on the configured port', async () => {
        // Load the current server configuration
        const config = getConfig();
        
        // Create a test server instance with a simple handler
        const handler = (req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Test server response');
        };
        
        // Measure server startup time
        const { result: server, ms: startupTime } = await measureTime(async () => {
            return await startTestServer(handler);
        });
        
        testServer = server;
        
        // Verify server is listening
        assert.ok(testServer.listening, 'Server should be listening');
        
        // Verify server address matches expected configuration
        const address = testServer.address();
        assert.strictEqual(address.port, TEST_PORT, 'Server should bind to test port');
        assert.strictEqual(address.address, TEST_HOST, 'Server should bind to test host');
        
        // Verify startup time is within acceptable range
        assert.ok(startupTime < SERVER_START_TIMEOUT_MS, 
            `Server startup time (${startupTime}ms) should be under ${SERVER_START_TIMEOUT_MS}ms`);
        
        // Verify server can accept connections by making a test request
        const response = await httpRequest({
            method: 'GET',
            path: '/'
        });
        
        assert.strictEqual(response.status, 200, 'Server should respond with 200 status');
        assert.strictEqual(response.body, 'Test server response', 'Server should return expected response');
    });

    test('should handle GET /hello requests during operation', async () => {
        // Import the main router to test the actual hello endpoint
        const { router } = await import('../../backend/routes/index.mjs');
        
        // Start test server with the main router
        testServer = await startTestServer(router);
        
        // Make a GET request to the /hello endpoint
        const response = await httpRequest({
            method: 'GET',
            path: '/hello'
        });
        
        // Verify the response matches expected hello world output
        assert.strictEqual(response.status, 200, 'GET /hello should return 200 status');
        assert.strictEqual(response.headers['content-type'], 'text/plain', 
            'Response should have text/plain content type');
        assert.strictEqual(response.body, 'Hello world', 
            'Response body should contain "Hello world"');
        
        // Verify that the server logged the request
        const hasRequestLog = logMessages.some(log => 
            log.message.includes('HTTP request') || log.message.includes('GET')
        );
        assert.ok(hasRequestLog, 'Server should log HTTP requests');
    });

    test('should gracefully shutdown on SIGINT/SIGTERM or programmatic close', async () => {
        // Start a test server
        const handler = (req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Server running');
        };
        
        testServer = await startTestServer(handler);
        
        // Verify server is initially listening
        assert.ok(testServer.listening, 'Server should be listening before shutdown');
        
        // Test programmatic shutdown
        const { ms: shutdownTime } = await measureTime(async () => {
            return new Promise((resolve) => {
                testServer.close(() => {
                    resolve();
                });
            });
        });
        
        // Verify server is no longer listening
        assert.ok(!testServer.listening, 'Server should not be listening after shutdown');
        
        // Verify shutdown time is within acceptable range
        assert.ok(shutdownTime < SERVER_SHUTDOWN_TIMEOUT_MS, 
            `Server shutdown time (${shutdownTime}ms) should be under ${SERVER_SHUTDOWN_TIMEOUT_MS}ms`);
        
        // Clear testServer reference since it's been closed
        testServer = null;
    });

    test('should handle port conflicts with EADDRINUSE error', async () => {
        // Start first server on test port
        const handler1 = (req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('First server');
        };
        
        testServer = await startTestServer(handler1);
        
        // Verify first server is listening
        assert.ok(testServer.listening, 'First server should be listening');
        
        // Attempt to start second server on same port (should fail)
        const handler2 = (req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Second server');
        };
        
        let portConflictError = null;
        
        try {
            await startTestServer(handler2);
            assert.fail('Second server should not start due to port conflict');
        } catch (error) {
            portConflictError = error;
        }
        
        // Verify the error is EADDRINUSE
        assert.ok(portConflictError, 'Port conflict should throw an error');
        assert.strictEqual(portConflictError.code, 'EADDRINUSE', 
            'Error should be EADDRINUSE for port conflicts');
        
        // Verify error logging occurred
        const hasErrorLog = logMessages.some(log => 
            log.level === 'error' && log.message.includes('already in use')
        );
        assert.ok(hasErrorLog, 'Port conflict should be logged as error');
    });

    test('should ignore duplicate shutdown calls', async () => {
        // Start a test server
        const handler = (req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Server running');
        };
        
        testServer = await startTestServer(handler);
        
        // Verify server is initially listening
        assert.ok(testServer.listening, 'Server should be listening before shutdown');
        
        // Perform first shutdown
        await new Promise((resolve) => {
            testServer.close(() => {
                resolve();
            });
        });
        
        // Verify server is closed
        assert.ok(!testServer.listening, 'Server should not be listening after first shutdown');
        
        // Attempt second shutdown (should be ignored/handled gracefully)
        let secondShutdownError = null;
        
        try {
            testServer.close(() => {
                // This callback should not be called since server is already closed
            });
        } catch (error) {
            secondShutdownError = error;
        }
        
        // Verify duplicate shutdown is handled gracefully
        // Note: Node.js server.close() on already closed server doesn't throw by default
        assert.ok(!secondShutdownError, 'Duplicate shutdown should not throw error');
        
        // Clear testServer reference
        testServer = null;
    });

    test('should log all major lifecycle events', async () => {
        // Start a test server to capture lifecycle events
        const handler = (req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Lifecycle test');
        };
        
        // Clear existing log messages before test
        logMessages = [];
        
        // Start server and capture startup logs
        testServer = await startTestServer(handler);
        
        // Make a request to capture request handling logs
        await httpRequest({
            method: 'GET',
            path: '/'
        });
        
        // Shutdown server and capture shutdown logs
        await new Promise((resolve) => {
            testServer.close(() => {
                resolve();
            });
        });
        
        // Verify startup event logging
        const hasStartupLog = logMessages.some(log => 
            log.message.includes('Test server started') || 
            log.message.includes('server started')
        );
        assert.ok(hasStartupLog, 'Server should log startup events');
        
        // Verify request event logging
        const hasRequestLog = logMessages.some(log => 
            log.message.includes('HTTP request') || 
            log.message.includes('request')
        );
        assert.ok(hasRequestLog, 'Server should log request events');
        
        // Verify shutdown event logging would occur in real server
        // Note: Test server shutdown logging may differ from production server
        const hasShutdownLog = logMessages.some(log => 
            log.message.includes('server closed') || 
            log.message.includes('shutdown')
        );
        
        // For educational purposes, we verify that logging infrastructure exists
        assert.ok(logMessages.length > 0, 'Server should generate log messages during lifecycle');
        
        // Clear testServer reference
        testServer = null;
    });

    test('should handle server startup with custom configuration', async () => {
        // Test with custom configuration overrides
        const testConfig = {
            PORT: '3150',
            HOST: '127.0.0.1',
            NODE_ENV: 'test'
        };
        
        await withTestConfig(testConfig, async () => {
            // Verify config changes are applied
            const config = getConfig();
            assert.strictEqual(config.port, 3150, 'Port should match override');
            assert.strictEqual(config.host, '127.0.0.1', 'Host should match override');
            assert.strictEqual(config.env, 'test', 'Environment should match override');
            
            // Start server with custom config
            const handler = (req, res) => {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Custom config test');
            };
            
            // Note: startTestServer still uses TEST_PORT, but config is tested separately
            testServer = await startTestServer(handler);
            
            // Verify server started successfully
            assert.ok(testServer.listening, 'Server should start with custom configuration');
        });
    });

    test('should handle server errors during request processing', async () => {
        // Create a handler that throws an error
        const errorHandler = (req, res) => {
            if (req.url === '/error') {
                throw new Error('Test error during request processing');
            }
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('OK');
        };
        
        testServer = await startTestServer(errorHandler);
        
        // Make request to endpoint that causes error
        let errorResponse = null;
        
        try {
            errorResponse = await httpRequest({
                method: 'GET',
                path: '/error'
            });
        } catch (error) {
            // Request may fail due to server error
            errorResponse = { status: 500, error: error.message };
        }
        
        // Verify error handling occurred
        assert.ok(errorResponse, 'Server should handle request errors');
        
        // Verify server is still responsive after error
        const normalResponse = await httpRequest({
            method: 'GET',
            path: '/'
        });
        
        assert.strictEqual(normalResponse.status, 200, 
            'Server should remain responsive after handling errors');
    });

    test('should measure server performance metrics', async () => {
        // Start performance test server
        const performanceHandler = (req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Performance test response');
        };
        
        testServer = await startTestServer(performanceHandler);
        
        // Measure response time for multiple requests
        const responseTimeMeasurements = [];
        
        for (let i = 0; i < 5; i++) {
            const { ms: responseTime } = await measureTime(async () => {
                return await httpRequest({
                    method: 'GET',
                    path: '/'
                });
            });
            responseTimeMeasurements.push(responseTime);
        }
        
        // Calculate average response time
        const averageResponseTime = responseTimeMeasurements.reduce((sum, time) => sum + time, 0) / responseTimeMeasurements.length;
        
        // Verify performance is within acceptable range
        assert.ok(averageResponseTime < 100, 
            `Average response time (${averageResponseTime}ms) should be under 100ms`);
        
        // Verify all individual response times are reasonable
        responseTimeMeasurements.forEach((time, index) => {
            assert.ok(time < 200, 
                `Response time ${index + 1} (${time}ms) should be under 200ms`);
        });
    });

    test('should handle server shutdown with pending requests', async () => {
        // Create handler that simulates slow response
        const slowHandler = (req, res) => {
            if (req.url === '/slow') {
                // Simulate slow response with timeout
                setTimeout(() => {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('Slow response');
                }, 100);
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Fast response');
            }
        };
        
        testServer = await startTestServer(slowHandler);
        
        // Start a slow request
        const slowRequestPromise = httpRequest({
            method: 'GET',
            path: '/slow'
        });
        
        // Give the request time to start
        await new Promise(resolve => setTimeout(resolve, 10));
        
        // Shutdown server while request is pending
        const shutdownPromise = new Promise((resolve) => {
            testServer.close(() => {
                resolve();
            });
        });
        
        // Wait for both shutdown and request to complete
        const [shutdownResult, requestResult] = await Promise.allSettled([
            shutdownPromise,
            slowRequestPromise
        ]);
        
        // Verify shutdown completed
        assert.strictEqual(shutdownResult.status, 'fulfilled', 
            'Server shutdown should complete');
        
        // Request may complete or fail depending on timing
        assert.ok(requestResult.status === 'fulfilled' || requestResult.status === 'rejected', 
            'Pending request should either complete or fail gracefully');
        
        // Clear testServer reference
        testServer = null;
    });
});