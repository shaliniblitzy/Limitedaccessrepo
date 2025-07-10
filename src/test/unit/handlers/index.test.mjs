// Node.js built-in test runner for defining and running unit test cases
import { test, describe } from 'node:test'; // Node.js 22.x (built-in)

// Node.js built-in assertion library for performing test assertions
import { assert } from 'node:assert'; // Node.js 22.x (built-in)

// Import all handler functions from the handler index module for testing
// This verifies the handler index correctly re-exports all handler functions
import { 
    handleHello, 
    handleNotFound, 
    handleMethodNotAllowed, 
    handleServerError 
} from '../../../backend/handlers/index.mjs';

// Import test utilities for creating mock HTTP request and response objects
// These utilities enable unit testing in isolation without actual HTTP server dependencies
import { mockRequest, mockResponse } from '../../utils/index.mjs';

/**
 * Unit Test Suite for Handler Index Module
 * 
 * This test suite verifies that the handler index module (src/backend/handlers/index.mjs)
 * correctly re-exports all handler functions and that each handler functions properly
 * when invoked with mock HTTP request/response objects.
 * 
 * Educational Purpose:
 * - Demonstrates unit testing patterns for HTTP handlers
 * - Shows how to use mock objects for testing in isolation
 * - Validates the handler index as a reliable central export point
 * - Ensures handler functions maintain expected behavior and contracts
 * 
 * Test Coverage:
 * - Function existence and type validation
 * - Handler invocation with mock request/response objects
 * - Response status code validation
 * - Response header validation
 * - Response body content validation
 * - Error handling behavior validation
 */
describe('Handler index module', () => {
    /**
     * Test Category: Function Export Validation
     * 
     * These tests verify that all expected handler functions are properly exported
     * from the handler index module and are callable functions.
     */
    
    test('should export handleHello as a function', () => {
        // Verify that handleHello is exported from the handler index
        assert.ok(handleHello, 'handleHello should be exported');
        
        // Verify that handleHello is a function
        assert.strictEqual(typeof handleHello, 'function', 'handleHello should be a function');
        
        // Verify that handleHello has the expected function signature (accepts 2 parameters)
        assert.strictEqual(handleHello.length, 2, 'handleHello should accept 2 parameters (req, res)');
    });
    
    test('should export handleNotFound as a function', () => {
        // Verify that handleNotFound is exported from the handler index
        assert.ok(handleNotFound, 'handleNotFound should be exported');
        
        // Verify that handleNotFound is a function
        assert.strictEqual(typeof handleNotFound, 'function', 'handleNotFound should be a function');
        
        // Verify that handleNotFound has the expected function signature (accepts 2 parameters)
        assert.strictEqual(handleNotFound.length, 2, 'handleNotFound should accept 2 parameters (req, res)');
    });
    
    test('should export handleMethodNotAllowed as a function', () => {
        // Verify that handleMethodNotAllowed is exported from the handler index
        assert.ok(handleMethodNotAllowed, 'handleMethodNotAllowed should be exported');
        
        // Verify that handleMethodNotAllowed is a function
        assert.strictEqual(typeof handleMethodNotAllowed, 'function', 'handleMethodNotAllowed should be a function');
        
        // Verify that handleMethodNotAllowed has the expected function signature (accepts 3 parameters)
        assert.strictEqual(handleMethodNotAllowed.length, 3, 'handleMethodNotAllowed should accept 3 parameters (req, res, allowedMethods)');
    });
    
    test('should export handleServerError as a function', () => {
        // Verify that handleServerError is exported from the handler index
        assert.ok(handleServerError, 'handleServerError should be exported');
        
        // Verify that handleServerError is a function
        assert.strictEqual(typeof handleServerError, 'function', 'handleServerError should be a function');
        
        // Verify that handleServerError has the expected function signature (accepts 3 parameters)
        assert.strictEqual(handleServerError.length, 3, 'handleServerError should accept 3 parameters (req, res, error)');
    });
    
    /**
     * Test Category: Handler Functionality Validation
     * 
     * These tests verify that each handler function works correctly when invoked
     * with mock HTTP request/response objects, validating response behavior.
     */
    
    test('handleHello should send correct hello world response', () => {
        // Create mock request object for GET /hello
        const mockReq = mockRequest({
            method: 'GET',
            url: '/hello',
            headers: {
                'user-agent': 'test-agent/1.0',
                'host': 'localhost:3000'
            }
        });
        
        // Create mock response object to capture handler output
        const mockRes = mockResponse();
        
        // Invoke handleHello with mock request and response objects
        handleHello(mockReq, mockRes);
        
        // Verify that the response status code is 200 (OK)
        assert.strictEqual(mockRes.statusCode, 200, 'Response status code should be 200');
        
        // Verify that the Content-Type header is set correctly
        assert.strictEqual(
            mockRes.getHeader('Content-Type'), 
            'text/plain; charset=utf-8', 
            'Content-Type header should be text/plain; charset=utf-8'
        );
        
        // Verify that the Connection header is set correctly
        assert.strictEqual(
            mockRes.getHeader('Connection'), 
            'keep-alive', 
            'Connection header should be keep-alive'
        );
        
        // Verify that the response body contains "Hello world"
        assert.strictEqual(
            mockRes.getBody(), 
            'Hello world', 
            'Response body should contain "Hello world"'
        );
        
        // Verify that the response has been ended
        assert.ok(mockRes.isEnded(), 'Response should be ended after processing');
        
        // Verify that headers have been sent
        assert.ok(mockRes.headersSent, 'Headers should be sent after processing');
    });
    
    test('handleNotFound should send correct 404 response', () => {
        // Create mock request object for undefined route
        const mockReq = mockRequest({
            method: 'GET',
            url: '/undefined-route',
            headers: {
                'user-agent': 'test-agent/1.0',
                'host': 'localhost:3000'
            }
        });
        
        // Create mock response object to capture handler output
        const mockRes = mockResponse();
        
        // Invoke handleNotFound with mock request and response objects
        handleNotFound(mockReq, mockRes);
        
        // Verify that the response status code is 404 (Not Found)
        assert.strictEqual(mockRes.statusCode, 404, 'Response status code should be 404');
        
        // Verify that the Content-Type header is set correctly
        assert.strictEqual(
            mockRes.getHeader('Content-Type'), 
            'text/plain; charset=utf-8', 
            'Content-Type header should be text/plain; charset=utf-8'
        );
        
        // Verify that the Connection header is set correctly
        assert.strictEqual(
            mockRes.getHeader('Connection'), 
            'keep-alive', 
            'Connection header should be keep-alive'
        );
        
        // Verify that the response body contains "Not Found"
        assert.strictEqual(
            mockRes.getBody(), 
            'Not Found', 
            'Response body should contain "Not Found"'
        );
        
        // Verify that the response has been ended
        assert.ok(mockRes.isEnded(), 'Response should be ended after processing');
        
        // Verify that headers have been sent
        assert.ok(mockRes.headersSent, 'Headers should be sent after processing');
    });
    
    test('handleMethodNotAllowed should send correct 405 response and Allow header', () => {
        // Create mock request object for unsupported method
        const mockReq = mockRequest({
            method: 'POST',
            url: '/hello',
            headers: {
                'user-agent': 'test-agent/1.0',
                'host': 'localhost:3000'
            }
        });
        
        // Create mock response object to capture handler output
        const mockRes = mockResponse();
        
        // Define allowed methods for the endpoint
        const allowedMethods = ['GET', 'HEAD'];
        
        // Invoke handleMethodNotAllowed with mock request, response, and allowed methods
        handleMethodNotAllowed(mockReq, mockRes, allowedMethods);
        
        // Verify that the response status code is 405 (Method Not Allowed)
        assert.strictEqual(mockRes.statusCode, 405, 'Response status code should be 405');
        
        // Verify that the Content-Type header is set correctly
        assert.strictEqual(
            mockRes.getHeader('Content-Type'), 
            'text/plain; charset=utf-8', 
            'Content-Type header should be text/plain; charset=utf-8'
        );
        
        // Verify that the Connection header is set correctly
        assert.strictEqual(
            mockRes.getHeader('Connection'), 
            'keep-alive', 
            'Connection header should be keep-alive'
        );
        
        // Verify that the Allow header is set correctly with allowed methods
        assert.strictEqual(
            mockRes.getHeader('Allow'), 
            'GET, HEAD', 
            'Allow header should contain allowed methods'
        );
        
        // Verify that the response body contains "Method Not Allowed"
        assert.strictEqual(
            mockRes.getBody(), 
            'Method Not Allowed', 
            'Response body should contain "Method Not Allowed"'
        );
        
        // Verify that the response has been ended
        assert.ok(mockRes.isEnded(), 'Response should be ended after processing');
        
        // Verify that headers have been sent
        assert.ok(mockRes.headersSent, 'Headers should be sent after processing');
    });
    
    test('handleMethodNotAllowed should handle empty allowed methods array', () => {
        // Create mock request object for unsupported method
        const mockReq = mockRequest({
            method: 'POST',
            url: '/hello',
            headers: {
                'user-agent': 'test-agent/1.0',
                'host': 'localhost:3000'
            }
        });
        
        // Create mock response object to capture handler output
        const mockRes = mockResponse();
        
        // Test with empty allowed methods array
        const allowedMethods = [];
        
        // Invoke handleMethodNotAllowed with empty allowed methods
        handleMethodNotAllowed(mockReq, mockRes, allowedMethods);
        
        // Verify that the response status code is 405 (Method Not Allowed)
        assert.strictEqual(mockRes.statusCode, 405, 'Response status code should be 405');
        
        // Verify that the Allow header defaults to GET
        assert.strictEqual(
            mockRes.getHeader('Allow'), 
            'GET', 
            'Allow header should default to GET for empty allowed methods'
        );
        
        // Verify that the response body contains "Method Not Allowed"
        assert.strictEqual(
            mockRes.getBody(), 
            'Method Not Allowed', 
            'Response body should contain "Method Not Allowed"'
        );
    });
    
    test('handleServerError should send correct 500 response', () => {
        // Create mock request object for server error scenario
        const mockReq = mockRequest({
            method: 'GET',
            url: '/hello',
            headers: {
                'user-agent': 'test-agent/1.0',
                'host': 'localhost:3000'
            }
        });
        
        // Create mock response object to capture handler output
        const mockRes = mockResponse();
        
        // Create a sample error object for testing
        const testError = new Error('Test error for unit testing');
        testError.stack = 'Error: Test error for unit testing\n    at test (test.mjs:1:1)';
        
        // Invoke handleServerError with mock request, response, and error
        handleServerError(mockReq, mockRes, testError);
        
        // Verify that the response status code is 500 (Internal Server Error)
        assert.strictEqual(mockRes.statusCode, 500, 'Response status code should be 500');
        
        // Verify that the Content-Type header is set correctly
        assert.strictEqual(
            mockRes.getHeader('Content-Type'), 
            'text/plain; charset=utf-8', 
            'Content-Type header should be text/plain; charset=utf-8'
        );
        
        // Verify that the Connection header is set correctly
        assert.strictEqual(
            mockRes.getHeader('Connection'), 
            'keep-alive', 
            'Connection header should be keep-alive'
        );
        
        // Verify that the response body contains generic error message
        assert.strictEqual(
            mockRes.getBody(), 
            'Internal Server Error', 
            'Response body should contain "Internal Server Error"'
        );
        
        // Verify that the response has been ended
        assert.ok(mockRes.isEnded(), 'Response should be ended after processing');
        
        // Verify that headers have been sent
        assert.ok(mockRes.headersSent, 'Headers should be sent after processing');
    });
    
    test('handleServerError should handle missing error parameter', () => {
        // Create mock request object for server error scenario
        const mockReq = mockRequest({
            method: 'GET',
            url: '/hello',
            headers: {
                'user-agent': 'test-agent/1.0',
                'host': 'localhost:3000'
            }
        });
        
        // Create mock response object to capture handler output
        const mockRes = mockResponse();
        
        // Invoke handleServerError without error parameter
        handleServerError(mockReq, mockRes);
        
        // Verify that the response status code is 500 (Internal Server Error)
        assert.strictEqual(mockRes.statusCode, 500, 'Response status code should be 500');
        
        // Verify that the response body contains generic error message
        assert.strictEqual(
            mockRes.getBody(), 
            'Internal Server Error', 
            'Response body should contain "Internal Server Error"'
        );
        
        // Verify that the response has been ended
        assert.ok(mockRes.isEnded(), 'Response should be ended after processing');
    });
    
    /**
     * Test Category: Handler Index Synchronization Validation
     * 
     * These tests verify that the handler index remains in sync with the underlying
     * handler modules and doesn't include unexpected exports.
     */
    
    test('should only export expected handler functions', () => {
        // Import the entire handler index module to check all exports
        import('../../../backend/handlers/index.mjs').then(handlerModule => {
            // Get all exported names from the handler module
            const exportedNames = Object.keys(handlerModule);
            
            // Define the expected handler function names
            const expectedHandlers = [
                'handleHello',
                'handleNotFound', 
                'handleMethodNotAllowed',
                'handleServerError'
            ];
            
            // Verify that all expected handlers are exported
            expectedHandlers.forEach(handlerName => {
                assert.ok(
                    exportedNames.includes(handlerName), 
                    `Expected handler ${handlerName} should be exported`
                );
            });
            
            // Verify that no unexpected exports are present
            exportedNames.forEach(exportedName => {
                assert.ok(
                    expectedHandlers.includes(exportedName), 
                    `Unexpected export ${exportedName} should not be present`
                );
            });
            
            // Verify the exact number of exports
            assert.strictEqual(
                exportedNames.length, 
                expectedHandlers.length, 
                `Handler index should export exactly ${expectedHandlers.length} functions`
            );
        });
    });
    
    /**
     * Test Category: Handler Response Consistency Validation
     * 
     * These tests verify that all handlers maintain consistent response patterns
     * and adhere to HTTP protocol standards.
     */
    
    test('all handlers should set required HTTP headers', () => {
        // Test handleHello header consistency
        const helloReq = mockRequest({ method: 'GET', url: '/hello' });
        const helloRes = mockResponse();
        handleHello(helloReq, helloRes);
        
        // Verify required headers are present
        assert.ok(helloRes.hasHeader('Content-Type'), 'handleHello should set Content-Type header');
        assert.ok(helloRes.hasHeader('Connection'), 'handleHello should set Connection header');
        
        // Test handleNotFound header consistency
        const notFoundReq = mockRequest({ method: 'GET', url: '/undefined' });
        const notFoundRes = mockResponse();
        handleNotFound(notFoundReq, notFoundRes);
        
        // Verify required headers are present
        assert.ok(notFoundRes.hasHeader('Content-Type'), 'handleNotFound should set Content-Type header');
        assert.ok(notFoundRes.hasHeader('Connection'), 'handleNotFound should set Connection header');
        
        // Test handleMethodNotAllowed header consistency
        const methodNotAllowedReq = mockRequest({ method: 'POST', url: '/hello' });
        const methodNotAllowedRes = mockResponse();
        handleMethodNotAllowed(methodNotAllowedReq, methodNotAllowedRes, ['GET']);
        
        // Verify required headers are present
        assert.ok(methodNotAllowedRes.hasHeader('Content-Type'), 'handleMethodNotAllowed should set Content-Type header');
        assert.ok(methodNotAllowedRes.hasHeader('Connection'), 'handleMethodNotAllowed should set Connection header');
        assert.ok(methodNotAllowedRes.hasHeader('Allow'), 'handleMethodNotAllowed should set Allow header');
        
        // Test handleServerError header consistency
        const serverErrorReq = mockRequest({ method: 'GET', url: '/hello' });
        const serverErrorRes = mockResponse();
        handleServerError(serverErrorReq, serverErrorRes, new Error('Test error'));
        
        // Verify required headers are present
        assert.ok(serverErrorRes.hasHeader('Content-Type'), 'handleServerError should set Content-Type header');
        assert.ok(serverErrorRes.hasHeader('Connection'), 'handleServerError should set Connection header');
    });
    
    test('all handlers should properly end responses', () => {
        // Test each handler ends the response properly
        const handlers = [
            { name: 'handleHello', fn: handleHello, args: [mockRequest(), mockResponse()] },
            { name: 'handleNotFound', fn: handleNotFound, args: [mockRequest(), mockResponse()] },
            { name: 'handleMethodNotAllowed', fn: handleMethodNotAllowed, args: [mockRequest(), mockResponse(), ['GET']] },
            { name: 'handleServerError', fn: handleServerError, args: [mockRequest(), mockResponse(), new Error('Test')] }
        ];
        
        handlers.forEach(handler => {
            const [req, res] = handler.args;
            
            // Invoke the handler
            handler.fn(...handler.args);
            
            // Verify the response is properly ended
            assert.ok(res.isEnded(), `${handler.name} should end the response`);
            assert.ok(res.headersSent, `${handler.name} should mark headers as sent`);
        });
    });
    
    /**
     * Test Category: Error Handling and Edge Cases
     * 
     * These tests verify that handlers behave correctly in edge cases and
     * error conditions.
     */
    
    test('handlers should handle malformed request objects gracefully', () => {
        // Test with minimal request object
        const minimalReq = mockRequest({ method: undefined, url: undefined });
        const res = mockResponse();
        
        // handleHello should not throw with malformed request
        assert.doesNotThrow(() => {
            handleHello(minimalReq, res);
        }, 'handleHello should handle malformed request objects gracefully');
        
        // Response should still be valid
        assert.ok(res.isEnded(), 'Response should be ended even with malformed request');
    });
    
    test('handlers should handle requests with missing headers', () => {
        // Test with request object missing headers
        const reqWithoutHeaders = mockRequest({ 
            method: 'GET', 
            url: '/hello',
            headers: undefined 
        });
        const res = mockResponse();
        
        // handleHello should not throw with missing headers
        assert.doesNotThrow(() => {
            handleHello(reqWithoutHeaders, res);
        }, 'handleHello should handle requests with missing headers gracefully');
        
        // Response should still be valid
        assert.strictEqual(res.statusCode, 200, 'Response should have correct status code');
        assert.strictEqual(res.getBody(), 'Hello world', 'Response should have correct body');
    });
    
    test('handler index should maintain function references', () => {
        // Import handlers twice to verify they maintain consistent references
        import('../../../backend/handlers/index.mjs').then(firstImport => {
            import('../../../backend/handlers/index.mjs').then(secondImport => {
                // Verify that function references are consistent
                assert.strictEqual(
                    firstImport.handleHello, 
                    secondImport.handleHello,
                    'handleHello should maintain consistent function reference'
                );
                
                assert.strictEqual(
                    firstImport.handleNotFound, 
                    secondImport.handleNotFound,
                    'handleNotFound should maintain consistent function reference'
                );
                
                assert.strictEqual(
                    firstImport.handleMethodNotAllowed, 
                    secondImport.handleMethodNotAllowed,
                    'handleMethodNotAllowed should maintain consistent function reference'
                );
                
                assert.strictEqual(
                    firstImport.handleServerError, 
                    secondImport.handleServerError,
                    'handleServerError should maintain consistent function reference'
                );
            });
        });
    });
});