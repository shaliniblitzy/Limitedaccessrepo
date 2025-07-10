// Node.js built-in test runner for defining and running test cases and test suites
import { test } from 'node:test'; // Node.js 22.x (built-in)

// Node.js built-in assertion library for validating test outcomes
import assert from 'node:assert'; // Node.js 22.x (built-in)

// Node.js built-in child process module for spawning test runner processes
import { spawn } from 'node:child_process'; // Node.js 22.x (built-in)

// Node.js built-in path module for resolving file paths and directories
import { dirname, resolve } from 'node:path'; // Node.js 22.x (built-in)

// Node.js built-in URL module for handling ES module file paths
import { fileURLToPath } from 'node:url'; // Node.js 22.x (built-in)

// Import all test utility functions and constants from the centralized test utilities
import { 
    mockRequest, 
    mockResponse, 
    startTestServer, 
    httpRequest, 
    withTestConfig, 
    measureTime, 
    TEST_PORT, 
    TEST_HOST 
} from './utils/index.mjs';

/**
 * Node.js Tutorial Application Test Suite Entry Point
 * 
 * This file serves as the comprehensive entry point for the Node.js tutorial application's
 * test suite, orchestrating and executing all test categories (unit, integration, performance)
 * using the Node.js built-in test runner. It provides a single import location for all test
 * utilities and ensures proper test environment initialization, execution coordination, and
 * result reporting.
 * 
 * Educational Purpose:
 * This implementation demonstrates best practices for test automation, test orchestration,
 * and comprehensive quality assurance in Node.js applications using only built-in modules.
 * It serves as a template for students and developers learning about test-driven development,
 * automated testing strategies, and CI/CD integration without external dependencies.
 * 
 * Key Features:
 * - Comprehensive test suite orchestration using Node.js built-in test runner
 * - Support for unit, integration, and performance test categories
 * - Zero external dependencies for educational clarity and simplicity
 * - Proper test environment isolation and configuration management
 * - Real-time test output streaming and result reporting
 * - Exit code handling for CI/CD integration
 * - Educational logging and comprehensive error handling
 * - Re-export of all test utilities for convenience
 * - Cross-platform compatibility (Windows, macOS, Linux)
 * 
 * Architecture:
 * The test suite follows a hierarchical architecture pattern:
 * - Test orchestration layer: Coordinates test execution across categories
 * - Test utility layer: Provides mock objects, server lifecycle, and measurement tools
 * - Test execution layer: Runs individual test files using Node.js built-in test runner
 * - Result reporting layer: Aggregates and reports test outcomes
 * 
 * Design Principles:
 * - Educational clarity over production complexity
 * - Comprehensive test coverage validation
 * - Proper resource management and cleanup
 * - Test isolation and environment management
 * - Maintainable and extensible test architecture
 */

// Get the current file's directory for resolving relative paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define comprehensive test file glob patterns for all test categories
// These patterns match test files in unit, integration, and performance directories
const ALL_TEST_GLOBS = [
    'src/test/unit/*.test.mjs',
    'src/test/integration/*.test.mjs', 
    'src/test/performance/*.test.mjs'
];

/**
 * Executes all test suites (unit, integration, performance) using the Node.js built-in
 * test runner. Collects and displays results in real-time, handles test failures, and
 * exits with the appropriate status code for CI/CD integration.
 * 
 * This function implements the complete test orchestration workflow including:
 * - Test environment preparation and configuration
 * - Child process spawning for test runner execution
 * - Real-time output streaming and result collection
 * - Error handling and failure reporting
 * - Exit code management for automation integration
 * 
 * Educational Purpose:
 * Demonstrates how to orchestrate comprehensive test suites using Node.js built-in
 * capabilities, including process management, stream handling, and test automation
 * patterns suitable for educational projects and CI/CD pipelines.
 * 
 * @returns {Promise<void>} Promise that resolves when test execution completes
 */
export async function runAllTests() {
    console.log('=== Node.js Tutorial Application Test Suite ===');
    console.log('Starting comprehensive test execution...');
    console.log('');
    
    try {
        // Step 1: Resolve project root directory for consistent path handling
        const projectRoot = resolve(__dirname, '../..');
        console.log(`Project root: ${projectRoot}`);
        console.log('');
        
        // Step 2: Prepare test environment configuration
        console.log('Preparing test environment...');
        
        // Set NODE_ENV to 'test' for proper test environment isolation
        const originalNodeEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'test';
        
        // Configure test-specific environment variables
        process.env.TEST_MODE = 'true';
        process.env.LOG_LEVEL = 'INFO';
        
        console.log('Test environment configured successfully');
        console.log(`NODE_ENV set to: ${process.env.NODE_ENV}`);
        console.log('');
        
        // Step 3: Build Node.js test runner arguments array
        console.log('Building test runner arguments...');
        
        // Create comprehensive argument array for the Node.js test runner
        const testArgs = [
            '--test',                    // Enable Node.js built-in test runner
            '--test-reporter=spec',      // Use spec reporter for detailed output
            '--test-concurrency=4',      // Run tests with limited concurrency
            ...ALL_TEST_GLOBS           // Include all test file patterns
        ];
        
        console.log('Test runner arguments prepared:');
        testArgs.forEach((arg, index) => {
            console.log(`  ${index + 1}. ${arg}`);
        });
        console.log('');
        
        // Step 4: Execute the test runner using child process
        console.log('Spawning Node.js test runner process...');
        console.log('=====================================');
        console.log('');
        
        // Create the test runner process
        const testProcess = spawn('node', testArgs, {
            cwd: projectRoot,
            stdio: 'inherit',           // Inherit stdio for real-time output
            env: process.env           // Pass current environment variables
        });
        
        // Step 5: Handle process completion and result collection
        const testResult = await new Promise((resolve, reject) => {
            // Handle successful process completion
            testProcess.on('close', (code) => {
                console.log('');
                console.log('=====================================');
                console.log(`Test runner process completed with exit code: ${code}`);
                
                // Restore original NODE_ENV
                if (originalNodeEnv !== undefined) {
                    process.env.NODE_ENV = originalNodeEnv;
                } else {
                    delete process.env.NODE_ENV;
                }
                
                resolve(code);
            });
            
            // Handle process errors
            testProcess.on('error', (error) => {
                console.error('');
                console.error('=====================================');
                console.error(`Test runner process error: ${error.message}`);
                
                // Restore original NODE_ENV
                if (originalNodeEnv !== undefined) {
                    process.env.NODE_ENV = originalNodeEnv;
                } else {
                    delete process.env.NODE_ENV;
                }
                
                reject(error);
            });
        });
        
        // Step 6: Analyze and report test results
        console.log('');
        console.log('=== Test Execution Summary ===');
        
        if (testResult === 0) {
            console.log('✅ All tests passed successfully!');
            console.log('Test suite execution completed without errors.');
            console.log('');
            console.log('Next steps:');
            console.log('- Review test coverage reports');
            console.log('- Analyze performance test results');
            console.log('- Consider adding additional test scenarios');
        } else {
            console.log('❌ Some tests failed or encountered errors.');
            console.log(`Exit code: ${testResult}`);
            console.log('');
            console.log('Troubleshooting steps:');
            console.log('- Review failed test output above');
            console.log('- Check test file syntax and imports');
            console.log('- Verify test server ports are available');
            console.log('- Ensure all dependencies are properly installed');
        }
        
        console.log('');
        console.log('Test suite execution completed.');
        console.log('=== End of Test Suite ===');
        
        // Step 7: Exit with appropriate status code for CI/CD integration
        if (testResult !== 0) {
            process.exit(testResult);
        }
        
    } catch (error) {
        // Handle any unexpected errors during test execution
        console.error('');
        console.error('=== Test Execution Error ===');
        console.error('Critical error occurred during test execution:');
        console.error(`Error: ${error.message}`);
        
        if (error.stack) {
            console.error('Stack trace:');
            console.error(error.stack);
        }
        
        console.error('');
        console.error('Please check the following:');
        console.error('- Node.js version compatibility (requires Node.js 18+)');
        console.error('- Test file syntax and module imports');
        console.error('- Available system resources and permissions');
        console.error('- Network connectivity for integration tests');
        
        console.error('');
        console.error('=== End of Error Report ===');
        
        // Exit with error code indicating test execution failure
        process.exit(1);
    }
}

// Re-export all test utility functions for convenient access
// This allows test files to import utilities directly from this entry point

/**
 * Mock HTTP Objects - For Unit Testing
 * These functions create mock HTTP request and response objects for isolated unit tests
 */
export { mockRequest };
export { mockResponse };

/**
 * Server Lifecycle Management - For Integration and E2E Testing
 * This function starts a real HTTP server instance for integration testing scenarios
 */
export { startTestServer };

/**
 * HTTP Request Utilities - For Integration and E2E Testing
 * This function performs HTTP requests to test servers and returns response data
 */
export { httpRequest };

/**
 * Configuration Override Utilities - For Test Isolation
 * This function temporarily overrides environment variables or config values for tests
 */
export { withTestConfig };

/**
 * Performance Measurement Utilities - For Performance Testing
 * This function measures execution time of async functions for performance validation
 */
export { measureTime };

/**
 * Test Server Constants - For Consistent Test Environments
 * These constants define default host and port for test server instances
 */
export { TEST_PORT };
export { TEST_HOST };

/**
 * Script Entry Point - Direct Execution Handler
 * 
 * This section handles direct execution of the test file (not imported as a module).
 * When run directly via `node src/test/index.mjs` or `npm test`, it executes the
 * complete test suite and exits with the appropriate status code.
 * 
 * Educational Purpose:
 * Demonstrates how to detect direct script execution versus module import, handle
 * async operations in script contexts, and manage process exit codes properly.
 */

// Check if this file is being executed directly (not imported as a module)
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log('Test suite entry point executed directly');
    console.log('Initializing test execution...');
    console.log('');
    
    // Execute the test suite and handle any uncaught errors
    runAllTests()
        .then(() => {
            console.log('Test suite execution completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Test suite execution failed:');
            console.error(error.message);
            
            if (error.stack) {
                console.error('Stack trace:');
                console.error(error.stack);
            }
            
            process.exit(1);
        });
}

/**
 * Module Export Summary
 * 
 * This module provides the following exports for comprehensive test functionality:
 * 
 * Functions:
 * - runAllTests(): Main test orchestration function
 * - mockRequest(): Creates mock HTTP request objects for unit tests
 * - mockResponse(): Creates mock HTTP response objects for unit tests
 * - startTestServer(): Starts real HTTP server instances for integration tests
 * - httpRequest(): Performs HTTP requests to test servers
 * - withTestConfig(): Temporarily overrides configuration for test isolation
 * - measureTime(): Measures async function execution time for performance tests
 * 
 * Constants:
 * - TEST_PORT: Default port (3100) for test server instances
 * - TEST_HOST: Default host (127.0.0.1) for test server instances
 * 
 * Usage Examples:
 * 
 * 1. Direct execution:
 *    node src/test/index.mjs
 *    npm test
 * 
 * 2. Module import:
 *    import { runAllTests, mockRequest, mockResponse } from './test/index.mjs';
 * 
 * 3. Test utility import:
 *    import { startTestServer, httpRequest, measureTime } from './test/index.mjs';
 * 
 * This module enables comprehensive test automation while maintaining educational
 * clarity and zero external dependencies, supporting both local development
 * workflows and CI/CD integration scenarios.
 */