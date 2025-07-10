// Node.js built-in process module for managing process-level events and signals
import process from 'node:process'; // Node.js 22.x (built-in)

// Import the HTTP server instance for startup and lifecycle management
import { server } from '../server.mjs';

// Import configuration loader for server startup parameters (port, host, environment)
import { getConfig } from '../config.mjs';

// Import logging functions for comprehensive observability and educational analysis
import { logInfo, logWarn, logError } from '../utils/logger.mjs';

/**
 * Node.js Tutorial HTTP Server Startup Script
 * 
 * This script serves as the canonical entry point for running the Node.js tutorial HTTP server
 * in a standalone process context. It orchestrates the initialization and startup of the server,
 * manages process-level events for graceful shutdown, and provides robust error handling and
 * logging for all lifecycle events.
 * 
 * Educational Purpose:
 * This startup script demonstrates proper separation of concerns between server logic and
 * process management, showing how to create a robust, production-ready entry point that
 * handles process signals, startup errors, and graceful shutdown procedures.
 * 
 * Key Features:
 * - Separation of server logic from process management
 * - Comprehensive process signal handling (SIGINT, SIGTERM)
 * - Uncaught exception and unhandled rejection handling
 * - Graceful shutdown with proper resource cleanup
 * - Comprehensive logging for all process lifecycle events
 * - Cross-platform compatibility and portability
 * - Production-ready error handling and recovery
 * 
 * Architecture:
 * The script follows a clear initialization sequence:
 * 1. Load configuration and validate environment
 * 2. Register process event handlers for signals and errors
 * 3. Start the HTTP server with proper error handling
 * 4. Monitor server lifecycle and handle shutdown gracefully
 * 
 * Design Principles:
 * - Clear separation between process management and server logic
 * - Comprehensive error handling for all failure scenarios
 * - Educational clarity with extensive logging and documentation
 * - Production-ready patterns for process lifecycle management
 * - Maintainable and extensible architecture for future enhancements
 */

// Global configuration object - Result of getConfig(), containing port, host, and env
// Stores the effective server configuration loaded during startup
let config = null;

// Global shutdown flag - Boolean to prevent duplicate shutdown logic execution
// Ensures graceful shutdown procedures are executed only once per process
let isShuttingDown = false;

/**
 * Main entry point for the startup script. Loads configuration, starts the HTTP server,
 * and sets up process-level event handlers for graceful shutdown and error handling.
 * 
 * This function implements the complete application startup sequence including:
 * - Configuration loading and validation
 * - Process signal handler registration
 * - HTTP server startup with comprehensive error handling
 * - Startup logging for educational observability
 * 
 * Educational Purpose:
 * Demonstrates proper application initialization patterns, the importance of setup order
 * for process handlers, and comprehensive error handling strategies for production readiness.
 * 
 * @returns {void} - Starts the server and manages process lifecycle
 */
function main() {
    try {
        // Step 1: Log application startup sequence initiation
        logInfo('=== Node.js Tutorial HTTP Server Startup Script ===');
        logInfo('Node.js version: %s', process.version);
        logInfo('Process ID: %d', process.pid);
        logInfo('Platform: %s', process.platform);
        logInfo('Architecture: %s', process.arch);
        logInfo('Working directory: %s', process.cwd());
        
        // Step 2: Call getConfig() to load configuration (port, host, env)
        logInfo('Loading server configuration...');
        config = getConfig();
        
        // Validate that configuration was loaded successfully
        if (!config || typeof config !== 'object') {
            throw new Error('Failed to load server configuration - invalid configuration object');
        }
        
        // Validate required configuration properties
        if (typeof config.port !== 'number' || config.port <= 0) {
            throw new Error(`Invalid port configuration: ${config.port}`);
        }
        
        if (typeof config.host !== 'string' || config.host.trim().length === 0) {
            throw new Error(`Invalid host configuration: ${config.host}`);
        }
        
        if (typeof config.env !== 'string' || config.env.trim().length === 0) {
            throw new Error(`Invalid environment configuration: ${config.env}`);
        }
        
        // Log successful configuration loading
        logInfo('Server configuration loaded successfully');
        logInfo('Configuration - Port: %d, Host: %s, Environment: %s', 
                config.port, config.host, config.env);
        
        // Step 3: Register process event listeners for SIGINT and SIGTERM to trigger graceful shutdown
        logInfo('Registering process signal handlers...');
        
        // Register SIGINT handler (Ctrl+C) for graceful shutdown
        process.on('SIGINT', () => {
            logInfo('SIGINT signal received (Ctrl+C) - initiating graceful shutdown...');
            gracefulShutdown('SIGINT');
        });
        
        // Register SIGTERM handler (process termination) for graceful shutdown
        process.on('SIGTERM', () => {
            logInfo('SIGTERM signal received - initiating graceful shutdown...');
            gracefulShutdown('SIGTERM');
        });
        
        logInfo('Process signal handlers registered successfully (SIGINT, SIGTERM)');
        
        // Step 4: Register process event listeners for uncaughtException and unhandledRejection
        logInfo('Registering fatal error handlers...');
        
        // Register uncaught exception handler
        process.on('uncaughtException', (error) => {
            logError('Uncaught exception occurred in process');
            handleFatalError(error);
        });
        
        // Register unhandled rejection handler
        process.on('unhandledRejection', (reason, promise) => {
            logError('Unhandled promise rejection occurred in process');
            // Convert reason to Error object if it's not already
            const error = reason instanceof Error ? reason : new Error(String(reason));
            error.promise = promise;
            handleFatalError(error);
        });
        
        // Register process warning handler for development debugging
        process.on('warning', (warning) => {
            logWarn('Process warning: %s', warning.message);
            logWarn('Warning details - Name: %s, Stack: %s', warning.name, warning.stack);
        });
        
        // Register process exit handler for final cleanup logging
        process.on('exit', (code) => {
            // Note: Only synchronous operations are allowed in exit handler
            console.log(`[${new Date().toISOString()}] [INFO] Process exiting with code: ${code}`);
        });
        
        logInfo('Fatal error handlers registered successfully');
        
        // Step 5: Start the HTTP server by calling server.listen() with the configured port and host
        logInfo('Starting HTTP server...');
        
        // Validate that server object is available
        if (!server) {
            throw new Error('Server object not available - check server.mjs module');
        }
        
        // Register server error handler before starting
        server.on('error', (error) => {
            logError('Server error occurred during binding: %s', error.message);
            
            // Handle specific error types with detailed logging
            if (error.code === 'EADDRINUSE') {
                logError('Port %d is already in use. Please try a different port or stop the conflicting service.', 
                        config.port);
            } else if (error.code === 'EACCES') {
                logError('Access denied when binding to port %d. Please check permissions or use a port above 1024.', 
                        config.port);
            } else if (error.code === 'EADDRNOTAVAIL') {
                logError('Address %s is not available. Please check the host configuration.', config.host);
            } else {
                logError('Server binding failed with error code: %s', error.code);
            }
            
            // Log full error details including stack trace
            logError('Server error details - Code: %s, Stack: %s', error.code, error.stack);
            
            // Exit the process with error code 1 indicating startup failure
            process.exit(1);
        });
        
        // Register server listening event handler
        server.on('listening', () => {
            const address = server.address();
            
            // Step 6: On successful listening, log the server address and environment mode
            logInfo('HTTP server successfully started and listening');
            logInfo('Server address: %s:%d', config.host, config.port);
            logInfo('Server environment: %s', config.env);
            logInfo('Server process ID: %d', process.pid);
            logInfo('Server ready to accept HTTP requests at http://%s:%d', config.host, config.port);
            
            // Log tutorial-specific information for educational purposes
            logInfo('Tutorial endpoint available at: http://%s:%d/hello', config.host, config.port);
            logInfo('Server startup completed successfully');
        });
        
        // Start the server with the configured host and port
        logInfo('Attempting to bind server to %s:%d...', config.host, config.port);
        server.listen(config.port, config.host);
        
        logInfo('Server listen() called - waiting for network binding to complete...');
        
    } catch (error) {
        // Step 7: On error during startup, log the error and exit with code 1
        logError('Critical error during server startup: %s', error.message);
        logError('Startup error details - Name: %s, Stack: %s', error.name, error.stack);
        
        // Exit the process with error code 1 indicating startup failure
        process.exit(1);
    }
}

/**
 * Handles process signals (SIGINT, SIGTERM) for graceful shutdown. Ensures all connections
 * are closed, logs shutdown events, and exits the process cleanly with proper resource cleanup.
 * 
 * This function implements the complete graceful shutdown sequence including:
 * - Duplicate shutdown prevention using isShuttingDown flag
 * - Server connection closure with timeout handling
 * - Resource cleanup and connection termination
 * - Comprehensive logging for shutdown events
 * - Process termination with appropriate exit codes
 * 
 * Educational Purpose:
 * Demonstrates proper server shutdown patterns, resource management best practices,
 * and the importance of graceful degradation for production-ready applications.
 * 
 * @param {string} signal - The signal that triggered the shutdown (SIGINT, SIGTERM)
 * @returns {void} - Performs graceful shutdown and exits the process
 */
function gracefulShutdown(signal) {
    // Step 1: Check if isShuttingDown is already true; if so, return immediately
    if (isShuttingDown) {
        logWarn('Graceful shutdown already in progress - ignoring duplicate shutdown request for signal: %s', signal);
        return;
    }
    
    // Step 2: Set isShuttingDown to true to prevent duplicate shutdown logic
    isShuttingDown = true;
    
    // Step 3: Log shutdown initiation using logInfo, including the received signal
    logInfo('Graceful shutdown initiated by signal: %s', signal);
    logInfo('Stopping HTTP server and closing connections...');
    
    // Step 4: Check if server exists and is listening
    if (!server) {
        logWarn('Server object not available during shutdown - proceeding with process termination');
        logInfo('Graceful shutdown completed - exiting with success code 0');
        process.exit(0);
        return;
    }
    
    if (!server.listening) {
        logInfo('Server is not listening - proceeding with process termination');
        logInfo('Graceful shutdown completed - exiting with success code 0');
        process.exit(0);
        return;
    }
    
    // Step 5: Call server.close() to stop accepting new connections
    logInfo('Closing HTTP server instance...');
    
    server.close((error) => {
        if (error) {
            // Step 6: If an error occurs during shutdown, logError and exit process with code 1
            logError('Error occurred during server shutdown: %s', error.message);
            logError('Server shutdown error details - Name: %s, Stack: %s', error.name, error.stack);
            logError('Graceful shutdown failed - exiting with error code 1');
            process.exit(1);
        } else {
            // Step 7: After server is closed, log shutdown completion and exit process with code 0
            logInfo('HTTP server closed successfully');
            logInfo('All existing connections have been closed');
            logInfo('Server shutdown completed successfully');
            logInfo('Graceful shutdown completed - exiting with success code 0');
            process.exit(0);
        }
    });
    
    // Set a timeout for forceful shutdown if graceful shutdown takes too long
    const shutdownTimeout = setTimeout(() => {
        logWarn('Graceful shutdown timeout reached (10 seconds) - forcing process termination');
        logWarn('Some connections may not have closed gracefully');
        logError('Forced shutdown due to timeout - exiting with error code 1');
        process.exit(1);
    }, 10000); // 10 second timeout
    
    // Clear timeout reference to prevent it from keeping the process alive
    shutdownTimeout.unref();
    
    logInfo('Graceful shutdown in progress - waiting for server to close...');
}

/**
 * Handles uncaught exceptions and unhandled promise rejections at the process level.
 * Logs the error with comprehensive details and exits the process with a non-zero code
 * to indicate fatal error conditions that cannot be recovered from.
 * 
 * This function implements comprehensive fatal error handling including:
 * - Error logging with stack traces and context information
 * - Process termination with appropriate exit codes
 * - Educational logging for debugging and learning purposes
 * - Graceful degradation when possible
 * 
 * Educational Purpose:
 * Demonstrates proper error handling patterns for unrecoverable errors, the importance
 * of logging fatal errors with sufficient context, and process termination strategies.
 * 
 * @param {Error} error - The error object containing error details, message, and stack trace
 * @returns {void} - Logs the error and exits the process
 */
function handleFatalError(error) {
    // Step 1: Log the fatal error using logError, including stack trace if available
    logError('Fatal error occurred in process - immediate termination required');
    logError('Error message: %s', error.message || 'No error message available');
    logError('Error name: %s', error.name || 'Unknown error type');
    
    // Log stack trace if available
    if (error.stack) {
        logError('Error stack trace: %s', error.stack);
    } else {
        logError('No stack trace available for this error');
    }
    
    // Log additional error properties if available
    if (error.code) {
        logError('Error code: %s', error.code);
    }
    
    if (error.promise) {
        logError('Associated promise: %s', error.promise);
    }
    
    // Log process context for debugging
    logError('Process ID: %d', process.pid);
    logError('Process platform: %s', process.platform);
    logError('Node.js version: %s', process.version);
    
    // Log current configuration if available
    if (config) {
        logError('Current configuration - Port: %d, Host: %s, Environment: %s', 
                config.port, config.host, config.env);
    }
    
    // Log timestamp for correlation with other logs
    logError('Fatal error timestamp: %s', new Date().toISOString());
    
    // Step 2: Exit the process with code 1 indicating fatal error
    logError('Process will now terminate due to fatal error - exit code 1');
    process.exit(1);
}

/**
 * Application startup execution
 * 
 * This section immediately executes the main application startup function when the script
 * is run directly. It serves as the entry point for the entire application lifecycle.
 * 
 * Educational Purpose:
 * Demonstrates how to structure a Node.js application entry point with immediate execution
 * of the main application logic when the script is run as the primary module.
 */

// Execute the main startup function immediately when the script is run
// This initiates the complete application startup sequence
main();