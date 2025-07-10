// Import Node.js built-in process module for environment variables, signals, and process management
import process from 'node:process'; // Node.js 22.x (built-in)

// Import configuration loader for development server startup parameters (port, host, environment)
import { getConfig } from '../config.mjs';

// Import logging functions for comprehensive development observability and educational analysis
import { logInfo, logWarn, logError } from '../utils/logger.mjs';

// Import the main HTTP server instance for development lifecycle management
import { server } from '../server.mjs';

/**
 * Node.js Tutorial HTTP Server Development Script
 * 
 * This script serves as the dedicated entry point for running the Node.js tutorial HTTP server
 * in development mode. It provides enhanced logging, developer-friendly features, detailed startup
 * diagnostics, and graceful shutdown handling specifically optimized for local development and
 * educational exploration.
 * 
 * Educational Purpose:
 * This development script demonstrates professional development practices including:
 * - Environment-specific configuration and startup sequences
 * - Comprehensive logging and diagnostics for debugging
 * - Graceful process lifecycle management with signal handling
 * - Developer experience optimization through enhanced feedback
 * - Cross-platform compatibility and educational clarity
 * 
 * Key Features:
 * - Enhanced development logging with detailed diagnostics
 * - Comprehensive server startup validation and error handling
 * - Process signal handling for graceful shutdown (SIGINT, SIGTERM)
 * - Developer-friendly error messages and debugging information
 * - Educational transparency through extensive logging
 * - Cross-platform compatibility (Windows, macOS, Linux)
 * - Zero external dependencies for educational simplicity
 * 
 * Architecture:
 * The script follows a structured development workflow:
 * - Configuration loading and validation
 * - Development mode initialization
 * - Server startup with enhanced diagnostics
 * - Process signal handler registration
 * - Graceful shutdown coordination
 * - Comprehensive error handling and logging
 * 
 * Design Principles:
 * - Educational clarity over production optimization
 * - Comprehensive logging for learning and debugging
 * - Developer experience focus with helpful feedback
 * - Process lifecycle best practices demonstration
 * - Cross-platform compatibility and accessibility
 * - Maintainable and extensible development patterns
 * 
 * Usage:
 * This script is intended to be invoked via the npm 'dev' script:
 * npm run dev
 * 
 * The script will:
 * 1. Load and validate development configuration
 * 2. Set development mode flags and logging levels
 * 3. Start the HTTP server with enhanced diagnostics
 * 4. Register process signal handlers for graceful shutdown
 * 5. Provide continuous development feedback and monitoring
 */

// Global development configuration object - Contains { port, host, env } loaded from getConfig()
// Stores the effective server configuration for development startup and diagnostics
let devConfig = null;

// Global development mode flag - Boolean set to true to indicate development mode
// Used for conditional logic and development-specific behavior
let devMode = false;

// Global development startup timestamp - Used for calculating startup time and diagnostics
let devStartTime = null;

// Global development process tracking - Used for development lifecycle management
let devProcessId = null;

/**
 * Initializes and starts the HTTP server in development mode with enhanced logging,
 * detailed configuration diagnostics, and comprehensive startup validation.
 * 
 * This function implements the complete development server startup sequence including:
 * - Configuration loading and validation with development-specific logging
 * - Development mode initialization and flag setting
 * - Enhanced startup diagnostics and system information display
 * - Server startup coordination and error handling
 * - Developer feedback and success confirmation
 * - Educational transparency through extensive logging
 * 
 * Educational Purpose:
 * Demonstrates professional development practices including configuration management,
 * error handling strategies, logging best practices, and developer experience optimization.
 * 
 * Development Features:
 * - Comprehensive configuration display and validation
 * - Enhanced error messages with debugging guidance
 * - System information display for development context
 * - Startup time measurement and performance feedback
 * - Educational logging for learning server lifecycle concepts
 * 
 * @returns {void} - Starts the server and logs the listening address and configuration
 */
function startDevServer() {
    try {
        // Step 1: Record development startup time for performance diagnostics
        devStartTime = Date.now();
        devProcessId = process.pid;
        
        // Step 2: Display development startup banner for educational clarity
        logInfo('=== NODE.JS TUTORIAL HTTP SERVER - DEVELOPMENT MODE ===');
        logInfo('Starting development server with enhanced diagnostics and logging...');
        
        // Step 3: Display system information for development context
        logInfo('Development Environment Information:');
        logInfo('  Node.js Version: %s', process.version);
        logInfo('  Platform: %s', process.platform);
        logInfo('  Architecture: %s', process.arch);
        logInfo('  Process ID: %d', devProcessId);
        logInfo('  Working Directory: %s', process.cwd());
        
        // Step 4: Load and validate development configuration using getConfig()
        logInfo('Loading development configuration...');
        devConfig = getConfig();
        
        // Step 5: Set development mode flag to true for conditional logic
        devMode = true;
        
        // Step 6: Display comprehensive development configuration
        logInfo('Development Configuration Loaded Successfully:');
        logInfo('  Server Port: %d', devConfig.port);
        logInfo('  Server Host: %s', devConfig.host);
        logInfo('  Environment: %s', devConfig.env);
        logInfo('  Development Mode: %s', devMode ? 'ENABLED' : 'DISABLED');
        
        // Step 7: Display development server URLs for easy access
        logInfo('Development Server URLs:');
        logInfo('  Local URL: http://%s:%d', devConfig.host, devConfig.port);
        logInfo('  Hello Endpoint: http://%s:%d/hello', devConfig.host, devConfig.port);
        
        // Step 8: Display development features and capabilities
        logInfo('Development Features Enabled:');
        logInfo('  Enhanced Logging: ENABLED');
        logInfo('  Startup Diagnostics: ENABLED');
        logInfo('  Graceful Shutdown: ENABLED');
        logInfo('  Error Handling: ENHANCED');
        logInfo('  Educational Logging: ENABLED');
        
        // Step 9: Check if server is already running by examining server.listening
        if (server && server.listening) {
            logWarn('Development server is already running on port %d', devConfig.port);
            logInfo('Server Status: ALREADY RUNNING');
            return;
        }
        
        // Step 10: Display server startup sequence for educational transparency
        logInfo('Development Server Startup Sequence:');
        logInfo('  1. Configuration loaded and validated');
        logInfo('  2. Development mode enabled');
        logInfo('  3. System information displayed');
        logInfo('  4. Starting HTTP server...');
        
        // Step 11: The server is actually started in server.mjs during import
        // We just need to verify it's running and provide development feedback
        if (server) {
            logInfo('HTTP server instance available - monitoring startup...');
            
            // Step 12: Register development-specific server event listeners
            server.on('listening', () => {
                const startupTime = Date.now() - devStartTime;
                const address = server.address();
                
                logInfo('=== DEVELOPMENT SERVER STARTUP COMPLETE ===');
                logInfo('Server successfully started in development mode');
                logInfo('Startup Time: %dms', startupTime);
                logInfo('Listening Address: %s:%d', address.address, address.port);
                logInfo('Server Status: RUNNING');
                logInfo('Development Mode: ACTIVE');
                
                // Display development instructions
                logInfo('Development Instructions:');
                logInfo('  • Visit http://%s:%d/hello to test the endpoint', devConfig.host, devConfig.port);
                logInfo('  • Press Ctrl+C to gracefully shutdown the server');
                logInfo('  • Check console for request/response logs');
                logInfo('  • Server will handle errors gracefully in development mode');
                
                logInfo('=== DEVELOPMENT SERVER READY FOR REQUESTS ===');
            });
            
            // Step 13: Register development-specific error handler
            server.on('error', (error) => {
                logError('Development server error occurred: %s', error.message);
                
                // Provide development-specific error guidance
                if (error.code === 'EADDRINUSE') {
                    logError('DEVELOPMENT ERROR: Port %d is already in use', devConfig.port);
                    logError('Development Solutions:');
                    logError('  • Stop the conflicting service using that port');
                    logError('  • Change the PORT environment variable to use a different port');
                    logError('  • Use: PORT=3001 npm run dev');
                    logError('  • Kill processes using port: npx kill-port %d', devConfig.port);
                } else if (error.code === 'EACCES') {
                    logError('DEVELOPMENT ERROR: Permission denied for port %d', devConfig.port);
                    logError('Development Solutions:');
                    logError('  • Use a port number above 1024');
                    logError('  • Try: PORT=3001 npm run dev');
                    logError('  • Run as administrator (not recommended)');
                } else {
                    logError('DEVELOPMENT ERROR: %s', error.code);
                    logError('Error Details: %s', error.stack);
                }
                
                // Exit with error code for development feedback
                logError('Development server startup failed - exiting with code 1');
                process.exit(1);
            });
            
        } else {
            logError('Development server instance not available - server.mjs may not be properly imported');
            logError('Development troubleshooting: Check server.mjs import and export');
            process.exit(1);
        }
        
    } catch (error) {
        // Handle any unexpected errors during development server startup
        logError('Critical error during development server startup: %s', error.message);
        logError('Development error details: %s', error.stack);
        logError('Development troubleshooting: Check configuration and dependencies');
        
        // Exit with error code indicating development startup failure
        process.exit(1);
    }
}

/**
 * Handles process signals (SIGINT, SIGTERM) for graceful shutdown in development mode.
 * Provides enhanced development feedback, comprehensive shutdown logging, and educational
 * transparency for the server shutdown process.
 * 
 * This function implements comprehensive development-specific shutdown handling including:
 * - Development signal recognition and logging
 * - Enhanced shutdown feedback for developer experience
 * - Educational transparency in shutdown process
 * - Graceful server connection closure
 * - Development session summary and statistics
 * - Process termination with appropriate exit codes
 * 
 * Educational Purpose:
 * Demonstrates professional process lifecycle management, signal handling best practices,
 * and the importance of graceful shutdown in development environments for data integrity
 * and resource cleanup.
 * 
 * Development Features:
 * - Enhanced shutdown logging with development context
 * - Session duration calculation and display
 * - Development statistics and feedback
 * - Educational process lifecycle demonstration
 * - Comprehensive error handling during shutdown
 * 
 * @returns {void} - Performs graceful shutdown and exits the process
 */
function handleDevProcessSignals() {
    // Step 1: Register SIGINT handler (Ctrl+C) for development shutdown
    process.on('SIGINT', () => {
        const sessionDuration = devStartTime ? Date.now() - devStartTime : 0;
        
        logInfo('=== DEVELOPMENT SERVER SHUTDOWN INITIATED ===');
        logInfo('SIGINT signal received (Ctrl+C) - starting graceful shutdown...');
        logInfo('Development session duration: %dms', sessionDuration);
        
        // Provide development context for the shutdown
        logInfo('Development shutdown sequence:');
        logInfo('  1. Signal received and acknowledged');
        logInfo('  2. Stopping HTTP server...');
        logInfo('  3. Closing existing connections...');
        logInfo('  4. Cleaning up resources...');
        logInfo('  5. Exiting process...');
        
        // Call graceful shutdown with development context
        gracefulDevShutdown('SIGINT');
    });
    
    // Step 2: Register SIGTERM handler (process termination) for development shutdown
    process.on('SIGTERM', () => {
        const sessionDuration = devStartTime ? Date.now() - devStartTime : 0;
        
        logInfo('=== DEVELOPMENT SERVER SHUTDOWN INITIATED ===');
        logInfo('SIGTERM signal received - starting graceful shutdown...');
        logInfo('Development session duration: %dms', sessionDuration);
        
        // Provide development context for the shutdown
        logInfo('Development shutdown reason: Process termination requested');
        
        // Call graceful shutdown with development context
        gracefulDevShutdown('SIGTERM');
    });
    
    // Step 3: Register uncaught exception handler for development error handling
    process.on('uncaughtException', (error) => {
        logError('=== DEVELOPMENT ERROR: UNCAUGHT EXCEPTION ===');
        logError('Uncaught exception in development mode: %s', error.message);
        logError('Development error details: %s', error.stack);
        logError('Development troubleshooting: Check code for unhandled errors');
        
        // Call graceful shutdown with error context
        gracefulDevShutdown('UNCAUGHT_EXCEPTION');
    });
    
    // Step 4: Register unhandled rejection handler for development Promise errors
    process.on('unhandledRejection', (reason, promise) => {
        logError('=== DEVELOPMENT ERROR: UNHANDLED PROMISE REJECTION ===');
        logError('Unhandled promise rejection in development mode: %s', reason);
        logError('Development error promise: %s', promise);
        logError('Development troubleshooting: Check Promise error handling');
        
        // Call graceful shutdown with error context
        gracefulDevShutdown('UNHANDLED_REJECTION');
    });
    
    // Step 5: Register process warning handler for development debugging
    process.on('warning', (warning) => {
        logWarn('=== DEVELOPMENT WARNING ===');
        logWarn('Process warning in development mode: %s', warning.message);
        logWarn('Warning details - Name: %s, Code: %s', warning.name, warning.code);
        if (warning.stack) {
            logWarn('Warning stack: %s', warning.stack);
        }
    });
    
    // Step 6: Log successful signal handler registration
    logInfo('Development process signal handlers registered successfully');
    logInfo('Development shutdown methods:');
    logInfo('  • Press Ctrl+C (SIGINT) for graceful shutdown');
    logInfo('  • Send SIGTERM signal for process termination');
    logInfo('  • Uncaught exceptions will trigger graceful shutdown');
    logInfo('  • Unhandled Promise rejections will trigger graceful shutdown');
}

/**
 * Performs graceful shutdown of the development server with enhanced logging,
 * development statistics, and educational transparency.
 * 
 * @param {string} shutdownReason - The reason for shutdown (SIGINT, SIGTERM, etc.)
 * @returns {void} - Closes the server and exits the process
 */
function gracefulDevShutdown(shutdownReason) {
    const sessionDuration = devStartTime ? Date.now() - devStartTime : 0;
    
    logInfo('=== DEVELOPMENT SERVER GRACEFUL SHUTDOWN ===');
    logInfo('Shutdown reason: %s', shutdownReason);
    logInfo('Development session duration: %dms', sessionDuration);
    
    // Check if server exists and is listening
    if (server && server.listening) {
        logInfo('Closing development HTTP server...');
        
        // Call server.close() to stop accepting new connections
        server.close((error) => {
            if (error) {
                logError('Development server close error: %s', error.message);
                logError('Development shutdown failed - exiting with error code 1');
                process.exit(1);
            } else {
                logInfo('Development HTTP server closed successfully');
                logInfo('Development session summary:');
                logInfo('  Session Duration: %dms', sessionDuration);
                logInfo('  Process ID: %d', devProcessId);
                logInfo('  Environment: %s', devConfig ? devConfig.env : 'unknown');
                logInfo('  Shutdown Reason: %s', shutdownReason);
                
                logInfo('=== DEVELOPMENT SERVER SHUTDOWN COMPLETE ===');
                logInfo('Development server has been gracefully shutdown');
                logInfo('Thank you for using the Node.js Tutorial HTTP Server!');
                
                // Exit with success code
                process.exit(0);
            }
        });
        
        // Set timeout for forceful shutdown if graceful shutdown takes too long
        setTimeout(() => {
            logWarn('Development shutdown timeout - forcing process termination');
            process.exit(1);
        }, 5000); // 5 second timeout for development
        
    } else {
        logInfo('Development server not listening - proceeding with process termination');
        logInfo('Development shutdown complete - exiting with success code 0');
        process.exit(0);
    }
}

/**
 * Development script initialization and startup sequence
 * 
 * This section executes the complete development application startup process including:
 * - Development mode initialization and banner display
 * - Process signal handler registration for development lifecycle
 * - HTTP server startup with enhanced development diagnostics
 * - Error handling for development startup failures
 * - Comprehensive logging for development learning and debugging
 * 
 * Educational Purpose:
 * Demonstrates professional development script patterns, environment-specific initialization,
 * and the importance of comprehensive logging and error handling in development environments.
 */

try {
    // Step 1: Display development script startup banner
    logInfo('=== NODE.JS TUTORIAL DEVELOPMENT SCRIPT STARTING ===');
    logInfo('Initializing development environment...');
    
    // Step 2: Register development process signal handlers first
    logInfo('Registering development process signal handlers...');
    handleDevProcessSignals();
    
    // Step 3: Start the development HTTP server
    logInfo('Starting development HTTP server...');
    startDevServer();
    
    // Step 4: Log successful development script startup
    logInfo('Development script initialization completed successfully');
    
} catch (error) {
    // Handle any critical errors during development script startup
    logError('Critical development script startup error: %s', error.message);
    logError('Development startup error details: %s', error.stack);
    logError('Development troubleshooting: Check script dependencies and imports');
    
    // Exit with error code indicating development script failure
    process.exit(1);
}