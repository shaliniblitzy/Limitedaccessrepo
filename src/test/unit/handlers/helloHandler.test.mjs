// Node.js built-in test runner for zero-dependency testing
import { test, describe, mock, beforeEach, afterEach } from 'node:test'; // Node.js 22.x (built-in)

// Node.js built-in assertion library for test validation
import assert from 'node:assert'; // Node.js 22.x (built-in)

// Import the handleHello function to be tested
import { handleHello } from '../../../../backend/handlers/helloHandler.mjs';

// Import test utilities for mocking HTTP request/response objects
import { mockRequest, mockResponse } from '../../../utils/index.mjs';

// Import logger utility for mocking and verification
import * as logger from '../../../../backend/utils/logger.mjs';

/**
 * Unit Test Suite for handleHello Function
 * 
 * This test suite verifies that the handleHello function correctly processes HTTP GET requests
 * to the '/hello' endpoint, sends the expected 'Hello world' response with proper status and
 * headers, and logs the appropriate events. The tests use mock request/response objects to
 * isolate handler logic and ensure protocol compliance, educational clarity, and robust
 * error-free operation.
 * 
 * Educational Purpose:
 * These tests demonstrate fundamental unit testing concepts including:
 * - Mocking HTTP request/response objects for isolation
 * - Verifying function behavior through assertions
 * - Testing asynchronous operations with promises
 * - Spying on function calls to verify side effects
 * - Comprehensive test coverage for all observable behaviors
 * 
 * Test Coverage:
 * - Response status code validation (200 OK)
 * - Response headers verification (Content-Type, Connection)
 * - Response body content validation ('Hello world')
 * - Logging behavior verification (request receipt and response delivery)
 * - Response stream ending validation
 * - Error handling and edge cases
 */
describe('handleHello unit tests', () => {
    // Store original logInfo function for restoration after tests
    let originalLogInfo;
    
    /**
     * Before each test, set up mocks and spies for isolated testing
     * This ensures each test runs independently without side effects
     */
    beforeEach(() => {
        // Store the original logInfo function
        originalLogInfo = logger.logInfo;
        
        // Create a mock function for logInfo to track calls
        logger.logInfo = mock.fn();
    });
    
    /**
     * After each test, restore original functions to prevent test pollution
     * This ensures the logger works normally outside of tests
     */
    afterEach(() => {
        // Restore the original logInfo function
        logger.logInfo = originalLogInfo;
        
        // Reset all mocks to clean state
        mock.reset();
    });
    
    /**
     * Test Case 1: Verify Complete Response Generation
     * 
     * This test verifies that handleHello sends a 200 OK response with the exact
     * 'Hello world' message and required headers when processing a GET request to '/hello'.
     * 
     * Educational Value:
     * - Demonstrates how to test HTTP response generation
     * - Shows proper use of mock objects for unit testing
     * - Illustrates asynchronous testing with promises and events
     * - Validates protocol compliance through header verification
     */
    test('should send Hello world response with 200 status and correct headers', async () => {
        // Step 1: Create a mock HTTP GET request object for '/hello'
        const mockReq = mockRequest({
            method: 'GET',
            url: '/hello',
            headers: {
                'user-agent': 'test-agent/1.0',
                'host': 'localhost:3000'
            }
        });
        
        // Step 2: Create a mock HTTP response object to capture output
        const mockRes = mockResponse();
        
        // Step 3: Create a promise to wait for the response 'finish' event
        const responsePromise = new Promise((resolve) => {
            mockRes.on('finish', resolve);
        });
        
        // Step 4: Invoke handleHello(req, res) with mock objects
        handleHello(mockReq, mockRes);
        
        // Step 5: Wait for the response 'finish' event (async response completion)
        await responsePromise;
        
        // Step 6: Assert that res.statusCode is 200
        assert.strictEqual(mockRes.statusCode, 200, 
            'Response status code should be 200 OK');
        
        // Step 7: Assert that res.getHeader('Content-Type') is 'text/plain; charset=utf-8'
        assert.strictEqual(mockRes.getHeader('Content-Type'), 'text/plain; charset=utf-8',
            'Response should have correct Content-Type header');
        
        // Step 8: Assert that res.getHeader('Connection') is 'keep-alive'
        assert.strictEqual(mockRes.getHeader('Connection'), 'keep-alive',
            'Response should have keep-alive connection header');
        
        // Step 9: Assert that the response body is exactly 'Hello world'
        assert.strictEqual(mockRes.getBody(), 'Hello world',
            'Response body should contain exactly "Hello world"');
        
        // Step 10: Verify that the response stream has been properly ended
        assert.strictEqual(mockRes.isEnded(), true,
            'Response stream should be ended after sending');
        
        // Step 11: Verify that headers were sent (no further modifications possible)
        assert.strictEqual(mockRes.headersSent, true,
            'Response headers should be marked as sent');
    });
    
    /**
     * Test Case 2: Verify Logging Behavior
     * 
     * This test ensures that handleHello logs both the receipt of the request and
     * the successful response event using the logger utility. It verifies that
     * proper observability is maintained throughout the request-response cycle.
     * 
     * Educational Value:
     * - Shows how to spy on function calls to verify side effects
     * - Demonstrates testing of logging behavior for observability
     * - Illustrates verification of function call arguments and patterns
     * - Teaches proper mocking and restoration of external dependencies
     */
    test('should log request receipt and response delivery', async () => {
        // Step 1: Mock request and response objects
        const mockReq = mockRequest({
            method: 'GET',
            url: '/hello',
            headers: {
                'user-agent': 'test-agent/1.0'
            }
        });
        
        const mockRes = mockResponse();
        
        // Step 2: Create a promise to wait for the response 'finish' event
        const responsePromise = new Promise((resolve) => {
            mockRes.on('finish', resolve);
        });
        
        // Step 3: Invoke handleHello(req, res) with mock objects
        handleHello(mockReq, mockRes);
        
        // Step 4: Wait for the response 'finish' event
        await responsePromise;
        
        // Step 5: Assert that logInfo was called with a message indicating request receipt
        // The handler should log the request method and URL
        assert.strictEqual(logger.logInfo.mock.calls.length >= 2, true,
            'logInfo should be called at least twice (request and response)');
        
        // Step 6: Verify the first log call includes request details
        const firstLogCall = logger.logInfo.mock.calls[0];
        assert.strictEqual(firstLogCall.arguments[0].includes('Received request to /hello endpoint'), true,
            'First log should indicate request receipt');
        assert.strictEqual(firstLogCall.arguments[1], 'GET',
            'First log should include HTTP method');
        assert.strictEqual(firstLogCall.arguments[2], '/hello',
            'First log should include request URL');
        
        // Step 7: Verify subsequent log calls include response details
        const logCalls = logger.logInfo.mock.calls;
        const responseLogFound = logCalls.some(call => 
            call.arguments[0].includes('Successfully processed /hello request'));
        assert.strictEqual(responseLogFound, true,
            'Should log successful response processing');
        
        // Step 8: Verify that request details are logged including user-agent
        const requestDetailsLogFound = logCalls.some(call => 
            call.arguments[0].includes('Request details'));
        assert.strictEqual(requestDetailsLogFound, true,
            'Should log detailed request information');
        
        // Step 9: Verify that response metadata is logged
        const responseMetadataLogFound = logCalls.some(call => 
            call.arguments[0].includes('Response sent to client'));
        assert.strictEqual(responseMetadataLogFound, true,
            'Should log response metadata');
    });
    
    /**
     * Test Case 3: Verify Response Stream Ending
     * 
     * This test verifies that handleHello properly ends the response stream,
     * ensuring no further writes are possible and that the response is properly
     * closed for client consumption.
     * 
     * Educational Value:
     * - Demonstrates testing of stream lifecycle management
     * - Shows verification of resource cleanup in HTTP responses
     * - Illustrates proper response finalization testing
     * - Teaches testing of state changes in mock objects
     */
    test('should end the response stream after sending', async () => {
        // Step 1: Create mock request and response objects
        const mockReq = mockRequest({
            method: 'GET',
            url: '/hello'
        });
        
        const mockRes = mockResponse();
        
        // Step 2: Create a promise to wait for the response 'finish' event
        const responsePromise = new Promise((resolve) => {
            mockRes.on('finish', resolve);
        });
        
        // Step 3: Invoke handleHello(req, res) with mock objects
        handleHello(mockReq, mockRes);
        
        // Step 4: Wait for the response 'finish' event
        await responsePromise;
        
        // Step 5: Assert that res.end was called and the response is closed
        assert.strictEqual(mockRes.isEnded(), true,
            'Response should be ended after processing');
        
        // Step 6: Verify that headers were sent (indicating response completion)
        assert.strictEqual(mockRes.headersSent, true,
            'Headers should be sent when response is ended');
        
        // Step 7: Verify that attempting to write more data would throw an error
        assert.throws(() => {
            mockRes.write('additional data');
        }, /Cannot write after response has ended/,
            'Should not allow writing after response has ended');
        
        // Step 8: Verify that attempting to end again would throw an error
        assert.throws(() => {
            mockRes.end();
        }, /Response has already ended/,
            'Should not allow ending response multiple times');
        
        // Step 9: Verify that the finish event was emitted (indicates proper stream closure)
        // This is implicitly tested by the fact that our responsePromise resolved
        assert.strictEqual(mockRes.isEnded(), true,
            'Response stream should be properly closed');
    });
    
    /**
     * Test Case 4: Verify Request Method and URL Handling
     * 
     * This test ensures that the handler correctly processes different request
     * configurations while maintaining consistent behavior and logging.
     * 
     * Educational Value:
     * - Shows testing with different input variations
     * - Demonstrates parameter validation in handlers
     * - Illustrates consistent behavior across request types
     */
    test('should handle different request configurations consistently', async () => {
        // Test with minimal request object
        const mockReq = mockRequest({
            method: 'GET',
            url: '/hello',
            headers: {}
        });
        
        const mockRes = mockResponse();
        
        const responsePromise = new Promise((resolve) => {
            mockRes.on('finish', resolve);
        });
        
        handleHello(mockReq, mockRes);
        await responsePromise;
        
        // Verify consistent response regardless of request headers
        assert.strictEqual(mockRes.statusCode, 200,
            'Should return 200 status for minimal request');
        assert.strictEqual(mockRes.getBody(), 'Hello world',
            'Should return consistent message for minimal request');
        
        // Verify logging still occurs
        assert.strictEqual(logger.logInfo.mock.calls.length >= 2, true,
            'Should log events even for minimal requests');
    });
    
    /**
     * Test Case 5: Verify Error Handling and Recovery
     * 
     * This test ensures the handler maintains robust operation and proper
     * error handling during edge cases or unexpected conditions.
     * 
     * Educational Value:
     * - Demonstrates testing error scenarios
     * - Shows graceful degradation patterns
     * - Illustrates comprehensive error handling validation
     */
    test('should handle edge cases gracefully', async () => {
        // Test with request containing unusual but valid headers
        const mockReq = mockRequest({
            method: 'GET',
            url: '/hello',
            headers: {
                'user-agent': '',
                'x-custom-header': 'test-value'
            }
        });
        
        const mockRes = mockResponse();
        
        const responsePromise = new Promise((resolve) => {
            mockRes.on('finish', resolve);
        });
        
        handleHello(mockReq, mockRes);
        await responsePromise;
        
        // Verify handler continues to work correctly
        assert.strictEqual(mockRes.statusCode, 200,
            'Should handle empty user-agent gracefully');
        assert.strictEqual(mockRes.getBody(), 'Hello world',
            'Should return correct response body');
        
        // Verify logging handles edge cases
        const logCalls = logger.logInfo.mock.calls;
        const userAgentLogFound = logCalls.some(call => 
            call.arguments[0].includes('User-Agent'));
        assert.strictEqual(userAgentLogFound, true,
            'Should log user-agent information even when empty');
    });
});