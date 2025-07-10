// Import HTTP utility functions for standardized response generation
import { 
    sendNotFound, 
    sendResponse, 
    getStatusMessage, 
    DEFAULT_HEADERS 
} from '../utils/httpUtils.mjs';

// Import logging functions for error event tracking and observability
import { logError, logWarn } from '../utils/logger.mjs';

/**
 * Global error message constants for consistent error responses
 * These messages provide standard HTTP error responses without exposing sensitive information
 */
const METHOD_NOT_ALLOWED_MESSAGE = 'Method Not Allowed';
const INTERNAL_SERVER_ERROR_MESSAGE = 'Internal Server Error';

/**
 * Handles requests to undefined routes by sending a 404 Not Found response.
 * This function provides proper HTTP protocol compliance for unmatched routes
 * and logs the event for observability and educational analysis.
 * 
 * Educational Purpose: Demonstrates proper 404 error handling patterns and
 * the importance of logging for debugging and monitoring server behavior.
 * 
 * @param {http.IncomingMessage} req - The HTTP request object containing request details
 * @param {http.ServerResponse} res - The HTTP response object for sending the response
 * @returns {void} - Ends the response stream after sending the 404 response
 */
export function handleNotFound(req, res) {
    try {
        // Log the 404 event using logWarn for non-critical error tracking
        // Include request method and URL for debugging and educational analysis
        logWarn('404 Not Found - Method: %s, URL: %s', req.method, req.url);
        
        // Call sendNotFound utility function to send standardized 404 response
        // This ensures consistent error response format across the application
        sendNotFound(res);
        
    } catch (error) {
        // Handle any unexpected errors during 404 processing
        logError('Error in handleNotFound: %s', error.message);
        
        // Ensure response is ended even if sendNotFound fails
        if (!res.headersSent) {
            try {
                res.statusCode = 500;
                res.statusMessage = getStatusMessage(500);
                res.end(INTERNAL_SERVER_ERROR_MESSAGE);
            } catch (fallbackError) {
                logError('Critical error in handleNotFound fallback: %s', fallbackError.message);
            }
        }
    }
}

/**
 * Handles requests with unsupported HTTP methods by sending a 405 Method Not Allowed response.
 * This function ensures HTTP protocol compliance by setting the required Allow header
 * and logging the event for observability and educational analysis.
 * 
 * Educational Purpose: Demonstrates proper HTTP method validation, protocol compliance
 * with Allow header requirements, and structured error response patterns.
 * 
 * @param {http.IncomingMessage} req - The HTTP request object containing request details
 * @param {http.ServerResponse} res - The HTTP response object for sending the response
 * @param {string[]} allowedMethods - Array of supported HTTP methods for the Allow header
 * @returns {void} - Ends the response stream after sending the 405 response
 */
export function handleMethodNotAllowed(req, res, allowedMethods) {
    try {
        // Validate that allowedMethods is provided and is an array
        if (!Array.isArray(allowedMethods) || allowedMethods.length === 0) {
            logWarn('handleMethodNotAllowed called without valid allowedMethods array');
            allowedMethods = ['GET']; // Default to GET if no methods specified
        }
        
        // Log the 405 event using logWarn for method not allowed tracking
        // Include request method, URL, and allowed methods for debugging
        logWarn('405 Method Not Allowed - Method: %s, URL: %s, Allowed Methods: %s', 
                req.method, req.url, allowedMethods.join(', '));
        
        // Construct headers by merging DEFAULT_HEADERS with Allow header
        // The Allow header is required by HTTP/1.1 specification for 405 responses
        const headers = {
            ...DEFAULT_HEADERS,
            'Allow': allowedMethods.join(', ')
        };
        
        // Call sendResponse utility function to send standardized 405 response
        // Include method not allowed message and constructed headers
        sendResponse(res, 405, METHOD_NOT_ALLOWED_MESSAGE, headers);
        
    } catch (error) {
        // Handle any unexpected errors during 405 processing
        logError('Error in handleMethodNotAllowed: %s', error.message);
        
        // Ensure response is ended even if sendResponse fails
        if (!res.headersSent) {
            try {
                res.statusCode = 500;
                res.statusMessage = getStatusMessage(500);
                res.end(INTERNAL_SERVER_ERROR_MESSAGE);
            } catch (fallbackError) {
                logError('Critical error in handleMethodNotAllowed fallback: %s', fallbackError.message);
            }
        }
    }
}

/**
 * Handles unexpected server errors by sending a 500 Internal Server Error response.
 * This function logs error details for debugging while ensuring no sensitive information
 * is leaked in the response body to maintain security best practices.
 * 
 * Educational Purpose: Demonstrates proper server error handling, secure error responses
 * that prevent information disclosure, and comprehensive error logging for debugging.
 * 
 * @param {http.IncomingMessage} req - The HTTP request object containing request details
 * @param {http.ServerResponse} res - The HTTP response object for sending the response
 * @param {Error} [error] - Optional error object containing error details for logging
 * @returns {void} - Ends the response stream after sending the 500 response
 */
export function handleServerError(req, res, error) {
    try {
        // Log the error using logError for critical error tracking
        // Include request method, URL, and error details for debugging
        if (error) {
            // Log detailed error information including stack trace for debugging
            logError('500 Internal Server Error - Method: %s, URL: %s, Error: %s, Stack: %s', 
                    req.method, req.url, error.message, error.stack);
        } else {
            // Log basic error information when no error object is provided
            logError('500 Internal Server Error - Method: %s, URL: %s, Error: Unknown error occurred', 
                    req.method, req.url);
        }
        
        // Call sendResponse utility function to send standardized 500 response
        // Use generic error message to avoid information disclosure
        // Do not include error details in the response body for security
        sendResponse(res, 500, INTERNAL_SERVER_ERROR_MESSAGE, DEFAULT_HEADERS);
        
    } catch (criticalError) {
        // Handle any critical errors during 500 error processing
        logError('Critical error in handleServerError: %s', criticalError.message);
        
        // Last resort error handling - attempt to send basic error response
        if (!res.headersSent) {
            try {
                res.statusCode = 500;
                res.statusMessage = getStatusMessage(500);
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                res.end(INTERNAL_SERVER_ERROR_MESSAGE);
            } catch (fallbackError) {
                logError('Critical error in handleServerError fallback: %s', fallbackError.message);
                // If even basic response fails, ensure connection is closed
                try {
                    res.destroy();
                } catch (destroyError) {
                    logError('Failed to destroy response connection: %s', destroyError.message);
                }
            }
        }
    }
}