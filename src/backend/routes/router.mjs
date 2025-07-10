// Import the hello endpoint handler for GET requests to '/hello'
// This handler processes the main tutorial functionality
import { handleHello } from '../handlers/helloHandler.mjs';

// Import error handling functions for undefined routes and unsupported methods
// These handlers ensure proper HTTP protocol compliance and error responses
import { handleNotFound, handleMethodNotAllowed } from '../handlers/errorHandler.mjs';

// Import logging functions for request tracking and observability
// Provides structured logging for routing decisions and request processing
import { logInfo, logWarn } from '../utils/logger.mjs';

/**
 * Global routes configuration object that maps URL paths to supported HTTP methods and handlers.
 * This centralized routing table defines all available endpoints and their corresponding handlers.
 * 
 * Educational Purpose: Demonstrates a simple routing structure that can be easily extended
 * with additional endpoints and HTTP methods as the tutorial application grows.
 * 
 * Structure: { '/path': { 'METHOD': handlerFunction } }
 */
const ROUTES = {
    '/hello': {
        GET: handleHello
    }
};

/**
 * Main router function for the HTTP server. Inspects the request URL and method,
 * matches against defined routes, and dispatches to the appropriate handler.
 * Handles 404 and 405 errors for undefined routes and unsupported methods, respectively.
 * Logs all routing decisions for observability and educational analysis.
 * 
 * Educational Purpose: Demonstrates core routing concepts including URL parsing,
 * method validation, route matching, and proper HTTP error handling. This router
 * serves as a foundation for understanding how web frameworks handle request routing.
 * 
 * Design Principles:
 * - Protocol Compliance: Follows HTTP/1.1 standards for status codes and headers
 * - Educational Clarity: Simple, well-documented routing logic for learning
 * - Observability: Comprehensive logging for debugging and analysis
 * - Maintainability: Centralized route configuration and modular handler dispatch
 * - Error Handling: Proper 404 and 405 responses with appropriate headers
 * 
 * @param {http.IncomingMessage} req - The HTTP request object containing client request data
 *                                    including method, URL, headers, and other request metadata
 * @param {http.ServerResponse} res - The HTTP response object for sending data back to the client
 *                                   including status codes, headers, and response body
 * @returns {void} - Ends the response stream after dispatching to the appropriate handler
 */
export function router(req, res) {
    try {
        // Step 1: Extract the pathname from req.url using the WHATWG URL API
        // Use new URL(req.url, `http://${req.headers.host}`) to create a URL object
        // The host header is required for proper URL parsing
        const baseURL = `http://${req.headers.host || 'localhost'}`;
        const urlObject = new URL(req.url, baseURL);
        let pathname = urlObject.pathname;
        
        // Step 2: Normalize the pathname (remove trailing slashes except for root)
        // This ensures consistent route matching regardless of trailing slash presence
        if (pathname !== '/' && pathname.endsWith('/')) {
            pathname = pathname.slice(0, -1);
        }
        
        // Step 3: Extract the HTTP method from req.method and convert to uppercase
        // This ensures consistent method matching regardless of case
        const method = req.method.toUpperCase();
        
        // Step 4: Log the incoming request with logInfo, including method and path
        // This provides visibility into all routing decisions for observability
        logInfo('Processing request - Method: %s, Path: %s, Original URL: %s', 
                method, pathname, req.url);
        
        // Log additional request context for educational purposes
        logInfo('Request headers - Host: %s, User-Agent: %s, Accept: %s',
                req.headers.host || 'unknown',
                req.headers['user-agent'] || 'unknown',
                req.headers['accept'] || 'unknown');
        
        // Step 5: Check if the pathname exists in ROUTES
        if (pathname in ROUTES) {
            // Route exists - log the route match
            logInfo('Route found for path: %s', pathname);
            
            // Step 6: Check if the method is supported for this route
            const routeConfig = ROUTES[pathname];
            if (method in routeConfig) {
                // Step 7: Method is supported, dispatch to the corresponding handler
                logInfo('Method %s is supported for path %s - dispatching to handler', 
                        method, pathname);
                
                // Get the handler function and call it with req and res
                const handler = routeConfig[method];
                handler(req, res);
                
                // Log successful handler dispatch
                logInfo('Handler dispatched successfully for %s %s', method, pathname);
                
            } else {
                // Step 8: Method is not supported, call handleMethodNotAllowed
                // Get the list of allowed methods for this route
                const allowedMethods = Object.keys(routeConfig);
                
                logWarn('Method %s not allowed for path %s - allowed methods: %s', 
                        method, pathname, allowedMethods.join(', '));
                
                // Call handleMethodNotAllowed with req, res, and the list of allowed methods
                handleMethodNotAllowed(req, res, allowedMethods);
            }
            
        } else {
            // Step 9: Route does not exist, call handleNotFound
            logWarn('Route not found for path: %s', pathname);
            
            // Call handleNotFound with req and res
            handleNotFound(req, res);
        }
        
    } catch (error) {
        // Handle any unexpected errors during routing
        logWarn('Error during request routing: %s', error.message);
        
        // Log the error details for debugging
        logWarn('Routing error details - URL: %s, Method: %s, Stack: %s', 
                req.url, req.method, error.stack);
        
        // Attempt to send a 500 error response if headers haven't been sent
        if (!res.headersSent) {
            try {
                res.statusCode = 500;
                res.statusMessage = 'Internal Server Error';
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                res.end('Internal Server Error');
                
                logInfo('500 Internal Server Error response sent due to routing error');
                
            } catch (responseError) {
                logWarn('Failed to send error response: %s', responseError.message);
            }
        }
    }
}