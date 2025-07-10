// Import logging functions from the logger utility module
import { logInfo, logWarn, logError } from './utils/logger.mjs';

/**
 * Default server port number for HTTP server binding
 * Used when PORT environment variable is not set or invalid
 */
const DEFAULT_PORT = 3000;

/**
 * Default host address for HTTP server binding
 * Used when HOST environment variable is not set or invalid
 */
const DEFAULT_HOST = 'localhost';

/**
 * Default Node.js environment setting
 * Used when NODE_ENV environment variable is not set or invalid
 */
const DEFAULT_ENV = 'development';

/**
 * Minimum allowed port number for server binding
 * Prevents binding to privileged ports (< 1025) for security and cross-platform compatibility
 */
const MIN_PORT = 1025;

/**
 * Maximum allowed port number for server binding
 * Ensures port number is within valid TCP port range
 */
const MAX_PORT = 65535;

/**
 * Loads and returns the effective server configuration, supporting environment variable overrides,
 * default values, and validation. Ensures the port is in a valid range, the host is a valid string,
 * and the environment is set. Logs configuration loading and any fallbacks or errors.
 * 
 * This function centralizes configuration logic for maintainability and testability,
 * providing a single source of truth for server configuration parameters.
 * 
 * @returns {Object} An object containing { port, host, env } for server startup and binding
 * @throws {Error} Does not throw errors; instead uses fallback values and logs warnings
 */
export function getConfig() {
    // Initialize configuration object to store validated values
    const config = {};

    // Step 1: Read and validate PORT environment variable
    const portEnv = process.env.PORT;
    
    if (portEnv === undefined || portEnv === null || portEnv === '') {
        // PORT environment variable not set, use default value
        config.port = DEFAULT_PORT;
        logInfo('PORT environment variable not set, using default port: %d', DEFAULT_PORT);
    } else {
        // Parse PORT environment variable as integer
        const parsedPort = parseInt(portEnv, 10);
        
        // Validate parsed port is a valid number and within allowed range
        if (isNaN(parsedPort) || parsedPort < MIN_PORT || parsedPort > MAX_PORT) {
            // Invalid port value, log warning and use default
            logWarn('Invalid PORT environment variable "%s". Port must be a number between %d and %d. Using default port: %d', 
                    portEnv, MIN_PORT, MAX_PORT, DEFAULT_PORT);
            config.port = DEFAULT_PORT;
        } else {
            // Valid port value, use parsed value
            config.port = parsedPort;
            logInfo('Using PORT from environment variable: %d', config.port);
        }
    }

    // Step 2: Read and validate HOST environment variable
    const hostEnv = process.env.HOST;
    
    if (hostEnv === undefined || hostEnv === null || hostEnv === '') {
        // HOST environment variable not set, use default value
        config.host = DEFAULT_HOST;
        logInfo('HOST environment variable not set, using default host: %s', DEFAULT_HOST);
    } else {
        // Validate HOST is a non-empty string after trimming whitespace
        const trimmedHost = hostEnv.trim();
        
        if (trimmedHost.length === 0) {
            // Empty or whitespace-only host, log warning and use default
            logWarn('Invalid HOST environment variable "%s". Host must be a non-empty string. Using default host: %s', 
                    hostEnv, DEFAULT_HOST);
            config.host = DEFAULT_HOST;
        } else {
            // Valid host value, use trimmed value
            config.host = trimmedHost;
            logInfo('Using HOST from environment variable: %s', config.host);
        }
    }

    // Step 3: Read and validate NODE_ENV environment variable
    const nodeEnv = process.env.NODE_ENV;
    
    if (nodeEnv === undefined || nodeEnv === null || nodeEnv === '') {
        // NODE_ENV environment variable not set, use default value
        config.env = DEFAULT_ENV;
        logInfo('NODE_ENV environment variable not set, using default environment: %s', DEFAULT_ENV);
    } else {
        // Validate NODE_ENV is a non-empty string after trimming whitespace
        const trimmedEnv = nodeEnv.trim();
        
        if (trimmedEnv.length === 0) {
            // Empty or whitespace-only environment, log warning and use default
            logWarn('Invalid NODE_ENV environment variable "%s". Environment must be a non-empty string. Using default environment: %s', 
                    nodeEnv, DEFAULT_ENV);
            config.env = DEFAULT_ENV;
        } else {
            // Valid environment value, use trimmed value
            config.env = trimmedEnv;
            logInfo('Using NODE_ENV from environment variable: %s', config.env);
        }
    }

    // Step 4: Log the final effective configuration for transparency and debugging
    logInfo('Server configuration loaded successfully - Port: %d, Host: %s, Environment: %s', 
            config.port, config.host, config.env);

    // Step 5: Return the validated configuration object
    return {
        port: config.port,
        host: config.host,
        env: config.env
    };
}