/**
 * Test Utilities Index - Entry Point for Node.js Tutorial Application Test Suite
 * 
 * This module serves as the central entry point for all test utility functions and constants
 * in the Node.js tutorial application. It re-exports all core test helpers from testHelpers.mjs,
 * providing a unified import location for mocking, server lifecycle, HTTP request, configuration
 * override, and performance measurement utilities.
 * 
 * Educational Purpose:
 * This index file demonstrates the DRY (Don't Repeat Yourself) principle and maintainability
 * practices by centralizing all test utility exports in a single location. This pattern ensures
 * that all test files can import helpers from one consistent location, making the codebase
 * more maintainable and reducing import statement duplication across test files.
 * 
 * Design Pattern:
 * The barrel export pattern (re-exporting from a single file) is a common Node.js practice
 * that provides several benefits:
 * - Simplified import statements in test files
 * - Centralized management of test utilities
 * - Consistent API surface for test helpers
 * - Easy maintenance and refactoring of test utilities
 * 
 * Usage Examples:
 * Instead of importing from testHelpers.mjs directly:
 *   import { mockRequest, mockResponse } from './utils/testHelpers.mjs';
 * 
 * Test files can now import from this index:
 *   import { mockRequest, mockResponse } from './utils/index.mjs';
 */

// Re-export all test utility functions and constants from testHelpers.mjs
// This provides a single import location for all test utilities across the application

// Mock HTTP Objects - For Unit Testing
// These functions create mock HTTP request and response objects for isolated unit tests
export { mockRequest } from './testHelpers.mjs';
export { mockResponse } from './testHelpers.mjs';

// Server Lifecycle Management - For Integration and E2E Testing
// This function starts a real HTTP server instance for integration testing scenarios
export { startTestServer } from './testHelpers.mjs';

// HTTP Request Utilities - For Integration and E2E Testing
// This function performs HTTP requests to test servers and returns response data
export { httpRequest } from './testHelpers.mjs';

// Configuration Override Utilities - For Test Isolation
// This function temporarily overrides environment variables or config values for tests
export { withTestConfig } from './testHelpers.mjs';

// Performance Measurement Utilities - For Performance Testing
// This function measures execution time of async functions for performance validation
export { measureTime } from './testHelpers.mjs';

// Test Server Constants - For Consistent Test Environments
// These constants define default host and port for test server instances
export { TEST_PORT } from './testHelpers.mjs';
export { TEST_HOST } from './testHelpers.mjs';

/**
 * Module Export Summary:
 * 
 * Functions:
 * - mockRequest: Creates mock HTTP request objects for unit tests
 * - mockResponse: Creates mock HTTP response objects for unit tests  
 * - startTestServer: Starts real HTTP server instances for integration tests
 * - httpRequest: Performs HTTP requests to test servers
 * - withTestConfig: Temporarily overrides configuration for test isolation
 * - measureTime: Measures async function execution time for performance tests
 * 
 * Constants:
 * - TEST_PORT: Default port (3100) for test server instances
 * - TEST_HOST: Default host (127.0.0.1) for test server instances
 * 
 * This module enables all test files to import any combination of these utilities
 * from a single, consistent location, supporting the educational objectives of
 * maintainability, code organization, and testing best practices.
 */