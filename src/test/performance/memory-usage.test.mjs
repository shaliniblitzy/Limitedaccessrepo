// Node.js built-in test runner for performance testing
import { test, describe } from 'node:test'; // Node.js 22.x (built-in)

// Node.js built-in assertion library for test validation
import assert from 'node:assert'; // Node.js 22.x (built-in)

// Node.js built-in process module for memory usage sampling
import { process } from 'node:process'; // Node.js 22.x (built-in)

// Test utility functions for server lifecycle and HTTP request management
import { startTestServer, httpRequest } from '../../test/utils/index.mjs';

// Import the main server handler for performance testing
import { server } from '../../backend/server.mjs';

/**
 * Performance Test Suite: Memory Usage Validation
 * 
 * This test suite validates that the Node.js tutorial HTTP server's memory usage
 * remains within acceptable limits during idle and light load conditions. The tests
 * are designed to ensure the server meets the specified performance requirements
 * while providing educational clarity about memory monitoring and performance testing.
 * 
 * Educational Purpose:
 * This test suite demonstrates professional performance testing practices including:
 * - Memory usage sampling and analysis using Node.js process.memoryUsage()
 * - Real server instance testing for accurate resource measurement
 * - Performance threshold validation for production readiness
 * - Educational patterns for memory optimization and monitoring
 * 
 * Performance Requirements:
 * - Memory Usage: Server must remain below 50MB during idle and light load
 * - Test Isolation: Each test uses a dedicated server instance
 * - Measurement Accuracy: Memory sampling after stabilization delays
 * - Educational Clarity: Comprehensive logging and transparent test patterns
 * 
 * Technical Implementation:
 * The test suite creates real HTTP server instances to ensure all initialization
 * code, configuration loading, and port binding are included in memory measurements.
 * Memory sampling occurs after stabilization delays to allow the event loop and
 * garbage collector to reach steady state.
 * 
 * Design Principles:
 * - Real server testing for accurate measurement
 * - Isolated test execution to prevent interference
 * - Educational transparency through comprehensive logging
 * - Protocol compliance with HTTP/1.1 standards
 * - Cross-platform compatibility for diverse learning environments
 */

// Global configuration constants for memory usage testing
// These values align with the technical specification requirements

/**
 * Maximum allowed memory usage in megabytes
 * Based on technical specification requirement for memory efficiency
 */
const MEMORY_USAGE_THRESHOLD_MB = 50;

/**
 * Delay in milliseconds to allow memory usage to stabilize
 * Allows the event loop and garbage collector to reach steady state
 */
const MEMORY_SAMPLE_DELAY_MS = 100;

/**
 * Number of HTTP requests to send for light load testing
 * Simulates realistic light usage without overwhelming the server
 */
const HELLO_REQUEST_COUNT = 5;

/**
 * Samples the current process memory usage and returns memory statistics
 * converted to megabytes for easy analysis and comparison against thresholds.
 * 
 * This function provides comprehensive memory usage analysis including:
 * - RSS (Resident Set Size): Physical memory currently used by the process
 * - Heap Used: Memory actively used by JavaScript objects and closures
 * - Heap Total: Total memory allocated for the JavaScript heap
 * 
 * Educational Purpose:
 * Demonstrates how to use Node.js process.memoryUsage() for performance monitoring
 * and shows the relationship between different memory metrics for optimization analysis.
 * 
 * @returns {Object} Memory usage statistics in MB: { rssMb, heapUsedMb, heapTotalMb }
 */
function sampleMemoryUsage() {
    // Get current process memory usage statistics in bytes
    const memoryStats = process.memoryUsage();
    
    // Convert bytes to megabytes for easier analysis and comparison
    const rssMb = Math.round((memoryStats.rss / 1024 / 1024) * 100) / 100;
    const heapUsedMb = Math.round((memoryStats.heapUsed / 1024 / 1024) * 100) / 100;
    const heapTotalMb = Math.round((memoryStats.heapTotal / 1024 / 1024) * 100) / 100;
    
    // Return memory usage object with descriptive property names
    return {
        rssMb,
        heapUsedMb,
        heapTotalMb
    };
}

/**
 * Sends a specified number of HTTP GET requests to the '/hello' endpoint
 * to simulate light load conditions for memory usage testing.
 * 
 * This function implements realistic load simulation by:
 * - Sending sequential HTTP requests to avoid burst allocation
 * - Validating response correctness for each request
 * - Introducing small delays between requests for realistic timing
 * - Providing comprehensive error handling for request failures
 * 
 * Educational Purpose:
 * Demonstrates how to simulate realistic load patterns for performance testing
 * and shows proper async/await patterns for sequential request processing.
 * 
 * @param {Object} serverHandle - The HTTP server instance to send requests to
 * @param {number} count - Number of requests to send
 * @returns {Promise<void>} Resolves when all requests have completed successfully
 */
async function sendHelloRequests(serverHandle, count) {
    // Send the specified number of requests sequentially
    for (let i = 0; i < count; i++) {
        try {
            // Send HTTP GET request to the /hello endpoint
            const response = await httpRequest({
                method: 'GET',
                path: '/hello',
                headers: {
                    'User-Agent': 'Node.js-Tutorial-Performance-Test/1.0'
                }
            });
            
            // Validate the response to ensure server is functioning correctly
            assert.strictEqual(response.status, 200, 
                `Request ${i + 1} failed with status ${response.status}`);
            assert.strictEqual(response.body, 'Hello world', 
                `Request ${i + 1} returned unexpected body: ${response.body}`);
            
            // Small delay between requests to avoid burst allocation and simulate realistic usage
            await new Promise(resolve => setTimeout(resolve, 10));
            
        } catch (error) {
            // Handle individual request failures with detailed error information
            throw new Error(`Request ${i + 1} failed: ${error.message}`);
        }
    }
}

/**
 * Performance Test Suite: Memory Usage Validation
 * 
 * This test suite validates the server's memory efficiency under different load conditions,
 * ensuring compliance with the technical specification's memory usage requirements.
 */
describe('Memory Usage Performance Tests', () => {
    
    /**
     * Test Case 1: Idle Memory Usage Validation
     * 
     * Validates that the server's memory usage remains below the threshold
     * when started and left idle without processing any requests.
     * 
     * Test Steps:
     * 1. Start a test server instance with main router logic
     * 2. Allow server to stabilize after initialization
     * 3. Sample memory usage across all metrics
     * 4. Validate all memory metrics are within acceptable thresholds
     * 5. Clean up server resources after test completion
     */
    test('should not exceed 50MB memory usage when idle', async () => {
        let testServer = null;
        
        try {
            // Step 1: Start the test server using the main router logic
            testServer = await startTestServer((req, res) => {
                // Use the main router from the server to ensure realistic memory usage
                const { router } = await import('../../backend/routes/index.mjs');
                router(req, res);
            });
            
            // Step 2: Wait for server to stabilize after initialization
            // This allows the event loop and garbage collector to reach steady state
            await new Promise(resolve => setTimeout(resolve, MEMORY_SAMPLE_DELAY_MS));
            
            // Step 3: Sample current memory usage
            const memoryUsage = sampleMemoryUsage();
            
            // Log memory usage for educational analysis and debugging
            console.log(`[PERFORMANCE] Idle Memory Usage - RSS: ${memoryUsage.rssMb}MB, ` +
                       `Heap Used: ${memoryUsage.heapUsedMb}MB, ` +
                       `Heap Total: ${memoryUsage.heapTotalMb}MB`);
            
            // Step 4: Validate that all memory metrics are within acceptable thresholds
            assert.ok(memoryUsage.rssMb <= MEMORY_USAGE_THRESHOLD_MB, 
                `RSS memory usage ${memoryUsage.rssMb}MB exceeds threshold ${MEMORY_USAGE_THRESHOLD_MB}MB`);
            
            assert.ok(memoryUsage.heapUsedMb <= MEMORY_USAGE_THRESHOLD_MB, 
                `Heap used memory ${memoryUsage.heapUsedMb}MB exceeds threshold ${MEMORY_USAGE_THRESHOLD_MB}MB`);
            
            assert.ok(memoryUsage.heapTotalMb <= MEMORY_USAGE_THRESHOLD_MB, 
                `Heap total memory ${memoryUsage.heapTotalMb}MB exceeds threshold ${MEMORY_USAGE_THRESHOLD_MB}MB`);
            
            // Log successful validation for educational feedback
            console.log('[PERFORMANCE] Idle memory usage test passed - all metrics within thresholds');
            
        } catch (error) {
            // Provide detailed error information for debugging
            throw new Error(`Idle memory usage test failed: ${error.message}`);
        } finally {
            // Step 5: Clean up server resources regardless of test outcome
            if (testServer) {
                testServer.close();
            }
        }
    });
    
    /**
     * Test Case 2: Light Load Memory Usage Validation
     * 
     * Validates that sending a small number of requests to the '/hello' endpoint
     * does not cause memory usage to exceed the specified threshold.
     * 
     * Test Steps:
     * 1. Start a test server instance with main router logic
     * 2. Send multiple HTTP requests to simulate light load
     * 3. Allow server to stabilize after request processing
     * 4. Sample memory usage across all metrics
     * 5. Validate all memory metrics are within acceptable thresholds
     * 6. Clean up server resources after test completion
     */
    test('should not exceed 50MB memory usage under light load', async () => {
        let testServer = null;
        
        try {
            // Step 1: Start the test server using the main router logic
            testServer = await startTestServer((req, res) => {
                // Use the main router from the server to ensure realistic memory usage
                const { router } = await import('../../backend/routes/index.mjs');
                router(req, res);
            });
            
            // Step 2: Send multiple HTTP GET requests to simulate light load
            console.log(`[PERFORMANCE] Sending ${HELLO_REQUEST_COUNT} requests to /hello endpoint...`);
            await sendHelloRequests(testServer, HELLO_REQUEST_COUNT);
            
            // Step 3: Wait for server to stabilize after request processing
            // This allows for garbage collection and memory optimization
            await new Promise(resolve => setTimeout(resolve, MEMORY_SAMPLE_DELAY_MS));
            
            // Step 4: Sample current memory usage after load testing
            const memoryUsage = sampleMemoryUsage();
            
            // Log memory usage for educational analysis and debugging
            console.log(`[PERFORMANCE] Light Load Memory Usage - RSS: ${memoryUsage.rssMb}MB, ` +
                       `Heap Used: ${memoryUsage.heapUsedMb}MB, ` +
                       `Heap Total: ${memoryUsage.heapTotalMb}MB`);
            
            // Step 5: Validate that all memory metrics are within acceptable thresholds
            assert.ok(memoryUsage.rssMb <= MEMORY_USAGE_THRESHOLD_MB, 
                `RSS memory usage ${memoryUsage.rssMb}MB exceeds threshold ${MEMORY_USAGE_THRESHOLD_MB}MB under light load`);
            
            assert.ok(memoryUsage.heapUsedMb <= MEMORY_USAGE_THRESHOLD_MB, 
                `Heap used memory ${memoryUsage.heapUsedMb}MB exceeds threshold ${MEMORY_USAGE_THRESHOLD_MB}MB under light load`);
            
            assert.ok(memoryUsage.heapTotalMb <= MEMORY_USAGE_THRESHOLD_MB, 
                `Heap total memory ${memoryUsage.heapTotalMb}MB exceeds threshold ${MEMORY_USAGE_THRESHOLD_MB}MB under light load`);
            
            // Log successful validation for educational feedback
            console.log('[PERFORMANCE] Light load memory usage test passed - all metrics within thresholds');
            
        } catch (error) {
            // Provide detailed error information for debugging
            throw new Error(`Light load memory usage test failed: ${error.message}`);
        } finally {
            // Step 6: Clean up server resources regardless of test outcome
            if (testServer) {
                testServer.close();
            }
        }
    });
    
});

/**
 * Test Suite Configuration and Educational Notes
 * 
 * Execution Instructions:
 * - Run with: node --test src/test/performance/memory-usage.test.mjs
 * - Run with coverage: node --test --experimental-test-coverage src/test/performance/memory-usage.test.mjs
 * - Run in watch mode: node --test --watch src/test/performance/memory-usage.test.mjs
 * 
 * Performance Testing Best Practices:
 * 1. Real Server Testing: Uses actual server instances for accurate measurement
 * 2. Stabilization Delays: Allows event loop and GC to reach steady state
 * 3. Multiple Metrics: Monitors RSS, heap used, and heap total memory
 * 4. Realistic Load: Simulates actual usage patterns rather than synthetic load
 * 5. Comprehensive Logging: Provides detailed output for educational analysis
 * 
 * Memory Optimization Insights:
 * - RSS (Resident Set Size): Physical memory currently used by the process
 * - Heap Used: Memory actively used by JavaScript objects and closures
 * - Heap Total: Total memory allocated for the JavaScript heap
 * - Memory thresholds ensure efficient resource usage for educational environments
 * 
 * Test Isolation Strategy:
 * - Each test creates a dedicated server instance to prevent interference
 * - Server cleanup in finally blocks ensures resource release
 * - Sequential execution prevents resource contention between tests
 * - Comprehensive error handling with detailed failure messages
 * 
 * Educational Value:
 * This test suite demonstrates:
 * - Professional performance testing patterns
 * - Memory monitoring and optimization techniques
 * - Real-world server lifecycle management
 * - Comprehensive error handling and resource cleanup
 * - Performance requirement validation and compliance checking
 */