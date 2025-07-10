/**
 * Handler Index Module - Centralized Handler Export Point
 * 
 * This module aggregates and re-exports all handler functions for the Node.js tutorial HTTP server.
 * It provides a single import point for all request and error handlers, supporting maintainability,
 * discoverability, and modularity in the server architecture.
 * 
 * Educational Purpose:
 * This index pattern demonstrates a fundamental architectural practice in Node.js applications:
 * - Centralized exports reduce coupling between modules
 * - Single import point simplifies dependency management
 * - Modular organization enhances code maintainability
 * - Clear separation of concerns through handler specialization
 * 
 * Architecture Benefits:
 * - Maintainability: Changes to individual handlers don't affect import statements in consuming modules
 * - Discoverability: All available handlers are documented and accessible from one location
 * - Modularity: Each handler maintains its own specialized functionality while being easily accessible
 * - Scalability: New handlers can be added and exported without modifying consuming modules
 * 
 * Usage Pattern:
 * Instead of importing handlers individually from their respective modules, consuming modules
 * (such as the router and server) can import all necessary handlers from this index:
 * 
 * // Instead of multiple imports:
 * // import { handleHello } from './handlers/helloHandler.mjs';
 * // import { handleNotFound, handleMethodNotAllowed, handleServerError } from './handlers/errorHandler.mjs';
 * 
 * // Use single import from index:
 * // import { handleHello, handleNotFound, handleMethodNotAllowed, handleServerError } from './handlers/index.mjs';
 * 
 * This pattern becomes increasingly valuable as the number of handlers grows in more complex applications.
 */

// Import the hello endpoint handler from the helloHandler module
// This handler processes GET requests to the '/hello' endpoint and returns "Hello world"
import { handleHello } from './helloHandler.mjs';

// Import all error handlers from the errorHandler module
// These handlers provide comprehensive error response coverage for the HTTP server
import { 
    handleNotFound,           // Handles 404 Not Found responses for undefined routes
    handleMethodNotAllowed,   // Handles 405 Method Not Allowed responses for unsupported HTTP methods
    handleServerError         // Handles 500 Internal Server Error responses for unexpected server errors
} from './errorHandler.mjs';

/**
 * Re-export the hello endpoint handler for use by the router module.
 * This handler is responsible for processing requests to the '/hello' endpoint
 * and generating the standard "Hello world" response with proper HTTP headers.
 * 
 * Handler Characteristics:
 * - Endpoint: '/hello'
 * - Method: GET
 * - Response: 200 OK with "Hello world" message
 * - Content-Type: text/plain; charset=utf-8
 * - Logging: Comprehensive request and response logging for educational traceability
 */
export { handleHello };

/**
 * Re-export the 404 Not Found error handler for use by the router and server modules.
 * This handler is invoked when a client requests a route that doesn't exist in the application.
 * 
 * Handler Characteristics:
 * - Trigger: Undefined routes or unmatched URL paths
 * - Response: 404 Not Found with "Not Found" message
 * - Content-Type: text/plain; charset=utf-8
 * - Logging: Warning-level logging for route debugging and analysis
 */
export { handleNotFound };

/**
 * Re-export the 405 Method Not Allowed error handler for use by the router module.
 * This handler is invoked when a client uses an unsupported HTTP method for a defined route.
 * 
 * Handler Characteristics:
 * - Trigger: Unsupported HTTP methods on existing routes
 * - Response: 405 Method Not Allowed with "Method Not Allowed" message
 * - Headers: Includes required 'Allow' header specifying supported methods
 * - Content-Type: text/plain; charset=utf-8
 * - Logging: Warning-level logging for method validation analysis
 */
export { handleMethodNotAllowed };

/**
 * Re-export the 500 Internal Server Error handler for use by the server module.
 * This handler is invoked when unexpected errors occur during request processing.
 * 
 * Handler Characteristics:
 * - Trigger: Unexpected runtime errors or exceptions
 * - Response: 500 Internal Server Error with "Internal Server Error" message
 * - Security: Generic error message prevents information disclosure
 * - Content-Type: text/plain; charset=utf-8
 * - Logging: Error-level logging with detailed error information for debugging
 */
export { handleServerError };

/**
 * Handler Export Summary:
 * 
 * This module exports four handler functions that collectively provide complete
 * HTTP request handling capabilities for the Node.js tutorial server:
 * 
 * 1. handleHello - Primary endpoint handler for '/hello' requests
 * 2. handleNotFound - Error handler for undefined routes (404)
 * 3. handleMethodNotAllowed - Error handler for unsupported methods (405)
 * 4. handleServerError - Error handler for server exceptions (500)
 * 
 * Each handler follows consistent patterns:
 * - Comprehensive logging for educational traceability
 * - Proper HTTP status codes and reason phrases
 * - Standardized response headers and content types
 * - Error handling with graceful degradation
 * - Security-conscious error message formatting
 * 
 * This centralized export approach simplifies the integration of handlers into
 * the server architecture while maintaining clear separation of concerns and
 * supporting the educational objectives of the tutorial application.
 */