// Node.js built-in test runner for defining unit test cases and test suites
import { test } from 'node:test'; // Node.js 22.x (built-in)

// Node.js built-in assertion library for test validations and verifications
import assert from 'node:assert'; // Node.js 22.x (built-in)

// Import the getConfig function to be tested - loads and validates server configuration
import { getConfig } from '../../../backend/config.mjs';

// Import test helper for safely overriding environment variables during tests
import { withTestConfig } from '../../utils/index.mjs';

/**
 * Unit Test Suite: Configuration Loader Module
 * 
 * This test suite validates the getConfig function's behavior under various scenarios
 * including environment variable overrides, default fallbacks, and invalid input handling.
 * The tests ensure that configuration logic is robust, protocol-compliant, and educationally
 * clear while supporting maintainability and testability requirements.
 * 
 * Test Coverage Areas:
 * - Default configuration values when no environment variables are set
 * - Environment variable override functionality for valid values
 * - Input validation and fallback behavior for invalid PORT values
 * - Input validation and fallback behavior for invalid HOST values  
 * - Input validation and fallback behavior for invalid NODE_ENV values
 * - Environment isolation and restoration after test execution
 * 
 * Educational Objectives:
 * - Demonstrates comprehensive unit testing patterns for configuration logic
 * - Shows how to test environment variable handling and validation
 * - Illustrates test isolation techniques using withTestConfig helper
 * - Provides examples of edge case testing and error handling validation
 */

/**
 * Test Case: Default Configuration Values
 * 
 * Verifies that getConfig returns the expected default configuration values
 * (port 3000, host 'localhost', env 'development') when no relevant environment
 * variables are set. This test ensures the function provides sensible defaults
 * for all required configuration parameters.
 */
test('should return default config when no environment variables are set', async () => {
    await withTestConfig(
        {
            // Clear all configuration-related environment variables
            PORT: undefined,
            HOST: undefined,
            NODE_ENV: undefined
        },
        async () => {
            // Execute the configuration loading function
            const config = getConfig();
            
            // Validate that all default values are returned correctly
            assert.strictEqual(config.port, 3000, 'Default port should be 3000');
            assert.strictEqual(config.host, 'localhost', 'Default host should be localhost');
            assert.strictEqual(config.env, 'development', 'Default environment should be development');
            
            // Verify that the returned object has the expected structure
            assert.ok(typeof config === 'object', 'Config should be an object');
            assert.ok(typeof config.port === 'number', 'Port should be a number');
            assert.ok(typeof config.host === 'string', 'Host should be a string');
            assert.ok(typeof config.env === 'string', 'Environment should be a string');
        }
    );
});

/**
 * Test Case: Environment Variable Override Functionality
 * 
 * Verifies that getConfig correctly uses PORT, HOST, and NODE_ENV from process.env
 * when they are set to valid values. This test ensures that the configuration
 * system properly respects environment-based configuration overrides.
 */
test('should use environment variables for config when set', async () => {
    await withTestConfig(
        {
            // Set valid environment variable values for testing
            PORT: '4000',
            HOST: '127.0.0.1',
            NODE_ENV: 'test'
        },
        async () => {
            // Execute the configuration loading function
            const config = getConfig();
            
            // Validate that environment variables are correctly parsed and used
            assert.strictEqual(config.port, 4000, 'Port should be parsed from PORT environment variable');
            assert.strictEqual(config.host, '127.0.0.1', 'Host should be taken from HOST environment variable');
            assert.strictEqual(config.env, 'test', 'Environment should be taken from NODE_ENV environment variable');
            
            // Verify data types are correctly maintained after parsing
            assert.ok(typeof config.port === 'number', 'Port should be converted to number');
            assert.ok(typeof config.host === 'string', 'Host should remain as string');
            assert.ok(typeof config.env === 'string', 'Environment should remain as string');
        }
    );
});

/**
 * Test Case: Invalid PORT Value Handling
 * 
 * Verifies that getConfig falls back to the default port (3000) when PORT
 * is set to invalid values including non-numeric strings, values below the
 * minimum port range (1025), and values above the maximum port range (65535).
 * This test ensures robust input validation and safe fallback behavior.
 */
test('should fallback to default port if PORT is invalid', async () => {
    // Test Case 1: Non-numeric PORT value
    await withTestConfig(
        {
            PORT: 'notanumber'
        },
        async () => {
            const config = getConfig();
            assert.strictEqual(config.port, 3000, 'Should fallback to default port when PORT is not a number');
        }
    );
    
    // Test Case 2: PORT value below minimum allowed range
    await withTestConfig(
        {
            PORT: '1024'  // Below MIN_PORT (1025)
        },
        async () => {
            const config = getConfig();
            assert.strictEqual(config.port, 3000, 'Should fallback to default port when PORT is below minimum range');
        }
    );
    
    // Test Case 3: PORT value above maximum allowed range
    await withTestConfig(
        {
            PORT: '70000'  // Above MAX_PORT (65535)
        },
        async () => {
            const config = getConfig();
            assert.strictEqual(config.port, 3000, 'Should fallback to default port when PORT is above maximum range');
        }
    );
    
    // Test Case 4: Empty PORT value
    await withTestConfig(
        {
            PORT: ''
        },
        async () => {
            const config = getConfig();
            assert.strictEqual(config.port, 3000, 'Should fallback to default port when PORT is empty string');
        }
    );
    
    // Test Case 5: Zero PORT value (invalid)
    await withTestConfig(
        {
            PORT: '0'
        },
        async () => {
            const config = getConfig();
            assert.strictEqual(config.port, 3000, 'Should fallback to default port when PORT is zero');
        }
    );
});

/**
 * Test Case: Invalid HOST Value Handling
 * 
 * Verifies that getConfig falls back to the default host ('localhost') when HOST
 * is set to invalid values including empty strings, whitespace-only strings, or
 * other invalid host formats. This test ensures robust host validation and
 * safe fallback behavior for network binding.
 */
test('should fallback to default host if HOST is invalid', async () => {
    // Test Case 1: Empty HOST value
    await withTestConfig(
        {
            HOST: ''
        },
        async () => {
            const config = getConfig();
            assert.strictEqual(config.host, 'localhost', 'Should fallback to default host when HOST is empty string');
        }
    );
    
    // Test Case 2: Whitespace-only HOST value
    await withTestConfig(
        {
            HOST: '   '
        },
        async () => {
            const config = getConfig();
            assert.strictEqual(config.host, 'localhost', 'Should fallback to default host when HOST is whitespace only');
        }
    );
    
    // Test Case 3: Tab and newline characters in HOST
    await withTestConfig(
        {
            HOST: '\t\n'
        },
        async () => {
            const config = getConfig();
            assert.strictEqual(config.host, 'localhost', 'Should fallback to default host when HOST contains only whitespace characters');
        }
    );
});

/**
 * Test Case: Invalid NODE_ENV Value Handling
 * 
 * Verifies that getConfig falls back to the default environment ('development')
 * when NODE_ENV is set to invalid values including empty strings or whitespace-only
 * strings. This test ensures robust environment validation and safe fallback
 * behavior for application environment configuration.
 */
test('should fallback to default env if NODE_ENV is invalid', async () => {
    // Test Case 1: Empty NODE_ENV value
    await withTestConfig(
        {
            NODE_ENV: ''
        },
        async () => {
            const config = getConfig();
            assert.strictEqual(config.env, 'development', 'Should fallback to default environment when NODE_ENV is empty string');
        }
    );
    
    // Test Case 2: Whitespace-only NODE_ENV value
    await withTestConfig(
        {
            NODE_ENV: '   '
        },
        async () => {
            const config = getConfig();
            assert.strictEqual(config.env, 'development', 'Should fallback to default environment when NODE_ENV is whitespace only');
        }
    );
    
    // Test Case 3: Tab and newline characters in NODE_ENV
    await withTestConfig(
        {
            NODE_ENV: '\t\n\r'
        },
        async () => {
            const config = getConfig();
            assert.strictEqual(config.env, 'development', 'Should fallback to default environment when NODE_ENV contains only whitespace characters');
        }
    );
});

/**
 * Test Case: Environment Variable Isolation and Restoration
 * 
 * Ensures that withTestConfig properly restores process.env to its original state
 * after test execution, preventing side effects between tests. This test validates
 * the test isolation mechanism and verifies that environment variables are not
 * permanently modified by test operations.
 */
test('should not mutate process.env after test', async () => {
    // Save original values of environment variables before test
    const originalPort = process.env.PORT;
    const originalHost = process.env.HOST;
    const originalNodeEnv = process.env.NODE_ENV;
    
    // Execute test with temporary environment variable overrides
    await withTestConfig(
        {
            PORT: '8080',
            HOST: '0.0.0.0',
            NODE_ENV: 'testing'
        },
        async () => {
            // Call getConfig to verify it works with test overrides
            const config = getConfig();
            
            // Verify that the test overrides are active during test execution
            assert.strictEqual(config.port, 8080, 'Test override should be active during test execution');
            assert.strictEqual(config.host, '0.0.0.0', 'Test override should be active during test execution');
            assert.strictEqual(config.env, 'testing', 'Test override should be active during test execution');
        }
    );
    
    // After withTestConfig completes, verify that original values are restored
    assert.strictEqual(process.env.PORT, originalPort, 'PORT should be restored to original value after test');
    assert.strictEqual(process.env.HOST, originalHost, 'HOST should be restored to original value after test');
    assert.strictEqual(process.env.NODE_ENV, originalNodeEnv, 'NODE_ENV should be restored to original value after test');
});

/**
 * Test Case: Valid Environment Variable Edge Cases
 * 
 * Tests edge cases for valid environment variable values to ensure the configuration
 * system correctly handles boundary conditions and special valid values.
 */
test('should handle valid environment variable edge cases', async () => {
    // Test Case 1: Minimum valid port
    await withTestConfig(
        {
            PORT: '1025'  // Minimum valid port
        },
        async () => {
            const config = getConfig();
            assert.strictEqual(config.port, 1025, 'Should accept minimum valid port value');
        }
    );
    
    // Test Case 2: Maximum valid port
    await withTestConfig(
        {
            PORT: '65535'  // Maximum valid port
        },
        async () => {
            const config = getConfig();
            assert.strictEqual(config.port, 65535, 'Should accept maximum valid port value');
        }
    );
    
    // Test Case 3: Host with valid trimming
    await withTestConfig(
        {
            HOST: '  192.168.1.1  '  // Host with surrounding whitespace
        },
        async () => {
            const config = getConfig();
            assert.strictEqual(config.host, '192.168.1.1', 'Should trim whitespace from valid host value');
        }
    );
    
    // Test Case 4: Environment with valid trimming
    await withTestConfig(
        {
            NODE_ENV: '  production  '  // Environment with surrounding whitespace
        },
        async () => {
            const config = getConfig();
            assert.strictEqual(config.env, 'production', 'Should trim whitespace from valid environment value');
        }
    );
});

/**
 * Test Case: Configuration Object Structure Validation
 * 
 * Verifies that the configuration object returned by getConfig has the expected
 * structure, properties, and data types under all test scenarios. This test
 * ensures consistent API behavior and helps catch structural changes.
 */
test('should return consistent configuration object structure', async () => {
    await withTestConfig(
        {
            PORT: '5000',
            HOST: 'example.com',
            NODE_ENV: 'staging'
        },
        async () => {
            const config = getConfig();
            
            // Verify object structure and property existence
            assert.ok(config.hasOwnProperty('port'), 'Config should have port property');
            assert.ok(config.hasOwnProperty('host'), 'Config should have host property');
            assert.ok(config.hasOwnProperty('env'), 'Config should have env property');
            
            // Verify property count (should not have extra properties)
            const expectedKeys = ['port', 'host', 'env'];
            const actualKeys = Object.keys(config);
            assert.strictEqual(actualKeys.length, expectedKeys.length, 'Config should have exactly 3 properties');
            
            // Verify all expected keys are present
            expectedKeys.forEach(key => {
                assert.ok(actualKeys.includes(key), `Config should include ${key} property`);
            });
            
            // Verify data types
            assert.strictEqual(typeof config.port, 'number', 'Port should be a number');
            assert.strictEqual(typeof config.host, 'string', 'Host should be a string');
            assert.strictEqual(typeof config.env, 'string', 'Environment should be a string');
            
            // Verify value ranges and constraints
            assert.ok(config.port >= 1025 && config.port <= 65535, 'Port should be within valid range');
            assert.ok(config.host.length > 0, 'Host should not be empty');
            assert.ok(config.env.length > 0, 'Environment should not be empty');
        }
    );
});