// Import Node.js built-in utility for string formatting
import { format } from 'node:util'; // Node.js 22.x (built-in)

/**
 * Log levels enumeration for standardized logging
 * Provides consistent log level identifiers across the application
 */
const LOG_LEVELS = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR'
};

/**
 * Logs informational messages to the console (stdout) with standardized formatting.
 * Used for server startup, request handling, successful responses, and general events.
 * 
 * @param {string} message - The primary log message
 * @param {...any} args - Optional additional context or data for variable interpolation
 * @returns {void} - Outputs a formatted info message to the console
 */
export function logInfo(message, ...args) {
    // Get the current timestamp in ISO 8601 format for consistent time tracking
    const timestamp = new Date().toISOString();
    
    // Format the message using util.format for variable interpolation and structured output
    const formattedMessage = format(message, ...args);
    
    // Compose the log line with timestamp and log level for traceability
    const logLine = `[${timestamp}] [${LOG_LEVELS.INFO}] ${formattedMessage}`;
    
    // Output the log line to process.stdout using console.log() for informational events
    console.log(logLine);
}

/**
 * Logs warning messages to the console (stderr) with standardized formatting.
 * Used for non-critical issues, protocol warnings, or recoverable errors.
 * 
 * @param {string} message - The primary warning message
 * @param {...any} args - Optional additional context or data for variable interpolation
 * @returns {void} - Outputs a formatted warning message to the console
 */
export function logWarn(message, ...args) {
    // Get the current timestamp in ISO 8601 format for consistent time tracking
    const timestamp = new Date().toISOString();
    
    // Format the message using util.format for variable interpolation and structured output
    const formattedMessage = format(message, ...args);
    
    // Compose the log line with timestamp and log level for traceability
    const logLine = `[${timestamp}] [${LOG_LEVELS.WARN}] ${formattedMessage}`;
    
    // Output the log line to process.stderr using console.warn() for warning events
    console.warn(logLine);
}

/**
 * Logs error messages and exceptions to the console (stderr) with standardized formatting.
 * Used for error events, exceptions, failed responses, and critical server errors.
 * 
 * @param {string} message - The primary error message
 * @param {...any} args - Optional error objects, stack traces, or context data
 * @returns {void} - Outputs a formatted error message to the console
 */
export function logError(message, ...args) {
    // Get the current timestamp in ISO 8601 format for consistent time tracking
    const timestamp = new Date().toISOString();
    
    // Format the message using util.format for variable interpolation and structured output
    const formattedMessage = format(message, ...args);
    
    // Compose the log line with timestamp and log level for traceability
    const logLine = `[${timestamp}] [${LOG_LEVELS.ERROR}] ${formattedMessage}`;
    
    // Output the log line to process.stderr using console.error() for error events
    console.error(logLine);
}