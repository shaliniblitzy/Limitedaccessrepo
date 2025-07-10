/**
 * Entry point for the utils submodule - centralized export of HTTP utilities and logging functions
 * 
 * This module serves as a barrel export that re-exports all core HTTP utility functions
 * and standardized logging utilities from their respective modules. It provides a single
 * import location for other backend modules (handlers, router, server) to access all
 * utility functions, promoting code organization, maintainability, and educational clarity.
 * 
 * The module supports:
 * - HTTP response generation utilities for protocol-compliant responses
 * - Standardized logging functions for monitoring and observability
 * - Centralized access point for utility functions across the application
 * - Educational transparency by consolidating utility imports
 * 
 * Architecture: This follows the barrel export pattern for utility aggregation,
 * enabling clean imports like: import { sendResponse, logInfo } from './utils/index.mjs'
 * 
 * @module utils/index
 * @version 1.0.0
 * @author Node.js Tutorial Project
 */

// Import HTTP utility functions for response generation and protocol compliance
import {
    sendResponse,
    sendNotFound,
    sendHelloWorld,
    setHeaders,
    getStatusMessage,
    DEFAULT_HEADERS
} from './httpUtils.mjs';

// Import logging utility functions for monitoring and observability
import {
    logInfo,
    logWarn,
    logError
} from './logger.mjs';

// Re-export HTTP utility functions for centralized access
// These functions provide protocol-compliant HTTP response generation capabilities
export {
    sendResponse,     // Sends HTTP responses with custom status, headers, and body
    sendNotFound,     // Sends 404 Not Found responses with standard headers
    sendHelloWorld,   // Sends 'Hello world' response for the /hello endpoint
    setHeaders,       // Sets multiple headers on a response object
    getStatusMessage, // Retrieves standard HTTP reason phrase for status codes
    DEFAULT_HEADERS   // Default headers for all HTTP responses
};

// Re-export logging utility functions for monitoring and observability
// These functions provide consistent, protocol-compliant logging across the server
export {
    logInfo,  // Logs informational events (server startup, request handling, successful responses)
    logWarn,  // Logs warnings (protocol warnings, recoverable issues)
    logError  // Logs errors, exceptions, and critical server failures
};