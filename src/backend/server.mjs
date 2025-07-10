// Node.js built-in HTTP module for creating HTTP server instances
import { createServer } from 'node:http'; // Node.js 22.x (built-in)

// Import the main router function that dispatches HTTP requests to the correct handler
// based on path and method, handling successful route matches and appropriate error responses
import { router } from './routes/index.mjs';

// Import configuration loader for server startup parameters (port, host, environment)
import { getConfig } from './config.mjs';

// Import logging functions for comprehensive observability and educational analysis
import { logInfo, logWarn, logError } from './utils/logger.mjs';

// Import server error handler for unexpected runtime errors and exception handling
import { handleServerError } from './handlers/errorHandler.mjs';

/**
 * Node.js Tutorial HTTP Server Entry Point
 * 
 * This file serves as the entry point for the Node.js tutorial HTTP server, demonstrating
 * fundamental HTTP server concepts using only Node.js built-in modules. The server creates
 * a basic HTTP server that listens on a configurable port and delegates all incoming requests
 * to the main router for processing.
 * 
 * Educational Purpose:
 * This implementation provides a clear, well-documented example of creating an HTTP server
 * from scratch using Node.js built-in capabilities. It demonstrates server lifecycle management,
 * error handling, graceful shutdown, and comprehensive logging for learning purposes.
 * 
 * Key Features:
 * - HTTP server creation using Node.js built-in HTTP module
 * - Configurable port and host binding with environment variable support
 * - Comprehensive error handling for startup, runtime, and shutdown scenarios
 * - Graceful shutdown with proper resource cleanup
 * - Process signal handling for SIGINT and SIGTERM
 * - Uncaught exception and unhandled rejection handling
 * - Comprehensive logging for all server lifecycle events
 * - Cross-platform compatibility (Windows, macOS, Linux)
 * - Zero external dependencies for educational clarity
 * 
 * Architecture:
 * The server follows an event-driven architecture pattern using Node.js built-in capabilities:
 * - Single-threaded event loop for handling multiple concurrent requests
 * - Non-blocking I/O operations for optimal performance
 * - Delegation pattern for request processing through the router
 * - Separation of concerns between server management and request handling
 * 
 * Design Principles:
 * - Educational clarity over production complexity
 * - Comprehensive error handling and logging
 * - Graceful degradation and resource cleanup
 * - Protocol compliance with HTTP/1.1 standards
 * - Cross-platform compatibility and portability
 * - Maintainable and extensible architecture
 */

// Global server instance - HTTP server created by createServer(router)
// This allows the server to be accessed across functions for lifecycle management
let server = null;

// Global configuration object - Contains { port, host, env } loaded from getConfig()
// Stores the effective server configuration for binding and startup
let config = null;

// Global shutdown flag - Boolean to prevent duplicate shutdown logic
// Ensures graceful shutdown procedures are executed only once
let isShuttingDown = false;

/**
 * Initializes and starts the HTTP server, binding to the configured port and host.
 * Logs server startup events, handles binding errors, and sets up server lifecycle
 * event listeners for comprehensive observability and proper resource management.
 * 
 * This function implements the complete server startup sequence including:
 * - Configuration loading and validation
 * - HTTP server instance creation
 * - Event listener registration for server lifecycle management
 * - Network interface binding with error handling
 * - Startup logging for educational analysis
 * 
 * Educational Purpose:
 * Demonstrates proper server initialization patterns, error handling strategies,
 * and the importance of comprehensive logging for server operations.
 * 
 * @returns {void} - Starts the server and logs the listening event or handles startup errors
 */
function startServer() {
    try {
        // Step 1: Load effective configuration (port, host, env) from getConfig()
        logInfo('Loading server configuration...');
        config = getConfig();
        
        // Log the loaded configuration for transparency and debugging
        logInfo('Server configuration loaded - Port: %d, Host: %s, Environment: %s', 
                config.port, config.host, config.env);
        
        // Step 2: Create the HTTP server instance using createServer(router)
        logInfo('Creating HTTP server instance...');
        server = createServer(router);
        
        // Step 3: Register 'error' event listener to handle port binding errors
        server.on('error', (error) => {
            logError('Server error occurred: %s', error.message);
            
            // Handle specific error types with appropriate logging and responses
            if (error.code === 'EADDRINUSE') {
                logError('Port %d is already in use. Please try a different port or stop the conflicting service.', 
                        config.port);
            } else if (error.code === 'EACCES') {
                logError('Access denied when binding to port %d. Please check permissions or use a port above 1024.', 
                        config.port);
            } else if (error.code === 'EADDRNOTAVAIL') {
                logError('Address %s is not available. Please check the host configuration.', config.host);
            } else {
                logError('Server binding failed with error: %s', error.code);
            }
            
            // Log the full error details including stack trace for debugging
            logError('Server error details - Code: %s, Stack: %s', error.code, error.stack);
            
            // Exit the process with error code indicating startup failure
            process.exit(1);
        });
        
        // Step 4: Register 'listening' event listener to log successful startup
        server.on('listening', () => {
            const address = server.address();
            logInfo('Server successfully started and listening on %s:%d', config.host, config.port);
            logInfo('Server process ID: %d', process.pid);
            logInfo('Server environment: %s', config.env);
            logInfo('Server ready to accept HTTP requests at http://%s:%d', config.host, config.port);
            
            // Log tutorial-specific information for educational purposes
            logInfo('Tutorial endpoint available at: http://%s:%d/hello', config.host, config.port);
            logInfo('Server startup completed successfully');
        });
        
        // Step 5: Register 'close' event listener to log server shutdown
        server.on('close', () => {
            logInfo('HTTP server has been closed and is no longer accepting connections');
            logInfo('Server shutdown completed successfully');
        });
        
        // Step 6: Register additional server event listeners for comprehensive monitoring
        server.on('connection', (socket) => {
            logInfo('New client connection established from %s:%d', 
                    socket.remoteAddress, socket.remotePort);
        });
        
        server.on('clientError', (error, socket) => {
            logWarn('Client error occurred: %s', error.message);
            
            // Handle client errors gracefully without crashing the server
            if (!socket.destroyed) {
                socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
            }
        });
        
        // Step 7: Log server startup attempt
        logInfo('Starting HTTP server on %s:%d...', config.host, config.port);
        
        // Step 8: Bind the server to the configured port and host using server.listen()
        server.listen(config.port, config.host);
        
        // Log the binding attempt for educational transparency
        logInfo('Server listen() called - waiting for network binding to complete...');
        
    } catch (error) {
        // Handle any unexpected errors during server startup
        logError('Critical error during server startup: %s', error.message);
        logError('Startup error details - Stack: %s', error.stack);
        
        // Exit the process with error code indicating startup failure
        process.exit(1);
    }
}

/**
 * Sets up process signal handlers for graceful shutdown (SIGINT, SIGTERM) and
 * uncaught exception handling. Ensures the server closes cleanly and logs all
 * shutdown and error events for comprehensive observability and debugging.
 * 
 * This function implements comprehensive process lifecycle management including:
 * - SIGINT (Ctrl+C) and SIGTERM signal handling
 * - Uncaught exception and unhandled rejection handling
 * - Graceful shutdown coordination
 * - Comprehensive logging for all process events
 * 
 * Educational Purpose:
 * Demonstrates proper Node.js process management, signal handling best practices,
 * and the importance of graceful shutdown for production-ready applications.
 * 
 * @returns {void} - Registers signal and error handlers for process lifecycle management
 */
function handleProcessSignals() {
    // Step 1: Register SIGINT handler (Ctrl+C) for graceful shutdown
    process.on('SIGINT', () => {
        logInfo('SIGINT signal received (Ctrl+C) - initiating graceful shutdown...');
        gracefulShutdown();
    });
    
    // Step 2: Register SIGTERM handler (process termination) for graceful shutdown
    process.on('SIGTERM', () => {
        logInfo('SIGTERM signal received - initiating graceful shutdown...');
        gracefulShutdown();
    });
    
    // Step 3: Register uncaught exception handler for comprehensive error handling
    process.on('uncaughtException', (error) => {
        logError('Uncaught exception occurred: %s', error.message);
        logError('Exception details - Name: %s, Stack: %s', error.name, error.stack);
        
        // Log additional context for debugging
        logError('Process will attempt graceful shutdown due to uncaught exception');
        
        // Attempt graceful shutdown before process termination
        gracefulShutdown();
    });
    
    // Step 4: Register unhandled rejection handler for Promise errors
    process.on('unhandledRejection', (reason, promise) => {
        logError('Unhandled promise rejection occurred: %s', reason);
        logError('Promise rejection details - Promise: %s', promise);
        
        // Log additional context for debugging
        logError('Process will attempt graceful shutdown due to unhandled promise rejection');
        
        // Attempt graceful shutdown before process termination
        gracefulShutdown();
    });
    
    // Step 5: Register process warning handler for development debugging
    process.on('warning', (warning) => {
        logWarn('Process warning: %s', warning.message);
        logWarn('Warning details - Name: %s, Stack: %s', warning.name, warning.stack);
    });
    
    // Step 6: Register process exit handler for final cleanup logging
    process.on('exit', (code) => {
        // Note: Only synchronous operations are allowed in exit handler
        console.log(`[${new Date().toISOString()}] [INFO] Process exiting with code: ${code}`);
    });
    
    // Log successful signal handler registration
    logInfo('Process signal handlers registered successfully');
    logInfo('Server will handle SIGINT, SIGTERM, uncaught exceptions, and unhandled rejections');
}

/**
 * Performs a graceful shutdown of the HTTP server, ensuring all connections are closed
 * and resources are released properly. Prevents duplicate shutdown logic using a flag
 * and implements comprehensive logging for shutdown events and process termination.
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
 * and the importance of graceful degradation for production applications.
 * 
 * @returns {void} - Closes the server and exits the process after logging shutdown events
 */
function gracefulShutdown() {
    // Step 1: Check if shutdown is already in progress to prevent duplicate execution
    if (isShuttingDown) {
        logWarn('Graceful shutdown already in progress - ignoring duplicate shutdown request');
        return;
    }
    
    // Step 2: Set shutdown flag to prevent duplicate shutdown logic
    isShuttingDown = true;
    
    // Step 3: Log shutdown initiation event
    logInfo('Graceful shutdown initiated - stopping HTTP server...');
    
    // Step 4: Check if server exists and is listening
    if (server && server.listening) {
        logInfo('Closing HTTP server and existing connections...');
        
        // Step 5: Call server.close() to stop accepting new connections
        server.close((error) => {
            if (error) {
                // Log error if server close fails
                logError('Error during server close: %s', error.message);
                logError('Server close error details - Stack: %s', error.stack);
                
                // Exit with error code indicating shutdown failure
                logError('Graceful shutdown failed - exiting with error code 1');
                process.exit(1);
            } else {
                // Log successful server closure
                logInfo('HTTP server closed successfully');
                logInfo('All existing connections have been closed');
                logInfo('Server shutdown completed successfully');
                
                // Exit with success code
                logInfo('Graceful shutdown completed - exiting with success code 0');
                process.exit(0);
            }
        });
        
        // Step 6: Set a timeout for forceful shutdown if graceful shutdown takes too long
        const shutdownTimeout = setTimeout(() => {
            logWarn('Graceful shutdown timeout reached - forcing process termination');
            logWarn('Some connections may not have closed gracefully');
            process.exit(1);
        }, 10000); // 10 second timeout
        
        // Clear timeout if shutdown completes before timeout
        shutdownTimeout.unref();
        
    } else {
        // Server not listening or doesn't exist
        logInfo('HTTP server is not listening - proceeding with process termination');
        logInfo('Graceful shutdown completed - exiting with success code 0');
        process.exit(0);
    }
}

/**
 * Application initialization and startup sequence
 * 
 * This section executes the complete application startup process including:
 * - Process signal handler registration
 * - HTTP server initialization and startup
 * - Error handling for startup failures
 * - Comprehensive logging for application lifecycle
 * 
 * Educational Purpose:
 * Demonstrates proper application initialization patterns, the importance of
 * setup order for process handlers, and comprehensive error handling strategies.
 */

try {
    // Step 1: Log application startup
    logInfo('=== Node.js Tutorial HTTP Server Starting ===');
    logInfo('Node.js version: %s', process.version);
    logInfo('Process ID: %d', process.pid);
    logInfo('Platform: %s', process.platform);
    logInfo('Architecture: %s', process.arch);
    
    // Step 2: Register process signal handlers first for immediate coverage
    logInfo('Registering process signal handlers...');
    handleProcessSignals();
    
    // Step 3: Start the HTTP server
    logInfo('Initializing HTTP server...');
    startServer();
    
    // Step 4: Log successful application startup
    logInfo('Application startup sequence completed successfully');
    
} catch (error) {
    // Handle any critical errors during application startup
    logError('Critical application startup error: %s', error.message);
    logError('Startup error details - Stack: %s', error.stack);
    
    // Exit with error code indicating application startup failure
    process.exit(1);
}

// Export the server instance for integration testing and advanced orchestration
// This allows test suites to start, stop, or inspect the server instance
export { server };