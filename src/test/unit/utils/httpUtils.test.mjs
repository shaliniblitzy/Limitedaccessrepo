// Node.js built-in testing framework for comprehensive unit testing
import { test, describe } from 'node:test'; // Node.js 22.x (built-in)

// Node.js built-in assertion library for test validations
import assert from 'node:assert'; // Node.js 22.x (built-in)

// Import HTTP utility functions for comprehensive testing
import { 
    sendResponse, 
    sendNotFound, 
    sendHelloWorld, 
    setHeaders, 
    getStatusMessage,
    DEFAULT_HEADERS 
} from '../../../backend/utils/httpUtils.mjs';

// Import test utilities for creating mock HTTP objects
import { mockRequest, mockResponse } from '../../../test/utils/index.mjs';

/**
 * Unit Test Suite for HTTP Utility Functions
 * 
 * This comprehensive test suite validates the correctness, protocol compliance, 
 * and error handling of all HTTP utility functions in httpUtils.mjs. The tests
 * use mock request/response objects to ensure isolation and repeatability while
 * verifying all aspects of HTTP response generation including status codes,
 * headers, response bodies, and logging side effects.
 * 
 * Educational Purpose:
 * These tests demonstrate proper unit testing practices for HTTP utilities,
 * including mock object usage, assertion patterns, error handling validation,
 * and comprehensive coverage of both success and failure scenarios.
 */

describe('HTTP Utilities Unit Tests', () => {
    
    describe('sendResponse', () => {
        test('should set correct status code and status message', () => {
            const mockRes = mockResponse();
            const statusCode = 201;
            const message = 'Created';
            
            sendResponse(mockRes, statusCode, message);
            
            assert.strictEqual(mockRes.statusCode, statusCode, 'Status code should be set correctly');
            assert.strictEqual(mockRes.statusMessage, 'Created', 'Status message should be set correctly');
        });

        test('should set default headers correctly', () => {
            const mockRes = mockResponse();
            
            sendResponse(mockRes, 200, 'Test message');
            
            const capturedHeaders = mockRes.getCapturedHeaders();
            assert.strictEqual(capturedHeaders['Content-Type'], DEFAULT_HEADERS['Content-Type'], 
                'Content-Type header should match default');
            assert.strictEqual(capturedHeaders['Connection'], DEFAULT_HEADERS['Connection'], 
                'Connection header should match default');
        });

        test('should merge custom headers with default headers', () => {
            const mockRes = mockResponse();
            const customHeaders = {
                'X-Custom-Header': 'test-value',
                'Cache-Control': 'no-cache'
            };
            
            sendResponse(mockRes, 200, 'Test message', customHeaders);
            
            const capturedHeaders = mockRes.getCapturedHeaders();
            assert.strictEqual(capturedHeaders['X-Custom-Header'], 'test-value', 
                'Custom header should be set');
            assert.strictEqual(capturedHeaders['Cache-Control'], 'no-cache', 
                'Custom header should be set');
            assert.strictEqual(capturedHeaders['Content-Type'], DEFAULT_HEADERS['Content-Type'], 
                'Default headers should still be present');
        });

        test('should write message body to response', () => {
            const mockRes = mockResponse();
            const testMessage = 'Hello Test World';
            
            sendResponse(mockRes, 200, testMessage);
            
            const responseBody = mockRes.getBody();
            assert.strictEqual(responseBody, testMessage, 'Response body should match input message');
        });

        test('should end the response stream', () => {
            const mockRes = mockResponse();
            
            sendResponse(mockRes, 200, 'Test message');
            
            assert.strictEqual(mockRes.isEnded(), true, 'Response should be ended');
        });

        test('should emit finish event when response ends', (t, done) => {
            const mockRes = mockResponse();
            
            mockRes.on('finish', () => {
                assert.ok(true, 'Finish event should be emitted');
                done();
            });
            
            sendResponse(mockRes, 200, 'Test message');
        });

        test('should handle various status codes correctly', () => {
            const testCases = [
                { statusCode: 200, expectedMessage: 'OK' },
                { statusCode: 201, expectedMessage: 'Created' },
                { statusCode: 400, expectedMessage: 'Bad Request' },
                { statusCode: 404, expectedMessage: 'Not Found' },
                { statusCode: 500, expectedMessage: 'Internal Server Error' }
            ];
            
            testCases.forEach(({ statusCode, expectedMessage }) => {
                const mockRes = mockResponse();
                
                sendResponse(mockRes, statusCode, 'Test message');
                
                assert.strictEqual(mockRes.statusCode, statusCode, 
                    `Status code should be ${statusCode}`);
                assert.strictEqual(mockRes.statusMessage, expectedMessage, 
                    `Status message should be ${expectedMessage}`);
            });
        });

        test('should handle error scenarios gracefully', () => {
            // Create a mock response that throws an error on setHeader
            const mockRes = mockResponse();
            const originalSetHeader = mockRes.setHeader;
            mockRes.setHeader = () => {
                throw new Error('Header setting failed');
            };
            
            // Should not throw an error, should handle gracefully
            assert.doesNotThrow(() => {
                sendResponse(mockRes, 200, 'Test message');
            }, 'Should handle header setting errors gracefully');
        });

        test('should handle response already ended scenario', () => {
            const mockRes = mockResponse();
            
            // End the response first
            mockRes.end();
            
            // Attempting to send response again should handle gracefully
            assert.doesNotThrow(() => {
                sendResponse(mockRes, 200, 'Test message');
            }, 'Should handle already ended response gracefully');
        });
    });

    describe('sendNotFound', () => {
        test('should send 404 status code', () => {
            const mockRes = mockResponse();
            
            sendNotFound(mockRes);
            
            assert.strictEqual(mockRes.statusCode, 404, 'Status code should be 404');
        });

        test('should send "Not Found" status message', () => {
            const mockRes = mockResponse();
            
            sendNotFound(mockRes);
            
            assert.strictEqual(mockRes.statusMessage, 'Not Found', 'Status message should be "Not Found"');
        });

        test('should send "Not Found" as response body', () => {
            const mockRes = mockResponse();
            
            sendNotFound(mockRes);
            
            const responseBody = mockRes.getBody();
            assert.strictEqual(responseBody, 'Not Found', 'Response body should be "Not Found"');
        });

        test('should set correct headers', () => {
            const mockRes = mockResponse();
            
            sendNotFound(mockRes);
            
            const capturedHeaders = mockRes.getCapturedHeaders();
            assert.strictEqual(capturedHeaders['Content-Type'], DEFAULT_HEADERS['Content-Type'], 
                'Content-Type header should match default');
            assert.strictEqual(capturedHeaders['Connection'], DEFAULT_HEADERS['Connection'], 
                'Connection header should match default');
        });

        test('should end the response stream', () => {
            const mockRes = mockResponse();
            
            sendNotFound(mockRes);
            
            assert.strictEqual(mockRes.isEnded(), true, 'Response should be ended');
        });

        test('should emit finish event when response ends', (t, done) => {
            const mockRes = mockResponse();
            
            mockRes.on('finish', () => {
                assert.ok(true, 'Finish event should be emitted');
                done();
            });
            
            sendNotFound(mockRes);
        });
    });

    describe('sendHelloWorld', () => {
        test('should send 200 status code', () => {
            const mockRes = mockResponse();
            
            sendHelloWorld(mockRes);
            
            assert.strictEqual(mockRes.statusCode, 200, 'Status code should be 200');
        });

        test('should send "OK" status message', () => {
            const mockRes = mockResponse();
            
            sendHelloWorld(mockRes);
            
            assert.strictEqual(mockRes.statusMessage, 'OK', 'Status message should be "OK"');
        });

        test('should send "Hello world" as response body', () => {
            const mockRes = mockResponse();
            
            sendHelloWorld(mockRes);
            
            const responseBody = mockRes.getBody();
            assert.strictEqual(responseBody, 'Hello world', 'Response body should be "Hello world"');
        });

        test('should set correct headers', () => {
            const mockRes = mockResponse();
            
            sendHelloWorld(mockRes);
            
            const capturedHeaders = mockRes.getCapturedHeaders();
            assert.strictEqual(capturedHeaders['Content-Type'], DEFAULT_HEADERS['Content-Type'], 
                'Content-Type header should match default');
            assert.strictEqual(capturedHeaders['Connection'], DEFAULT_HEADERS['Connection'], 
                'Connection header should match default');
        });

        test('should end the response stream', () => {
            const mockRes = mockResponse();
            
            sendHelloWorld(mockRes);
            
            assert.strictEqual(mockRes.isEnded(), true, 'Response should be ended');
        });

        test('should emit finish event when response ends', (t, done) => {
            const mockRes = mockResponse();
            
            mockRes.on('finish', () => {
                assert.ok(true, 'Finish event should be emitted');
                done();
            });
            
            sendHelloWorld(mockRes);
        });
    });

    describe('setHeaders', () => {
        test('should set all provided headers on response object', () => {
            const mockRes = mockResponse();
            const headers = {
                'X-Test-Header': 'test-value',
                'Cache-Control': 'no-cache',
                'X-Custom-ID': '12345'
            };
            
            setHeaders(mockRes, headers);
            
            const capturedHeaders = mockRes.getCapturedHeaders();
            assert.strictEqual(capturedHeaders['X-Test-Header'], 'test-value', 
                'First header should be set');
            assert.strictEqual(capturedHeaders['Cache-Control'], 'no-cache', 
                'Second header should be set');
            assert.strictEqual(capturedHeaders['X-Custom-ID'], '12345', 
                'Third header should be set');
        });

        test('should handle empty headers object', () => {
            const mockRes = mockResponse();
            const headers = {};
            
            assert.doesNotThrow(() => {
                setHeaders(mockRes, headers);
            }, 'Should handle empty headers object without error');
        });

        test('should handle headers with various value types', () => {
            const mockRes = mockResponse();
            const headers = {
                'String-Header': 'string-value',
                'Number-Header': 42,
                'Boolean-Header': true,
                'Array-Header': ['value1', 'value2']
            };
            
            setHeaders(mockRes, headers);
            
            const capturedHeaders = mockRes.getCapturedHeaders();
            assert.strictEqual(capturedHeaders['String-Header'], 'string-value', 
                'String header should be set');
            assert.strictEqual(capturedHeaders['Number-Header'], 42, 
                'Number header should be set');
            assert.strictEqual(capturedHeaders['Boolean-Header'], true, 
                'Boolean header should be set');
            assert.deepStrictEqual(capturedHeaders['Array-Header'], ['value1', 'value2'], 
                'Array header should be set');
        });

        test('should handle overlapping headers correctly', () => {
            const mockRes = mockResponse();
            
            // Set initial headers
            const initialHeaders = {
                'X-Test-Header': 'initial-value',
                'Content-Type': 'application/json'
            };
            setHeaders(mockRes, initialHeaders);
            
            // Set overlapping headers
            const overlappingHeaders = {
                'X-Test-Header': 'updated-value',
                'X-New-Header': 'new-value'
            };
            setHeaders(mockRes, overlappingHeaders);
            
            const capturedHeaders = mockRes.getCapturedHeaders();
            assert.strictEqual(capturedHeaders['X-Test-Header'], 'updated-value', 
                'Overlapping header should be updated');
            assert.strictEqual(capturedHeaders['Content-Type'], 'application/json', 
                'Non-overlapping header should remain');
            assert.strictEqual(capturedHeaders['X-New-Header'], 'new-value', 
                'New header should be added');
        });

        test('should handle header setting errors gracefully', () => {
            const mockRes = mockResponse();
            const originalSetHeader = mockRes.setHeader;
            
            // Mock setHeader to throw an error for specific header
            mockRes.setHeader = (name, value) => {
                if (name === 'Problem-Header') {
                    throw new Error('Header setting failed');
                }
                return originalSetHeader.call(mockRes, name, value);
            };
            
            const headers = {
                'Good-Header': 'good-value',
                'Problem-Header': 'problem-value',
                'Another-Good-Header': 'another-good-value'
            };
            
            assert.doesNotThrow(() => {
                setHeaders(mockRes, headers);
            }, 'Should handle header setting errors gracefully');
        });
    });

    describe('getStatusMessage', () => {
        test('should return correct reason phrase for known status codes', () => {
            const testCases = [
                { statusCode: 200, expected: 'OK' },
                { statusCode: 201, expected: 'Created' },
                { statusCode: 202, expected: 'Accepted' },
                { statusCode: 400, expected: 'Bad Request' },
                { statusCode: 401, expected: 'Unauthorized' },
                { statusCode: 403, expected: 'Forbidden' },
                { statusCode: 404, expected: 'Not Found' },
                { statusCode: 500, expected: 'Internal Server Error' },
                { statusCode: 501, expected: 'Not Implemented' },
                { statusCode: 502, expected: 'Bad Gateway' },
                { statusCode: 503, expected: 'Service Unavailable' }
            ];
            
            testCases.forEach(({ statusCode, expected }) => {
                const result = getStatusMessage(statusCode);
                assert.strictEqual(result, expected, 
                    `Status message for ${statusCode} should be "${expected}"`);
            });
        });

        test('should return "Unknown Status" for unknown status codes', () => {
            const unknownStatusCodes = [999, 123, 600, 700, 1000];
            
            unknownStatusCodes.forEach(statusCode => {
                const result = getStatusMessage(statusCode);
                assert.strictEqual(result, 'Unknown Status', 
                    `Unknown status code ${statusCode} should return "Unknown Status"`);
            });
        });

        test('should handle edge cases for status codes', () => {
            const edgeCases = [
                { statusCode: 0, expected: 'Unknown Status' },
                { statusCode: -1, expected: 'Unknown Status' },
                { statusCode: null, expected: 'Unknown Status' },
                { statusCode: undefined, expected: 'Unknown Status' },
                { statusCode: 'invalid', expected: 'Unknown Status' }
            ];
            
            edgeCases.forEach(({ statusCode, expected }) => {
                const result = getStatusMessage(statusCode);
                assert.strictEqual(result, expected, 
                    `Edge case ${statusCode} should return "${expected}"`);
            });
        });

        test('should handle non-numeric status codes gracefully', () => {
            const nonNumericCodes = ['200', 'OK', true, false, {}, []];
            
            nonNumericCodes.forEach(statusCode => {
                const result = getStatusMessage(statusCode);
                assert.strictEqual(result, 'Unknown Status', 
                    `Non-numeric status code should return "Unknown Status"`);
            });
        });
    });

    describe('DEFAULT_HEADERS constant', () => {
        test('should contain correct Content-Type header', () => {
            assert.strictEqual(DEFAULT_HEADERS['Content-Type'], 'text/plain; charset=utf-8', 
                'Content-Type should be text/plain with UTF-8 charset');
        });

        test('should contain correct Connection header', () => {
            assert.strictEqual(DEFAULT_HEADERS['Connection'], 'keep-alive', 
                'Connection should be keep-alive');
        });

        test('should be a plain object with expected properties', () => {
            assert.strictEqual(typeof DEFAULT_HEADERS, 'object', 
                'DEFAULT_HEADERS should be an object');
            assert.strictEqual(Object.keys(DEFAULT_HEADERS).length, 2, 
                'DEFAULT_HEADERS should have exactly 2 properties');
        });

        test('should be immutable (object should not be modified)', () => {
            const originalHeaders = { ...DEFAULT_HEADERS };
            
            // Attempt to modify (should not affect original)
            try {
                DEFAULT_HEADERS['X-Test'] = 'test-value';
            } catch (error) {
                // Ignore errors from attempted modification
            }
            
            // Verify original headers are unchanged
            assert.deepStrictEqual(DEFAULT_HEADERS, originalHeaders, 
                'DEFAULT_HEADERS should remain unchanged');
        });
    });

    describe('Integration Tests', () => {
        test('should handle complete request-response cycle for hello endpoint', () => {
            const mockRes = mockResponse();
            
            // Simulate complete hello world response
            sendHelloWorld(mockRes);
            
            // Verify all aspects of the response
            assert.strictEqual(mockRes.statusCode, 200, 'Status code should be 200');
            assert.strictEqual(mockRes.statusMessage, 'OK', 'Status message should be OK');
            assert.strictEqual(mockRes.getBody(), 'Hello world', 'Body should be Hello world');
            assert.strictEqual(mockRes.isEnded(), true, 'Response should be ended');
            
            const headers = mockRes.getCapturedHeaders();
            assert.strictEqual(headers['Content-Type'], 'text/plain; charset=utf-8', 
                'Content-Type should be correct');
            assert.strictEqual(headers['Connection'], 'keep-alive', 
                'Connection should be keep-alive');
        });

        test('should handle complete request-response cycle for not found endpoint', () => {
            const mockRes = mockResponse();
            
            // Simulate complete not found response
            sendNotFound(mockRes);
            
            // Verify all aspects of the response
            assert.strictEqual(mockRes.statusCode, 404, 'Status code should be 404');
            assert.strictEqual(mockRes.statusMessage, 'Not Found', 'Status message should be Not Found');
            assert.strictEqual(mockRes.getBody(), 'Not Found', 'Body should be Not Found');
            assert.strictEqual(mockRes.isEnded(), true, 'Response should be ended');
            
            const headers = mockRes.getCapturedHeaders();
            assert.strictEqual(headers['Content-Type'], 'text/plain; charset=utf-8', 
                'Content-Type should be correct');
            assert.strictEqual(headers['Connection'], 'keep-alive', 
                'Connection should be keep-alive');
        });

        test('should handle custom response with mixed scenarios', () => {
            const mockRes = mockResponse();
            const customHeaders = {
                'X-Custom-Header': 'custom-value',
                'Content-Type': 'application/json' // Override default
            };
            
            // Send custom response
            sendResponse(mockRes, 418, 'I\'m a teapot', customHeaders);
            
            // Verify custom response handling
            assert.strictEqual(mockRes.statusCode, 418, 'Status code should be 418');
            assert.strictEqual(mockRes.statusMessage, 'Unknown Status', 
                'Unknown status should return Unknown Status');
            assert.strictEqual(mockRes.getBody(), 'I\'m a teapot', 'Body should be custom message');
            
            const headers = mockRes.getCapturedHeaders();
            assert.strictEqual(headers['Content-Type'], 'application/json', 
                'Content-Type should be overridden');
            assert.strictEqual(headers['Connection'], 'keep-alive', 
                'Connection should remain from defaults');
            assert.strictEqual(headers['X-Custom-Header'], 'custom-value', 
                'Custom header should be set');
        });
    });

    describe('Error Handling and Edge Cases', () => {
        test('should handle null or undefined response objects gracefully', () => {
            // These should not throw errors but handle gracefully
            assert.doesNotThrow(() => {
                sendResponse(null, 200, 'Test');
            }, 'Should handle null response gracefully');
            
            assert.doesNotThrow(() => {
                sendNotFound(null);
            }, 'Should handle null response gracefully');
            
            assert.doesNotThrow(() => {
                sendHelloWorld(null);
            }, 'Should handle null response gracefully');
        });

        test('should handle various message types in sendResponse', () => {
            const mockRes = mockResponse();
            const testMessages = [
                'String message',
                '',
                123,
                true,
                null,
                undefined,
                { key: 'value' },
                ['array', 'message']
            ];
            
            testMessages.forEach(message => {
                const testRes = mockResponse();
                assert.doesNotThrow(() => {
                    sendResponse(testRes, 200, message);
                }, `Should handle message type: ${typeof message}`);
            });
        });

        test('should handle performance requirements', () => {
            const mockRes = mockResponse();
            const startTime = process.hrtime.bigint();
            
            // Test response generation time
            sendHelloWorld(mockRes);
            
            const endTime = process.hrtime.bigint();
            const elapsedMs = Number(endTime - startTime) / 1000000; // Convert to milliseconds
            
            // Verify response time is reasonable (should be much less than 50ms as per spec)
            assert.ok(elapsedMs < 50, `Response time should be less than 50ms, got ${elapsedMs}ms`);
        });
    });

    describe('Protocol Compliance', () => {
        test('should generate HTTP/1.1 compliant responses', () => {
            const mockRes = mockResponse();
            
            sendHelloWorld(mockRes);
            
            // Verify HTTP compliance requirements
            assert.ok(mockRes.statusCode >= 100 && mockRes.statusCode < 600, 
                'Status code should be in valid HTTP range');
            assert.ok(mockRes.statusMessage.length > 0, 
                'Status message should not be empty');
            assert.ok(mockRes.getBody().length > 0, 
                'Response body should not be empty');
            
            const headers = mockRes.getCapturedHeaders();
            assert.ok(headers['Content-Type'], 'Content-Type header should be present');
            assert.ok(headers['Connection'], 'Connection header should be present');
        });

        test('should handle various HTTP methods appropriately', () => {
            // While HTTP utilities don't directly handle methods, 
            // they should work with responses regardless of request method
            const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
            
            methods.forEach(method => {
                const mockRes = mockResponse();
                
                assert.doesNotThrow(() => {
                    sendHelloWorld(mockRes);
                }, `Should handle responses for ${method} method`);
                
                assert.strictEqual(mockRes.statusCode, 200, 
                    `Should return 200 for ${method} method`);
            });
        });
    });
});