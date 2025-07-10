// Node.js built-in child_process module for spawning test runner processes
import { spawn } from 'node:child_process'; // Node.js 22.x (built-in)

// Node.js built-in process module for environment variables and exit handling
import { process } from 'node:process'; // Node.js 22.x (built-in)

// Node.js built-in path module for cross-platform path resolution
import { path } from 'node:path'; // Node.js 22.x (built-in)

// Import test configuration utility for environment isolation
import { withTestConfig } from '../utils/testHelpers.mjs';

/**
 * Global constants for test runner configuration
 * These constants define the command-line flags and file patterns used by the Node.js test runner
 * to execute comprehensive test coverage analysis across all test suites.
 */
const COVERAGE_FLAG = '--experimental-test-coverage';
const TEST_RUNNER_FLAG = '--test';
const ALL_TEST_GLOB = 'src/test/{unit,integration,performance}/*.test.mjs';

/**
 * Executes the Node.js test runner for all test files (unit, integration, performance) with code coverage enabled.
 * This function orchestrates the complete test coverage process, including environment setup, test execution,
 * and results reporting. It demonstrates educational best practices for automating code coverage analysis
 * in a modern Node.js project using only built-in modules.
 * 
 * Educational Purpose: Shows how to programmatically execute the Node.js test runner with coverage flags,
 * handle process lifecycle management, and provide meaningful feedback for development and CI/CD workflows.
 * 
 * @returns {Promise<void>} Promise that resolves when the coverage run completes and results are output
 * @throws {Error} Throws error if test runner process fails or encounters system-level issues
 */
export async function runCoverage() {
    try {
        // Step 1: Resolve the project root and test directories using path utilities
        const projectRoot = process.cwd();
        const testPattern = path.resolve(projectRoot, ALL_TEST_GLOB);
        
        console.log('📊 Starting comprehensive test coverage analysis...');
        console.log(`📁 Project root: ${projectRoot}`);
        console.log(`🔍 Test pattern: ${testPattern}`);
        
        // Step 2: Prepare the arguments array for the Node.js test runner
        const nodeArgs = [
            TEST_RUNNER_FLAG,
            COVERAGE_FLAG,
            // Expand test globs to include all test suites
            'src/test/unit/*.test.mjs',
            'src/test/integration/*.test.mjs',
            'src/test/performance/*.test.mjs'
        ];
        
        console.log(`⚙️  Test runner arguments: ${nodeArgs.join(' ')}`);
        
        // Step 3: Execute the test coverage process with proper environment isolation
        await withTestConfig(
            {
                // Set NODE_ENV to 'test' for test environment isolation
                NODE_ENV: 'test',
                // Disable color output for CI/CD compatibility if needed
                FORCE_COLOR: process.env.CI ? '0' : '1',
                // Set test timeout for long-running coverage analysis
                NODE_TEST_TIMEOUT: '30000'
            },
            async () => {
                // Step 4: Spawn a child process to run the Node.js test runner
                console.log('🚀 Spawning Node.js test runner with coverage enabled...');
                
                const testProcess = spawn('node', nodeArgs, {
                    cwd: projectRoot,
                    stdio: 'inherit', // Pipe stdout/stderr to parent process for real-time feedback
                    env: {
                        ...process.env,
                        NODE_ENV: 'test'
                    }
                });
                
                // Step 5: Handle test process lifecycle and capture results
                return new Promise((resolve, reject) => {
                    // Monitor process errors during execution
                    testProcess.on('error', (error) => {
                        console.error('❌ Test runner process error:', error.message);
                        
                        // Provide specific error guidance for common issues
                        if (error.code === 'ENOENT') {
                            console.error('💡 Ensure Node.js is installed and available in PATH');
                        } else if (error.code === 'EACCES') {
                            console.error('💡 Check file permissions for test files and Node.js executable');
                        }
                        
                        reject(error);
                    });
                    
                    // Step 6: Handle process completion and capture exit code
                    testProcess.on('close', (exitCode) => {
                        console.log(`\n📋 Test runner process completed with exit code: ${exitCode}`);
                        
                        // Step 7: Handle success and failure scenarios
                        if (exitCode === 0) {
                            console.log('✅ Test coverage analysis completed successfully!');
                            console.log('📊 Coverage report generated with detailed metrics');
                            console.log('💡 Review the coverage output above for detailed analysis');
                            resolve();
                        } else {
                            console.error('❌ Test coverage analysis failed');
                            console.error(`💥 Tests exited with code ${exitCode}`);
                            
                            // Provide guidance based on exit code
                            if (exitCode === 1) {
                                console.error('💡 One or more tests failed - review test output above');
                            } else if (exitCode === 2) {
                                console.error('💡 Test runner encountered a system error');
                            }
                            
                            // Step 8: Reject promise with exit code for proper error handling
                            const error = new Error(`Test coverage process failed with exit code ${exitCode}`);
                            error.exitCode = exitCode;
                            reject(error);
                        }
                    });
                    
                    // Handle process termination signals for graceful shutdown
                    process.on('SIGINT', () => {
                        console.log('\n🛑 Received SIGINT - terminating test coverage process...');
                        testProcess.kill('SIGINT');
                    });
                    
                    process.on('SIGTERM', () => {
                        console.log('\n🛑 Received SIGTERM - terminating test coverage process...');
                        testProcess.kill('SIGTERM');
                    });
                });
            }
        );
        
    } catch (error) {
        // Enhanced error handling with educational context
        console.error('💥 Critical error during test coverage execution:');
        console.error(`❌ Error: ${error.message}`);
        
        // Provide debugging guidance for common error scenarios
        if (error.code === 'ENOENT') {
            console.error('💡 Troubleshooting: Verify Node.js installation and PATH configuration');
        } else if (error.code === 'EACCES') {
            console.error('💡 Troubleshooting: Check file permissions and execution rights');
        } else if (error.exitCode) {
            console.error(`💡 Troubleshooting: Test runner exit code ${error.exitCode} indicates test failures`);
        }
        
        // Log stack trace for debugging in development environments
        if (process.env.NODE_ENV === 'development') {
            console.error('🔍 Stack trace:', error.stack);
        }
        
        // Re-throw error to ensure proper exit code handling
        throw error;
    }
}

/**
 * Script entry point - executes coverage analysis when run directly
 * This entry point demonstrates proper error handling and exit code management
 * for automation and CI/CD integration. It ensures that the script behaves correctly
 * whether run manually or as part of an automated workflow.
 * 
 * Educational Purpose: Shows how to create Node.js scripts that can be both imported
 * as modules and executed directly, with proper error handling and process management.
 */
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log('🎯 Running test coverage script directly...');
    console.log('📚 Node.js Tutorial Application - Test Coverage Analysis');
    console.log('=' .repeat(60));
    
    try {
        // Execute the coverage analysis with proper error handling
        await runCoverage();
        
        // Exit with success code for automation workflows
        console.log('\n🎉 Test coverage analysis completed successfully!');
        console.log('✨ All tests passed with coverage metrics generated');
        process.exit(0);
        
    } catch (error) {
        // Handle errors with appropriate exit codes for automation
        console.error('\n💥 Test coverage analysis failed!');
        console.error('❌ Please review the error messages above and fix any issues');
        
        // Exit with error code to signal failure to automation systems
        const exitCode = error.exitCode || 1;
        console.error(`🚪 Exiting with code ${exitCode}`);
        process.exit(exitCode);
    }
}