// Node.js built-in test runner and assertion library - Node.js 22.x (built-in)
import { test, describe } from 'node:test';
import assert from 'node:assert';

// Import all expected exports from the test utility index module
import { 
    mockRequest, 
    mockResponse, 
    startTestServer, 
    httpRequest, 
    withTestConfig, 
    measureTime, 
    TEST_PORT, 
    TEST_HOST 
} from '../../../test/utils/index.mjs';

/**
 * Unit Test Suite for Test Utility Index Module
 * 
 * This test suite verifies that all core test helpers and constants are correctly
 * re-exported from the test utility index module (src/test/utils/index.mjs).
 * It ensures maintainability, DRY principles, and consistent test environments
 * by validating that the index module provides access to all helpers required
 * for mocking, server lifecycle management, HTTP requests, configuration overrides,
 * and performance measurement.
 * 
 * Educational Purpose:
 * This test demonstrates the importance of testing export interfaces and ensuring
 * that index modules correctly re-export all expected utilities. It validates
 * the barrel export pattern and ensures that refactoring or reorganization
 * doesn't break the unified import interface.
 * 
 * Test Strategy:
 * - Verify presence and type of all expected exports
 * - Test basic functionality of mock objects
 * - Validate that async functions return Promises
 * - Ensure constants have expected types and values
 * - Maintain test isolation and proper cleanup
 */

describe('Test Utility Index Module', () => {
    /**
     * Comprehensive test to verify all test helpers and constants are re-exported
     * from the test utility index module with correct types and basic functionality.
     * 
     * This test serves as a contract verification for the index module, ensuring
     * that all expected exports are available and of the correct type. It prevents
     * accidental omissions during refactoring and ensures API consistency.
     */
    test('should re-export all test helpers and constants', async () => {
        // Verify Mock HTTP Object Functions
        // These functions should exist and be callable, returning objects with expected properties
        assert.strictEqual(typeof mockRequest, 'function', 
            'mockRequest should be exported as a function');
        assert.strictEqual(typeof mockResponse, 'function', 
            'mockResponse should be exported as a function');
        
        // Test mockRequest functionality - should return an object with HTTP request properties
        const testRequest = mockRequest({ method: 'GET', url: '/test' });
        assert.strictEqual(typeof testRequest, 'object', 
            'mockRequest should return an object');
        assert.strictEqual(testRequest.method, 'GET', 
            'mockRequest should set method property correctly');
        assert.strictEqual(testRequest.url, '/test', 
            'mockRequest should set url property correctly');
        assert.strictEqual(typeof testRequest.headers, 'object', 
            'mockRequest should provide headers object');
        assert.strictEqual(typeof testRequest.on, 'function', 
            'mockRequest should provide EventEmitter interface with on method');
        assert.strictEqual(typeof testRequest.emit, 'function', 
            'mockRequest should provide EventEmitter interface with emit method');
        
        // Test mockResponse functionality - should return an object with HTTP response properties
        const testResponse = mockResponse({ statusCode: 200 });
        assert.strictEqual(typeof testResponse, 'object', 
            'mockResponse should return an object');
        assert.strictEqual(testResponse.statusCode, 200, 
            'mockResponse should set statusCode property correctly');
        assert.strictEqual(typeof testResponse.setHeader, 'function', 
            'mockResponse should provide setHeader method');
        assert.strictEqual(typeof testResponse.write, 'function', 
            'mockResponse should provide write method');
        assert.strictEqual(typeof testResponse.end, 'function', 
            'mockResponse should provide end method');
        assert.strictEqual(typeof testResponse.getBody, 'function', 
            'mockResponse should provide getBody method for test assertions');
        assert.strictEqual(typeof testResponse.on, 'function', 
            'mockResponse should provide EventEmitter interface with on method');
        assert.strictEqual(typeof testResponse.emit, 'function', 
            'mockResponse should provide EventEmitter interface with emit method');
        
        // Verify Server Lifecycle Management Functions
        // These functions should exist and return Promises for async operations
        assert.strictEqual(typeof startTestServer, 'function', 
            'startTestServer should be exported as a function');
        
        // Test startTestServer returns a Promise
        const startServerResult = startTestServer(() => {});
        assert.ok(startServerResult instanceof Promise, 
            'startTestServer should return a Promise');
        
        // Clean up the test server to prevent resource leaks
        try {
            const testServer = await startServerResult;
            if (testServer && typeof testServer.close === 'function') {
                await new Promise((resolve, reject) => {
                    testServer.close((error) => {
                        if (error) reject(error);
                        else resolve();
                    });
                });
            }
        } catch (error) {
            // Test server cleanup failed, but this shouldn't fail the test
            // as we're only testing the export interface
        }
        
        // Verify HTTP Request Utilities
        // These functions should exist and return Promises for async operations
        assert.strictEqual(typeof httpRequest, 'function', 
            'httpRequest should be exported as a function');
        
        // Test httpRequest returns a Promise
        const httpRequestResult = httpRequest({ method: 'GET', path: '/test' });
        assert.ok(httpRequestResult instanceof Promise, 
            'httpRequest should return a Promise');
        
        // Note: We don't await httpRequest as it would require a running server
        // The test focuses on export interface validation rather than full integration
        
        // Verify Configuration Override Utilities
        // These functions should exist and return Promises for async operations
        assert.strictEqual(typeof withTestConfig, 'function', 
            'withTestConfig should be exported as a function');
        
        // Test withTestConfig returns a Promise
        const configTestResult = withTestConfig({ TEST_VAR: 'test' }, async () => {
            return 'test-result';
        });
        assert.ok(configTestResult instanceof Promise, 
            'withTestConfig should return a Promise');
        
        // Verify withTestConfig actually executes the test function
        const configResult = await configTestResult;
        assert.strictEqual(configResult, 'test-result', 
            'withTestConfig should execute test function and return result');
        
        // Verify Performance Measurement Utilities
        // These functions should exist and return Promises for async operations
        assert.strictEqual(typeof measureTime, 'function', 
            'measureTime should be exported as a function');
        
        // Test measureTime returns a Promise and provides timing information
        const measureTimeResult = measureTime(async () => {
            // Simple async operation to measure
            await new Promise(resolve => setTimeout(resolve, 10));
            return 'measured-result';
        });
        assert.ok(measureTimeResult instanceof Promise, 
            'measureTime should return a Promise');
        
        // Verify measureTime provides result and timing information
        const timingResult = await measureTimeResult;
        assert.strictEqual(typeof timingResult, 'object', 
            'measureTime should return an object with result and timing');
        assert.strictEqual(timingResult.result, 'measured-result', 
            'measureTime should return the function result');
        assert.strictEqual(typeof timingResult.ms, 'number', 
            'measureTime should return timing information in milliseconds');
        assert.ok(timingResult.ms >= 0, 
            'measureTime should return non-negative timing values');
        
        // Verify Test Server Constants
        // These constants should exist and have expected types and values
        assert.strictEqual(typeof TEST_PORT, 'number', 
            'TEST_PORT should be exported as a number');
        assert.strictEqual(typeof TEST_HOST, 'string', 
            'TEST_HOST should be exported as a string');
        
        // Verify constant values are appropriate for testing
        assert.ok(TEST_PORT > 0 && TEST_PORT < 65536, 
            'TEST_PORT should be a valid port number');
        assert.ok(TEST_HOST.length > 0, 
            'TEST_HOST should be a non-empty string');
        
        // Additional validation that constants are reasonable for testing
        assert.ok(TEST_PORT >= 3000, 
            'TEST_PORT should be in development/testing range (>= 3000)');
        assert.ok(TEST_HOST === '127.0.0.1' || TEST_HOST === 'localhost', 
            'TEST_HOST should be localhost or 127.0.0.1 for testing');
        
        // Test Summary Log
        // This provides visibility into test execution for educational purposes
        console.log('✓ All test helpers and constants verified successfully');
        console.log('✓ Mock objects provide expected interfaces');
        console.log('✓ Async functions return Promises');
        console.log('✓ Constants have appropriate types and values');
        console.log('✓ Test utility index module exports are complete and functional');
    });
    
    /**
     * Additional test to verify error handling and edge cases in exported functions.
     * This ensures the re-exported functions maintain their error handling behavior.
     */
    test('should maintain error handling behavior in re-exported functions', async () => {
        // Test mockResponse error handling for invalid operations
        const testResponse = mockResponse();
        
        // Test that ending response twice throws error
        testResponse.end('first end');
        assert.throws(() => {
            testResponse.end('second end');
        }, /already ended/, 'mockResponse should throw error when ended twice');
        
        // Test that writing after end throws error
        assert.throws(() => {
            testResponse.write('write after end');
        }, /after response has ended/, 'mockResponse should throw error when writing after end');
        
        // Test withTestConfig error handling
        try {
            await withTestConfig({ TEST_ERROR: 'true' }, async () => {
                throw new Error('Test function error');
            });
            assert.fail('withTestConfig should propagate errors from test function');
        } catch (error) {
            assert.strictEqual(error.message, 'Test function error', 
                'withTestConfig should propagate test function errors');
        }
        
        // Verify environment is restored after error
        assert.strictEqual(process.env.TEST_ERROR, undefined, 
            'withTestConfig should restore environment after error');
        
        console.log('✓ Error handling behavior maintained in re-exported functions');
    });
    
    /**
     * Test to verify that all exports are truly re-exported from the index
     * and not implemented directly in the index file (ensuring proper barrel export pattern).
     */
    test('should properly implement barrel export pattern', async () => {
        // Import the same functions from testHelpers directly for comparison
        const { 
            mockRequest: directMockRequest,
            mockResponse: directMockResponse,
            startTestServer: directStartTestServer,
            httpRequest: directHttpRequest,
            withTestConfig: directWithTestConfig,
            measureTime: directMeasureTime,
            TEST_PORT: directTEST_PORT,
            TEST_HOST: directTEST_HOST
        } = await import('../../../test/utils/testHelpers.mjs');
        
        // Verify that re-exported functions are the same as direct exports
        assert.strictEqual(mockRequest, directMockRequest, 
            'mockRequest should be re-exported from testHelpers, not reimplemented');
        assert.strictEqual(mockResponse, directMockResponse, 
            'mockResponse should be re-exported from testHelpers, not reimplemented');
        assert.strictEqual(startTestServer, directStartTestServer, 
            'startTestServer should be re-exported from testHelpers, not reimplemented');
        assert.strictEqual(httpRequest, directHttpRequest, 
            'httpRequest should be re-exported from testHelpers, not reimplemented');
        assert.strictEqual(withTestConfig, directWithTestConfig, 
            'withTestConfig should be re-exported from testHelpers, not reimplemented');
        assert.strictEqual(measureTime, directMeasureTime, 
            'measureTime should be re-exported from testHelpers, not reimplemented');
        assert.strictEqual(TEST_PORT, directTEST_PORT, 
            'TEST_PORT should be re-exported from testHelpers, not redefined');
        assert.strictEqual(TEST_HOST, directTEST_HOST, 
            'TEST_HOST should be re-exported from testHelpers, not redefined');
        
        console.log('✓ Barrel export pattern correctly implemented');
        console.log('✓ All exports are properly re-exported from testHelpers.mjs');
    });
    
    /**
     * Test to verify that the index module supports all common import patterns
     * expected by test files throughout the application.
     */
    test('should support all expected import patterns', async () => {
        // Test individual named imports (already tested above)
        assert.ok(mockRequest, 'Individual named import should work');
        
        // Test destructured imports with aliasing
        const { mockRequest: aliasedMockRequest } = await import('../../../test/utils/index.mjs');
        assert.strictEqual(typeof aliasedMockRequest, 'function', 
            'Aliased destructured import should work');
        
        // Test default import pattern (should not be available as this is a barrel export)
        const indexModule = await import('../../../test/utils/index.mjs');
        assert.strictEqual(typeof indexModule.default, 'undefined', 
            'Default export should not be available in barrel export pattern');
        
        // Test namespace import pattern
        const * as testUtils from '../../../test/utils/index.mjs';
        assert.strictEqual(typeof testUtils.mockRequest, 'function', 
            'Namespace import should provide all exports');
        assert.strictEqual(typeof testUtils.TEST_PORT, 'number', 
            'Namespace import should provide all constants');
        
        console.log('✓ All expected import patterns supported correctly');
    });
});