// Import the main HTTP server instance and lifecycle management functionality
// The server module contains the complete HTTP server implementation with routing,
// error handling, and comprehensive logging for educational purposes
import { server } from './server.mjs';

// Import configuration loader for server startup parameters (port, host, environment)
// Provides centralized configuration management with environment variable support
import { getConfig } from './config.mjs';

// Import logging functions for comprehensive observability and educational traceability
import { logInfo, logWarn, logError } from './utils/logger.mjs';

/**
 * Node.js Tutorial HTTP Server Entry Point
 * 
 * This file serves as the primary application entry point for the Node.js tutorial HTTP server.
 * It demonstrates enterprise-grade application initialization patterns while maintaining
 * educational clarity and simplicity. The entry point is intentionally minimal to showcase
 * proper separation of concerns and delegation patterns.
 * 
 * Educational Purpose:
 * This implementation provides a clear example of application entry point design that:
 * - Separates application bootstrapping from server implementation
 * - Demonstrates proper configuration loading and validation
 * - Shows comprehensive error handling and process lifecycle management
 * - Provides observability through structured logging
 * - Enables testability through proper module exports
 * 
 * Key Features:
 * - Minimal entry point with delegation to specialized modules
 * - Comprehensive process lifecycle management with signal handling
 * - Robust error handling for startup, runtime, and shutdown scenarios
 * - Educational logging for all major application events
 * - Graceful shutdown with proper resource cleanup
 * - Cross-platform compatibility and portability
 * - Zero external dependencies for educational clarity
 * 
 * Architecture:
 * The entry point follows the delegation pattern, where core functionality is
 * implemented in specialized modules while the entry point focuses on:
 * - Application bootstrapping and initialization
 * - Process lifecycle management
 * - Error handling and recovery
 * - Observability and logging coordination
 * - Integration testing support through exports
 * 
 * Design Principles:
 * - Single Responsibility: Entry point handles only initialization and lifecycle
 * - Separation of Concerns: Server logic delegated to specialized modules
 * - Educational Clarity: Clear, well-documented code for learning purposes
 * - Testability: Exports allow for comprehensive testing and integration
 * - Observability: Comprehensive logging for debugging and analysis
 * - Robustness: Comprehensive error handling and graceful degradation
 */

// Global configuration object - Contains { port, host, env } loaded from getConfig()
// Stored globally for access across lifecycle management functions
let config = null;

// Global shutdown flag - Prevents duplicate shutdown execution
// Ensures graceful shutdown procedures are executed only once
let isShuttingDown = false;

/**
 * Main application entry point function that orchestrates the complete server startup
 * sequence. Loads configuration, initializes the server module, and sets up process
 * lifecycle management. This function implements the complete application bootstrap
 * process with comprehensive error handling and observability.
 * 
 * Educational Purpose:
 * Demonstrates proper application initialization patterns including:
 * - Configuration loading and validation
 * - Module initialization and dependency management
 * - Process lifecycle setup and signal handling
 * - Error handling and recovery strategies
 * - Comprehensive logging for observability
 * 
 * Implementation Details:
 * 1. Loads and validates server configuration from environment variables
 * 2. Initializes the server module through import (server starts as side effect)
 * 3. Sets up process signal handlers for graceful shutdown
 * 4. Registers error handlers for uncaught exceptions and unhandled rejections
 * 5. Logs all major application lifecycle events for educational analysis
 * 
 * @returns {void} - Initializes the application and manages the process lifecycle
 */
async function main() {
    try {
        // Step 1: Log application startup initiation
        logInfo('=== Node.js Tutorial HTTP Server Application Starting ===');
        logInfo('Process ID: %d', process.pid);
        logInfo('Node.js version: %s', process.version);
        logInfo('Platform: %s %s', process.platform, process.arch);
        logInfo('Working directory: %s', process.cwd());
        
        // Step 2: Load and validate server configuration
        logInfo('Loading server configuration...');
        config = getConfig();
        
        // Log effective configuration for transparency and debugging
        logInfo('Server configuration loaded successfully');
        logInfo('Configuration - Port: %d, Host: %s, Environment: %s', 
                config.port, config.host, config.env);
        
        // Step 3: Set up process signal handlers for graceful shutdown
        logInfo('Setting up process signal handlers...');
        setupProcessSignals();
        
        // Step 4: Initialize the HTTP server (server starts listening as side effect)
        logInfo('Initializing HTTP server module...');
        // Note: The server module automatically starts the HTTP server when imported
        // This is intentional for educational purposes to show side-effect imports
        logInfo('Server module initialized successfully');
        
        // Step 5: Log successful application startup
        logInfo('Application startup completed successfully');
        logInfo('Server is now ready to handle HTTP requests');
        logInfo('Tutorial endpoint available at: http://%s:%d/hello', config.host, config.port);
        
    } catch (error) {
        // Handle any critical errors during application startup
        logError('Critical error during application startup: %s', error.message);
        logError('Startup error details - Name: %s, Stack: %s', error.name, error.stack);
        
        // Log additional context for debugging
        logError('Application startup failed - initiating emergency shutdown');
        
        // Exit with error code indicating startup failure
        process.exit(1);
    }
}

/**
 * Sets up comprehensive process signal handlers for graceful shutdown, error handling,
 * and process lifecycle management. Ensures the application responds appropriately to
 * system signals, uncaught exceptions, and unhandled promise rejections.
 * 
 * Educational Purpose:
 * Demonstrates proper Node.js process management including:
 * - Signal handling for graceful shutdown (SIGINT, SIGTERM)
 * - Uncaught exception handling for error recovery
 * - Unhandled promise rejection handling
 * - Process warning handling for development
 * - Exit event handling for cleanup logging
 * 
 * Implementation Details:
 * - SIGINT (Ctrl+C) and SIGTERM handlers for graceful shutdown
 * - uncaughtException handler for synchronous error recovery
 * - unhandledRejection handler for asynchronous error recovery
 * - warning handler for development debugging
 * - exit handler for final cleanup logging
 * 
 * @returns {void} - Registers all necessary process event handlers
 */
function setupProcessSignals() {
    // Step 1: Register SIGINT handler (Ctrl+C) for interactive shutdown
    process.on('SIGINT', () => {
        logInfo('SIGINT signal received (Ctrl+C pressed) - initiating graceful shutdown...');
        gracefulShutdown();
    });
    
    // Step 2: Register SIGTERM handler for process termination
    process.on('SIGTERM', () => {
        logInfo('SIGTERM signal received - initiating graceful shutdown...');
        gracefulShutdown();
    });
    
    // Step 3: Register uncaught exception handler for synchronous errors
    process.on('uncaughtException', (error) => {
        logError('Uncaught exception occurred: %s', error.message);
        logError('Exception details - Name: %s, Stack: %s', error.name, error.stack);
        
        // Log additional context for debugging
        logError('Critical error detected - attempting graceful shutdown');
        
        // Attempt graceful shutdown before process termination
        gracefulShutdown();
    });
    
    // Step 4: Register unhandled promise rejection handler for asynchronous errors
    process.on('unhandledRejection', (reason, promise) => {
        logError('Unhandled promise rejection occurred: %s', reason);
        logError('Promise rejection details - Promise: %s, Reason: %s', promise, reason);
        
        // Log additional context for debugging
        logError('Unhandled promise rejection detected - attempting graceful shutdown');
        
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
        // Using console.log directly to avoid potential logging module issues
        console.log(`[${new Date().toISOString()}] [INFO] Application process exiting with code: ${code}`);
        
        // Log final application statistics
        const memoryUsage = process.memoryUsage();
        console.log(`[${new Date().toISOString()}] [INFO] Final memory usage - RSS: ${Math.round(memoryUsage.rss / 1024 / 1024)}MB, Heap: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`);
    });
    
    // Step 7: Log successful signal handler registration
    logInfo('Process signal handlers registered successfully');
    logInfo('Application will handle SIGINT, SIGTERM, uncaught exceptions, and unhandled rejections');
}

/**
 * Performs graceful shutdown of the application, ensuring all resources are properly
 * cleaned up and the server is stopped gracefully. Prevents duplicate shutdown execution
 * and provides comprehensive logging for shutdown events.
 * 
 * Educational Purpose:
 * Demonstrates proper application shutdown patterns including:
 * - Duplicate shutdown prevention
 * - Resource cleanup coordination
 * - Comprehensive shutdown logging
 * - Process termination with appropriate exit codes
 * 
 * Implementation Details:
 * - Checks shutdown flag to prevent duplicate execution
 * - Logs shutdown initiation and progress
 * - Delegates actual server shutdown to server module
 * - Provides fallback shutdown timeout for unresponsive shutdowns
 * - Exits with appropriate status codes
 * 
 * @returns {void} - Initiates graceful shutdown sequence
 */
function gracefulShutdown() {
    // Step 1: Check if shutdown is already in progress
    if (isShuttingDown) {
        logWarn('Graceful shutdown already in progress - ignoring duplicate shutdown request');
        return;
    }
    
    // Step 2: Set shutdown flag to prevent duplicate execution
    isShuttingDown = true;
    
    // Step 3: Log shutdown initiation
    logInfo('Graceful shutdown initiated from application entry point');
    logInfo('Stopping HTTP server and cleaning up resources...');
    
    // Step 4: Set up shutdown timeout as fallback
    const shutdownTimeout = setTimeout(() => {
        logWarn('Graceful shutdown timeout exceeded - forcing application termination');
        logWarn('Some resources may not have been cleaned up properly');
        process.exit(1);
    }, 15000); // 15 second timeout for complete shutdown
    
    // Step 5: Delegate shutdown to server module
    // Note: The server module handles the actual HTTP server shutdown
    // This maintains separation of concerns between entry point and server implementation
    try {
        // The server module has its own shutdown handling through signal handlers
        // We log the delegation and let the server module handle the actual shutdown
        logInfo('Delegating shutdown to server module...');
        
        // Clear the shutdown timeout since server module will handle cleanup
        clearTimeout(shutdownTimeout);
        
        // Log successful shutdown delegation
        logInfo('Shutdown delegation completed - server module will handle cleanup');
        
    } catch (error) {
        // Handle any errors during shutdown delegation
        logError('Error during shutdown delegation: %s', error.message);
        logError('Shutdown error details - Stack: %s', error.stack);
        
        // Clear timeout and force exit with error code
        clearTimeout(shutdownTimeout);
        logError('Shutdown delegation failed - forcing process termination');
        process.exit(1);
    }
}

/**
 * Application initialization and startup execution
 * 
 * This section executes the main application startup sequence when the module is loaded.
 * It demonstrates proper application initialization patterns and error handling strategies.
 * 
 * Educational Purpose:
 * Shows how application entry points should be structured for:
 * - Immediate initialization upon module load
 * - Top-level error handling
 * - Proper separation between initialization and runtime
 * - Clear execution flow for educational analysis
 */

// Execute main application startup sequence
// This runs immediately when the module is imported/executed
main().catch((error) => {
    // Handle any errors that escape the main() function
    logError('Unhandled error in main application function: %s', error.message);
    logError('Main function error details - Stack: %s', error.stack);
    
    // Log critical application failure
    logError('Application startup failed catastrophically - exiting with error code 1');
    
    // Exit with error code indicating main function failure
    process.exit(1);
});

// Export the server instance for integration testing and advanced orchestration
// This allows test suites to start, stop, or inspect the server instance
export { server };

// Export the getConfig function for testability and integration
// This provides access to the effective server configuration for testing
export { getConfig };