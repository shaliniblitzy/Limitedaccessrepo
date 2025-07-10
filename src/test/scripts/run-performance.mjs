// Node.js built-in child process module for spawning test runner processes
import { spawn } from 'node:child_process'; // Node.js 22.x (built-in)

// Node.js built-in process module for environment variables and exit handling
import { process } from 'node:process'; // Node.js 22.x (built-in)

// Node.js built-in path module for cross-platform file path resolution
import { path } from 'node:path'; // Node.js 22.x (built-in)

// Import test configuration helper for environment isolation
import { withTestConfig } from '../utils/testHelpers.mjs';

/**
 * Performance test file paths for all test suites
 * These paths define the complete set of performance tests that validate
 * the Node.js tutorial HTTP server performance characteristics
 */
const PERFORMANCE_TEST_GLOBS = [
    'src/test/performance/memory-usage.test.mjs',
    'src/test/performance/response-time.test.mjs',
    'src/test/performance/server-startup.test.mjs'
];

/**
 * Node.js test runner flag for executing tests
 * The --test flag enables the built-in Node.js test runner
 */
const TEST_RUNNER_FLAG = '--test';

/**
 * Executes the Node.js test runner for all performance test files (memory usage, 
 * response time, server startup), collects and displays the results, and exits 
 * with the appropriate status code.
 * 
 * This function demonstrates best practices for automating performance test suite 
 * execution in a Node.js project using only built-in modules and the modern test 
 * runner. It provides educational clarity while supporting CI/CD integration and 
 * local development workflows.
 * 
 * Educational Purpose: Shows how to programmatically execute Node.js tests with 
 * proper environment isolation, real-time output handling, and exit code management.
 * 
 * @returns {Promise<void>} Resolves when the performance test run completes and results are output
 */
export async function runPerformanceTests() {
    try {
        // Step 1: Resolve the project root and performance test file paths using path utilities
        const projectRoot = path.resolve(process.cwd());
        const testFilePaths = PERFORMANCE_TEST_GLOBS.map(glob => path.resolve(projectRoot, glob));
        
        console.log('🚀 Starting Performance Test Suite Execution');
        console.log('📁 Project Root:', projectRoot);
        console.log('📋 Test Files:', testFilePaths.length);
        testFilePaths.forEach((testPath, index) => {
            console.log(`   ${index + 1}. ${path.relative(projectRoot, testPath)}`);
        });
        console.log('');

        // Step 2: Prepare the arguments array: [--test, test files...]
        const testArguments = [TEST_RUNNER_FLAG, ...testFilePaths];
        
        console.log('⚙️  Test Runner Configuration:');
        console.log('   Command: node', testArguments.join(' '));
        console.log('   Flag:', TEST_RUNNER_FLAG);
        console.log('   Files:', testFilePaths.length);
        console.log('');

        // Step 3: Optionally set NODE_ENV to 'test' and other environment variables for isolation
        const testEnvironmentConfig = {
            NODE_ENV: 'test',
            TEST_RUNNER_MODE: 'performance',
            PERFORMANCE_TEST_SUITE: 'true'
        };

        console.log('🔧 Setting up test environment configuration...');
        console.log('   NODE_ENV:', testEnvironmentConfig.NODE_ENV);
        console.log('   TEST_RUNNER_MODE:', testEnvironmentConfig.TEST_RUNNER_MODE);
        console.log('   PERFORMANCE_TEST_SUITE:', testEnvironmentConfig.PERFORMANCE_TEST_SUITE);
        console.log('');

        // Execute tests within configured environment using withTestConfig
        await withTestConfig(testEnvironmentConfig, async () => {
            return new Promise((resolve, reject) => {
                console.log('🏃 Executing performance tests...');
                console.log('');

                // Step 4: Spawn a child process to run the Node.js test runner with all performance test files
                const testProcess = spawn('node', testArguments, {
                    stdio: 'inherit', // Pipe stdout, stderr, and stdin to parent process
                    cwd: projectRoot,
                    env: {
                        ...process.env,
                        ...testEnvironmentConfig
                    }
                });

                // Step 5: Handle process completion and capture the exit code
                testProcess.on('close', (exitCode) => {
                    console.log('');
                    console.log('📊 Performance Test Suite Results:');
                    console.log('   Exit Code:', exitCode);
                    console.log('   Status:', exitCode === 0 ? '✅ SUCCESS' : '❌ FAILED');
                    console.log('');

                    // Step 6: If the process exits with a non-zero code, reject the promise
                    if (exitCode !== 0) {
                        const error = new Error(`Performance tests failed with exit code ${exitCode}`);
                        error.exitCode = exitCode;
                        reject(error);
                    } else {
                        // Step 7: Log a summary message indicating success
                        console.log('🎉 All performance tests completed successfully!');
                        console.log('');
                        console.log('Performance Test Summary:');
                        console.log('  ✅ Memory usage tests passed');
                        console.log('  ✅ Response time tests passed');
                        console.log('  ✅ Server startup tests passed');
                        console.log('');
                        console.log('Performance validation completed. All requirements met.');
                        resolve();
                    }
                });

                // Handle process errors (e.g., command not found, permission denied)
                testProcess.on('error', (error) => {
                    console.error('');
                    console.error('❌ Error executing performance tests:');
                    console.error('   Error:', error.message);
                    console.error('   Code:', error.code || 'UNKNOWN');
                    console.error('');
                    
                    // Provide helpful error messages for common issues
                    if (error.code === 'ENOENT') {
                        console.error('💡 Troubleshooting:');
                        console.error('   • Ensure Node.js is installed and accessible');
                        console.error('   • Check that Node.js version is 22.x or higher');
                        console.error('   • Verify the current working directory is correct');
                    } else if (error.code === 'EACCES') {
                        console.error('💡 Troubleshooting:');
                        console.error('   • Check file permissions for test files');
                        console.error('   • Ensure test files are readable and executable');
                    }
                    console.error('');
                    
                    reject(error);
                });

                // Handle unexpected process termination
                testProcess.on('disconnect', () => {
                    console.warn('⚠️  Test process disconnected unexpectedly');
                });
            });
        });

    } catch (error) {
        console.error('');
        console.error('💥 Fatal error during performance test execution:');
        console.error('   Error:', error.message);
        console.error('   Stack:', error.stack);
        console.error('');
        
        // Provide context for debugging
        console.error('🔍 Debug Information:');
        console.error('   Node.js Version:', process.version);
        console.error('   Platform:', process.platform);
        console.error('   Architecture:', process.arch);
        console.error('   Working Directory:', process.cwd());
        console.error('');
        
        // Re-throw error with additional context
        const enhancedError = new Error(`Performance test execution failed: ${error.message}`);
        enhancedError.originalError = error;
        enhancedError.exitCode = error.exitCode || 1;
        throw enhancedError;
    }
}

/**
 * Script entrypoint: If run directly (not imported), invoke runPerformanceTests()
 * and exit with the appropriate status code based on test results.
 * 
 * This pattern allows the script to be used both as a standalone executable
 * and as an importable module for programmatic use.
 */
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log('🎯 Performance Test Runner - Node.js Tutorial HTTP Server');
    console.log('📚 Educational automation script for performance validation');
    console.log('');
    console.log('Configuration:');
    console.log('  Node.js Version:', process.version);
    console.log('  Test Runner:', 'Built-in Node.js Test Runner');
    console.log('  Performance Test Suites:', PERFORMANCE_TEST_GLOBS.length);
    console.log('');

    // Execute performance tests and handle results
    runPerformanceTests()
        .then(() => {
            console.log('✨ Performance test script completed successfully');
            console.log('');
            console.log('Usage Examples:');
            console.log('  npm run performance     # Run via npm script');
            console.log('  node src/test/scripts/run-performance.mjs  # Direct execution');
            console.log('');
            console.log('CI/CD Integration:');
            console.log('  This script can be used as a build step to enforce performance requirements');
            console.log('  Exit code 0 indicates success, non-zero indicates failure');
            console.log('');
            
            // Exit with success code
            process.exit(0);
        })
        .catch((error) => {
            console.error('💀 Performance test script failed');
            console.error('');
            console.error('Failure Details:');
            console.error('  Error:', error.message);
            console.error('  Exit Code:', error.exitCode || 1);
            console.error('');
            console.error('Troubleshooting:');
            console.error('  • Ensure all performance test files exist');
            console.error('  • Check that Node.js test runner is available');
            console.error('  • Verify test environment configuration');
            console.error('  • Review individual test failures above');
            console.error('');
            console.error('For help, check the test output above or review the test files:');
            PERFORMANCE_TEST_GLOBS.forEach(glob => {
                console.error(`  • ${glob}`);
            });
            console.error('');
            
            // Exit with failure code
            process.exit(error.exitCode || 1);
        });
}