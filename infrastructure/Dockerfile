# Use the official Node.js 22.x LTS slim image as the base
# This provides a minimal, security-focused foundation with the required Node.js runtime
# node:22-slim reduces attack surface and image size compared to the full node:22 image
FROM node:22-slim

# Set the working directory inside the container
# All subsequent commands will be executed relative to this directory
# Using /usr/src/app follows Node.js container best practices
WORKDIR /usr/src/app

# Copy all backend source code from the src/backend directory to the container
# This includes server.mjs, config.mjs, package.json, all route handlers, utilities, and scripts
# The ./ destination copies files directly to the WORKDIR (/usr/src/app)
COPY ./src/backend ./

# Set NODE_ENV environment variable to production
# This optimizes Node.js runtime performance and enables production-specific behaviors
# Can be overridden by docker-compose for development environments
ENV NODE_ENV=production

# Set the default port environment variable
# Matches the backend server's default port configuration (3000)
# Can be overridden by docker-compose, Docker run, or orchestration platforms
ENV PORT=3000

# Expose port 3000 for HTTP server communication
# This declares the port for inter-container communication and host port mapping
# Enables the container to receive HTTP requests on the specified port
EXPOSE 3000

# Define the container entrypoint command
# Starts the Node.js HTTP server using the main server.mjs file
# Uses ES module execution mode as configured in package.json (type: "module")
# No npm install required as the backend uses only Node.js built-in modules
CMD ["node", "server.mjs"]