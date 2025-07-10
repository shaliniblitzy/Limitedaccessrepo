// Import logging functions for HTTP response event tracking
import { logInfo, logWarn, logError } from './logger.mjs';

// Import Node.js built-in HTTP status codes mapping for protocol compliance
import { STATUS_CODES } from 'node:http'; // Node.js 22.x (built-in)

/**
 * Default HTTP headers for all responses to ensure protocol compliance
 * and consistent content delivery across the application
 */
export const DEFAULT_HEADERS = {
    'Content-Type': 'text/plain; charset=utf-8',
    'Connection': 'keep-alive'
};

/**
 * Sends a plain text HTTP response with the specified status code, headers, and message body.
 * Ensures protocol compliance and proper header formatting for all HTTP responses.
 * 
 * @param {http.ServerResponse} res - The HTTP response object
 * @param {number} statusCode - The HTTP status code to send
 * @param {string} message - The response message body
 * @param {object} [headers] - Optional additional headers to merge with defaults
 * @returns {void} - Ends the response stream after sending headers and body
 */
export function sendResponse(res, statusCode, message, headers = {}) {
    try {
        // Set the response status code to statusCode
        res.statusCode = statusCode;
        
        // Set the response status message using getStatusMessage(statusCode) for protocol compliance
        res.statusMessage = getStatusMessage(statusCode);
        
        // Merge DEFAULT_HEADERS with any provided headers
        const mergedHeaders = { ...DEFAULT_HEADERS, ...headers };
        
        // Set all headers on the response object
        setHeaders(res, mergedHeaders);
        
        // Write the message body to the response
        res.write(message);
        
        // End the response stream
        res.end();
        
        // Log the response event using logInfo, including status code and message
        logInfo('HTTP response sent - Status: %d, Message: "%s"', statusCode, message);
        
    } catch (error) {
        // Log error if response sending fails
        logError('Failed to send HTTP response - Status: %d, Error: %s', statusCode, error.message);
        
        // Attempt to end the response if not already ended
        if (!res.headersSent) {
            try {
                res.statusCode = 500;
                res.statusMessage = 'Internal Server Error';
                res.end('Internal Server Error');
            } catch (endError) {
                logError('Failed to send error response: %s', endError.message);
            }
        }
    }
}

/**
 * Sends a 404 Not Found response with a standard plain text message and appropriate headers.
 * Used for undefined routes to provide proper HTTP protocol compliance.
 * 
 * @param {http.ServerResponse} res - The HTTP response object
 * @returns {void} - Ends the response stream after sending the 404 response
 */
export function sendNotFound(res) {
    // Call sendResponse with statusCode 404, message 'Not Found', and DEFAULT_HEADERS
    sendResponse(res, 404, 'Not Found', DEFAULT_HEADERS);
    
    // Log the 404 event using logInfo
    logInfo('404 Not Found response sent for undefined route');
}

/**
 * Sends a 200 OK response with the static 'Hello world' message and correct headers.
 * Used for the '/hello' endpoint to deliver the core tutorial functionality.
 * 
 * @param {http.ServerResponse} res - The HTTP response object
 * @returns {void} - Ends the response stream after sending the hello world response
 */
export function sendHelloWorld(res) {
    // Call sendResponse with statusCode 200, message 'Hello world', and DEFAULT_HEADERS
    sendResponse(res, 200, 'Hello world', DEFAULT_HEADERS);
    
    // Log the successful hello world response using logInfo
    logInfo('Hello world response sent successfully');
}

/**
 * Sets multiple headers on a response object. Used to ensure all required headers
 * are present before sending a response, providing centralized header management.
 * 
 * @param {http.ServerResponse} res - The HTTP response object
 * @param {object} headers - Object containing header key-value pairs
 * @returns {void} - Headers are set on the response object
 */
export function setHeaders(res, headers) {
    try {
        // Iterate over the headers object
        for (const [key, value] of Object.entries(headers)) {
            // For each key-value pair, set the header on the response object using res.setHeader(key, value)
            res.setHeader(key, value);
        }
        
        // Log successful header setting
        logInfo('HTTP headers set successfully - Count: %d', Object.keys(headers).length);
        
    } catch (error) {
        // Log warning if header setting fails
        logWarn('Failed to set HTTP headers: %s', error.message);
    }
}

/**
 * Retrieves the standard HTTP reason phrase for a given status code using the
 * built-in STATUS_CODES mapping. Ensures protocol compliance for all responses.
 * 
 * @param {number} statusCode - The HTTP status code
 * @returns {string} - The standard HTTP reason phrase for the status code, or 'Unknown Status' if not found
 */
export function getStatusMessage(statusCode) {
    try {
        // Look up the statusCode in STATUS_CODES
        const statusMessage = STATUS_CODES[statusCode];
        
        // If found, return the reason phrase
        if (statusMessage) {
            return statusMessage;
        }
        
        // If not found, return 'Unknown Status'
        logWarn('Unknown HTTP status code: %d', statusCode);
        return 'Unknown Status';
        
    } catch (error) {
        // Log error and return default message if lookup fails
        logError('Failed to get status message for code %d: %s', statusCode, error.message);
        return 'Unknown Status';
    }
}