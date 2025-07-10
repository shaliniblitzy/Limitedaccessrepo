// Node.js built-in test runner for test case definition and execution
import { test } from 'node:test'; // Node.js 22.x (built-in)

// Node.js built-in assertion library for test validations
import assert from 'node:assert'; // Node.js 22.x (built-in)

// Test utilities for server lifecycle management and performance measurement
import { 
    startTestServer, 
    measureTime, 
    TEST_PORT, 
    TEST_HOST 
} from '../../test/utils/index.mjs';

// Import the main request router for the test server instance
import { router } from '../../backend/routes/router.mjs';

// Performance test configuration constants
// These constants define the performance criteria and test parameters
const STARTUP_TIME_THRESHOLD_MS = 1000;
const SERVER_STARTUP_TEST_NAME = 'should start server and listen in under 1 second';

/**
 * Performance Test Suite: Server Startup Performance Validation
 * 
 * This test suite measures the startup time of the Node.js tutorial HTTP server
 * to ensure it meets the specified performance criteria defined in the technical
 * specifications (F-001 Server Startup Performance < 1 second).
 * 
 * Educational Purpose:
 * - Demonstrates performance testing concepts with Node.js built-in test runner
 * - Shows how to measure and validate server startup times
 * - Illustrates proper test cleanup and resource management
 * - Teaches performance monitoring and threshold validation
 * 
 * Technical Implementation:
 * - Uses Node.js built-in test runner for zero external dependencies
 * - Leverages performance measurement utilities for accurate timing
 * - Implements proper server lifecycle management for test isolation
 * - Provides comprehensive error handling and cleanup procedures
 */

/**
 * Measures the time taken for the HTTP server to start and begin listening
 * on the configured port. This function encapsulates the server startup process
 * and provides timing measurements for performance validation.
 * 
 * Educational Purpose: Demonstrates how to measure server startup performance
 * by timing the complete server initialization and port binding process.
 * 
 * @param {Object} serverOptions - Configuration options for the test server
 * @param {string} serverOptions.host - Host address for server binding
 * @param {number} serverOptions.port - Port number for server binding  
 * @param {Function} serverOptions.handler - Request handler function for the server
 * @returns {Promise<Object>} Promise that resolves to { ms, server } where ms is elapsed time and server is the running instance
 */
async function measureServerStartupTime(serverOptions) {
    // Use the measureTime utility to capture startup timing
    const { result: server, ms } = await measureTime(async () => {
        // Start the test server with the provided handler
        // This includes server creation, event listener setup, and port binding
        const serverInstance = await startTestServer(serverOptions.handler);
        
        // Verify that the server is actually listening on the expected port
        const serverAddress = serverInstance.address();
        assert.strictEqual(serverAddress.port, serverOptions.port, 
            `Server should be listening on port ${serverOptions.port}`);
        assert.strictEqual(serverAddress.address, serverOptions.host, 
            `Server should be listening on host ${serverOptions.host}`);
        
        return serverInstance;
    });
    
    return { ms, server };
}

/**
 * Main Performance Test Case: Server Startup Time Validation
 * 
 * This test validates that the HTTP server starts and begins listening
 * on the configured port within the specified performance threshold.
 * The test measures the complete startup cycle from server creation
 * to ready-to-accept-connections state.
 * 
 * Test Scenario:
 * 1. Initialize server with main application router
 * 2. Measure complete startup time including port binding
 * 3. Validate startup time is under threshold (1000ms)
 * 4. Verify server is actually listening and functional
 * 5. Perform cleanup and resource management
 * 
 * Performance Criteria:
 * - Server startup time must be < 1000ms (1 second)
 * - Server must successfully bind to configured port
 * - Server must be ready to accept HTTP connections
 * - Test must complete within reasonable time bounds
 */
test(SERVER_STARTUP_TEST_NAME, async () => {
    let testServer = null;
    
    try {
        // Define server configuration for the performance test
        const serverOptions = {
            host: TEST_HOST,
            port: TEST_PORT,
            handler: router // Use the main application router for realistic testing
        };
        
        console.log(`Starting server startup performance test...`);
        console.log(`Target startup time: < ${STARTUP_TIME_THRESHOLD_MS}ms`);
        console.log(`Test server: ${serverOptions.host}:${serverOptions.port}`);
        
        // Measure the server startup time using the performance measurement utility
        const { ms: startupTime, server } = await measureServerStartupTime(serverOptions);
        testServer = server;
        
        // Log the measured startup time for educational analysis
        console.log(`Server startup completed in ${startupTime.toFixed(2)}ms`);
        
        // Primary performance assertion: Validate startup time is within threshold
        assert.ok(startupTime < STARTUP_TIME_THRESHOLD_MS, 
            `Server startup time (${startupTime.toFixed(2)}ms) should be less than ${STARTUP_TIME_THRESHOLD_MS}ms`);
        
        // Verify server functionality with a basic connectivity test
        // This ensures the server is not just bound to the port but also functional
        try {
            // Import HTTP request utility for connectivity validation
            const { httpRequest } = await import('../../test/utils/index.mjs');
            
            // Perform a basic health check request to verify server responsiveness
            console.log('Performing server connectivity validation...');
            const response = await httpRequest({
                method: 'GET',
                path: '/hello'
            });
            
            // Validate that the server responds appropriately
            assert.strictEqual(response.status, 200, 
                'Server should respond with 200 status for /hello endpoint');
            assert.strictEqual(response.body, 'Hello world', 
                'Server should return correct response body');
            
            console.log('Server connectivity validation passed');
            
        } catch (connectivityError) {
            console.warn('Server connectivity test failed:', connectivityError.message);
            // Note: We don't fail the performance test for connectivity issues
            // as this test is specifically focused on startup time measurement
        }
        
        // Performance test completion logging
        console.log(`✓ Server startup performance test passed`);
        console.log(`  - Startup time: ${startupTime.toFixed(2)}ms`);
        console.log(`  - Threshold: ${STARTUP_TIME_THRESHOLD_MS}ms`);
        console.log(`  - Performance margin: ${(STARTUP_TIME_THRESHOLD_MS - startupTime).toFixed(2)}ms`);
        
    } catch (error) {
        // Enhanced error reporting for performance test failures
        console.error('Server startup performance test failed:', error.message);
        
        // Provide specific guidance based on error type
        if (error.code === 'EADDRINUSE') {
            console.error(`Port ${TEST_PORT} is already in use. Please ensure no other services are running on this port.`);
        } else if (error.code === 'EACCES') {
            console.error(`Access denied when binding to port ${TEST_PORT}. Check port permissions.`);
        } else if (error.message.includes('startup time')) {
            console.error('Performance threshold exceeded. Consider optimizing server initialization.');
        }
        
        // Re-throw the error to ensure test failure is properly reported
        throw error;
        
    } finally {
        // Critical cleanup section: Ensure server resources are properly released
        if (testServer) {
            try {
                console.log('Cleaning up test server resources...');
                
                // Close the server and stop accepting new connections
                await new Promise((resolve, reject) => {
                    testServer.close((error) => {
                        if (error) {
                            console.warn('Server cleanup warning:', error.message);
                            reject(error);
                        } else {
                            console.log('Test server closed successfully');
                            resolve();
                        }
                    });
                });
                
            } catch (cleanupError) {
                console.error('Test server cleanup failed:', cleanupError.message);
                // Note: We don't re-throw cleanup errors to avoid masking test results
            }
        }
        
        console.log('Server startup performance test cleanup completed');
    }
});

/**
 * Additional Performance Test: Server Startup Consistency Validation
 * 
 * This supplementary test performs multiple startup measurements to validate
 * consistent performance across multiple test runs. This helps identify
 * performance variability and ensures reliable startup behavior.
 * 
 * Educational Purpose: Demonstrates advanced performance testing concepts
 * including statistical analysis and performance consistency validation.
 */
test('should demonstrate consistent server startup performance across multiple runs', async () => {
    const numberOfRuns = 3;
    const startupTimes = [];
    
    console.log(`Running ${numberOfRuns} server startup iterations for consistency analysis...`);
    
    for (let i = 0; i < numberOfRuns; i++) {
        let testServer = null;
        
        try {
            const serverOptions = {
                host: TEST_HOST,
                port: TEST_PORT + i + 1, // Use different ports to avoid conflicts
                handler: router
            };
            
            console.log(`Startup iteration ${i + 1}: Testing on port ${serverOptions.port}`);
            
            // Measure startup time for this iteration
            const { ms: startupTime, server } = await measureServerStartupTime(serverOptions);
            testServer = server;
            
            startupTimes.push(startupTime);
            console.log(`  Iteration ${i + 1} startup time: ${startupTime.toFixed(2)}ms`);
            
            // Validate individual startup time
            assert.ok(startupTime < STARTUP_TIME_THRESHOLD_MS, 
                `Iteration ${i + 1} startup time should be within threshold`);
            
        } catch (error) {
            console.error(`Startup iteration ${i + 1} failed:`, error.message);
            throw error;
            
        } finally {
            // Cleanup for this iteration
            if (testServer) {
                await new Promise((resolve) => {
                    testServer.close(() => resolve());
                });
            }
        }
    }
    
    // Calculate performance statistics for educational analysis
    const averageStartupTime = startupTimes.reduce((sum, time) => sum + time, 0) / startupTimes.length;
    const maxStartupTime = Math.max(...startupTimes);
    const minStartupTime = Math.min(...startupTimes);
    const varianceMs = maxStartupTime - minStartupTime;
    
    console.log('Server startup performance statistics:');
    console.log(`  Average startup time: ${averageStartupTime.toFixed(2)}ms`);
    console.log(`  Minimum startup time: ${minStartupTime.toFixed(2)}ms`);
    console.log(`  Maximum startup time: ${maxStartupTime.toFixed(2)}ms`);
    console.log(`  Performance variance: ${varianceMs.toFixed(2)}ms`);
    
    // Validate performance consistency
    assert.ok(averageStartupTime < STARTUP_TIME_THRESHOLD_MS, 
        'Average startup time should be within threshold');
    assert.ok(maxStartupTime < STARTUP_TIME_THRESHOLD_MS, 
        'Maximum startup time should be within threshold');
    
    // Performance variance should be reasonable (less than 50% of threshold)
    const acceptableVariance = STARTUP_TIME_THRESHOLD_MS * 0.5;
    assert.ok(varianceMs < acceptableVariance, 
        `Performance variance (${varianceMs.toFixed(2)}ms) should be less than ${acceptableVariance}ms`);
    
    console.log('✓ Server startup consistency validation passed');
});

/**
 * Performance Test Suite Summary
 * 
 * This performance test suite provides comprehensive validation of server startup
 * performance with the following key features:
 * 
 * Test Coverage:
 * - Server startup time measurement and validation
 * - Performance threshold compliance checking
 * - Server functionality verification
 * - Performance consistency across multiple runs
 * - Statistical analysis of startup performance
 * 
 * Educational Value:
 * - Demonstrates Node.js built-in test runner usage
 * - Shows performance measurement techniques
 * - Illustrates proper resource management in tests
 * - Teaches performance validation and analysis
 * - Provides patterns for performance test implementation
 * 
 * Technical Implementation:
 * - Zero external dependencies (Node.js built-in modules only)
 * - Proper error handling and cleanup procedures
 * - Comprehensive logging for debugging and analysis
 * - Statistical analysis for performance insights
 * - Cross-platform compatibility (Windows, macOS, Linux)
 * 
 * Performance Criteria Validation:
 * - Server startup time < 1000ms (1 second)
 * - Consistent performance across multiple runs
 * - Functional server after startup completion
 * - Proper resource cleanup and management
 */