// Node.js built-in child process module for spawning test runner processes
import { spawn } from 'node:child_process'; // Node.js 22.x (built-in)

// Node.js built-in process module for environment variables and process control
import process from 'node:process'; // Node.js 22.x (built-in)

// Node.js built-in path module for cross-platform path resolution
import path from 'node:path'; // Node.js 22.x (built-in)

// Import test environment configuration utility for isolated test execution
import { withTestConfig } from '../utils/testHelpers.mjs';

/**
 * Node.js test runner flag for enabling built-in test execution
 * This flag activates the Node.js built-in test runner introduced in Node.js 18
 * and stabilized in Node.js 20, providing zero-dependency test execution
 */
const TEST_RUNNER_FLAG = '--test';

/**
 * Comprehensive test file glob patterns for all test suites
 * These patterns ensure all test files are discovered and executed:
 * - Unit tests: Test individual functions and modules in isolation
 * - Integration tests: Test component interactions and HTTP request-response cycles
 * - Performance tests: Validate response times and resource usage
 */
const ALL_TEST_GLOBS = [
    'src/test/unit/*.test.mjs',
    'src/test/integration/*.test.mjs',
    'src/test/performance/*.test.mjs'
];

/**
 * Executes the Node.js test runner for all test files (unit, integration, performance),
 * collects and displays the results, and exits with the appropriate status code.
 * 
 * This function implements comprehensive test automation by:
 * 1. Configuring the test environment for isolation
 * 2. Resolving project paths for cross-platform compatibility
 * 3. Spawning the Node.js test runner with appropriate flags
 * 4. Providing real-time feedback through stdout/stderr piping
 * 5. Handling process completion and exit codes
 * 
 * Educational Purpose: Demonstrates best practices for test automation in Node.js
 * using only built-in modules and the modern test runner, supporting both local
 * development workflows and CI/CD pipeline integration.
 * 
 * @returns {Promise<void>} Resolves when the test run completes and results are output
 */
export async function runAllTests() {
    try {
        // Step 1: Resolve the project root and test directories using path utilities
        // This ensures the test runner is executed from the correct project root
        // and supports cross-platform compatibility for path resolution
        const projectRoot = process.cwd();
        const resolvedProjectRoot = path.resolve(projectRoot);
        
        console.log(`🚀 Starting comprehensive test execution from: ${resolvedProjectRoot}`);
        console.log(`📁 Test suites: Unit, Integration, Performance`);
        console.log(`🔧 Using Node.js built-in test runner (${TEST_RUNNER_FLAG})`);
        
        // Step 2: Prepare the arguments array for the Node.js test runner
        // The arguments include the test runner flag and all test file globs
        const testArgs = [TEST_RUNNER_FLAG, ...ALL_TEST_GLOBS];
        
        console.log(`📋 Test arguments: ${testArgs.join(' ')}`);
        
        // Step 3: Configure test environment using withTestConfig for isolation
        // This ensures tests run in a clean, isolated environment with proper
        // configuration that doesn't interfere with development or production settings
        const testEnvironmentConfig = {
            NODE_ENV: 'test',
            TEST_TIMEOUT: '30000',
            LOG_LEVEL: 'info'
        };
        
        console.log(`🌐 Test environment configuration applied`);
        console.log(`   - NODE_ENV: ${testEnvironmentConfig.NODE_ENV}`);
        console.log(`   - TEST_TIMEOUT: ${testEnvironmentConfig.TEST_TIMEOUT}ms`);
        console.log(`   - LOG_LEVEL: ${testEnvironmentConfig.LOG_LEVEL}`);
        
        // Execute tests within the configured environment
        await withTestConfig(testEnvironmentConfig, async () => {
            // Step 4: Spawn a child process to run the Node.js test runner
            // This approach provides full control over the test execution process
            // and enables comprehensive output capture and error handling
            const testProcess = spawn('node', testArgs, {
                cwd: resolvedProjectRoot,
                stdio: 'pipe', // Capture stdout, stderr, and stdin
                env: {
                    ...process.env,
                    // Ensure test environment variables are properly set
                    NODE_ENV: 'test',
                    FORCE_COLOR: '1', // Enable colored output for better readability
                    NO_COLOR: '0'     // Disable color stripping for CI/CD environments
                }
            });
            
            // Step 5: Pipe stdout and stderr from the child process to the parent process
            // This provides real-time feedback during test execution, essential for
            // development workflows and CI/CD pipeline monitoring
            testProcess.stdout.setEncoding('utf8');
            testProcess.stderr.setEncoding('utf8');
            
            // Handle real-time stdout data (test results, success messages)
            testProcess.stdout.on('data', (data) => {
                // Forward test output directly to console for real-time feedback
                process.stdout.write(data);
            });
            
            // Handle real-time stderr data (error messages, warnings)
            testProcess.stderr.on('data', (data) => {
                // Forward error output directly to console for immediate visibility
                process.stderr.write(data);
            });
            
            // Step 6: Await process completion and capture the exit code
            // This ensures proper handling of test success/failure conditions
            const exitCode = await new Promise((resolve, reject) => {
                // Handle process completion
                testProcess.on('close', (code) => {
                    console.log(`\n📊 Test runner process completed with exit code: ${code}`);
                    resolve(code);
                });
                
                // Handle process errors (e.g., Node.js not found, spawn failures)
                testProcess.on('error', (error) => {
                    console.error(`\n❌ Test runner process error: ${error.message}`);
                    reject(error);
                });
                
                // Handle unexpected process termination
                testProcess.on('exit', (code, signal) => {
                    if (signal) {
                        console.error(`\n⚠️  Test runner process terminated by signal: ${signal}`);
                        reject(new Error(`Process terminated by signal: ${signal}`));
                    }
                });
            });
            
            // Step 7: Handle exit code and provide appropriate feedback
            if (exitCode !== 0) {
                // Test failures detected - log summary and exit with error code
                console.error(`\n🔴 Test execution failed with exit code: ${exitCode}`);
                console.error(`💡 Review the test output above for detailed failure information`);
                console.error(`🔍 Common issues: failing assertions, syntax errors, or timeout exceeded`);
                
                // Exit the script with the same code to propagate failure to CI/CD
                process.exit(exitCode);
            }
            
            // Step 8: Log success message for successful test completion
            console.log(`\n🎉 All tests completed successfully!`);
            console.log(`✅ Unit tests: Passed`);
            console.log(`✅ Integration tests: Passed`);
            console.log(`✅ Performance tests: Passed`);
            console.log(`📈 Test automation completed with zero failures`);
        });
        
    } catch (error) {
        // Comprehensive error handling for test execution failures
        console.error(`\n💥 Test execution encountered an unexpected error:`);
        console.error(`Error: ${error.message}`);
        
        // Provide debugging information for development troubleshooting
        if (error.code) {
            console.error(`Error Code: ${error.code}`);
        }
        
        if (error.stack) {
            console.error(`Stack trace:`);
            console.error(error.stack);
        }
        
        // Provide helpful troubleshooting guidance
        console.error(`\n🔧 Troubleshooting suggestions:`);
        console.error(`   - Verify Node.js version: node --version (should be 22.x)`);
        console.error(`   - Check test file patterns: ${ALL_TEST_GLOBS.join(', ')}`);
        console.error(`   - Ensure test files exist and are accessible`);
        console.error(`   - Verify project structure and working directory`);
        
        // Exit with error code to indicate failure
        process.exit(1);
    }
}

/**
 * Script entrypoint - executes when the script is run directly
 * This enables the script to be used both as a module (via import) and
 * as a standalone executable (via node src/test/scripts/run-tests.mjs)
 * 
 * Educational Purpose: Demonstrates the dual-purpose script pattern that
 * supports both programmatic usage and direct execution, a common pattern
 * in Node.js applications and CLI tools.
 */
if (import.meta.url === `file://${process.argv[1]}`) {
    // Script is being run directly (not imported)
    console.log(`🧪 Node.js Tutorial Test Runner`);
    console.log(`📅 Execution started: ${new Date().toISOString()}`);
    console.log(`🔧 Node.js version: ${process.version}`);
    console.log(`📂 Working directory: ${process.cwd()}`);
    
    // Execute the main test function with comprehensive error handling
    runAllTests()
        .then(() => {
            // Success: All tests completed successfully
            console.log(`\n🏆 Test automation completed successfully`);
            console.log(`📅 Execution completed: ${new Date().toISOString()}`);
            console.log(`🎯 Ready for development or deployment`);
            process.exit(0);
        })
        .catch((error) => {
            // Failure: Test execution encountered errors
            console.error(`\n💔 Test automation failed`);
            console.error(`📅 Execution failed: ${new Date().toISOString()}`);
            console.error(`⚠️  Error: ${error.message}`);
            
            // Exit with error code for CI/CD pipeline integration
            process.exit(1);
        });
}