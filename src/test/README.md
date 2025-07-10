# Node.js Tutorial HTTP Server - Test Suite Documentation

## Overview

This README provides comprehensive documentation for the test suite of the Node.js tutorial HTTP server. The test suite is designed to validate the server's functionality, performance, and educational value while demonstrating testing best practices using only Node.js built-in modules.

## Table of Contents

1. [Test Suite Architecture](#test-suite-architecture)
2. [Test Types and Organization](#test-types-and-organization)
3. [Getting Started](#getting-started)
4. [Running Tests](#running-tests)
5. [Test Coverage](#test-coverage)
6. [Test Helpers and Utilities](#test-helpers-and-utilities)
7. [CI/CD Integration](#cicd-integration)
8. [Educational Best Practices](#educational-best-practices)
9. [Extending the Test Suite](#extending-the-test-suite)
10. [Troubleshooting](#troubleshooting)

## Test Suite Architecture

The test suite follows a structured architecture that separates concerns and provides comprehensive coverage of the Node.js tutorial HTTP server:

```
src/test/
├── unit/                    # Unit tests for individual components
│   ├── *.test.mjs          # Individual function and module tests
├── integration/            # Integration tests for HTTP workflows
│   ├── *.test.mjs          # End-to-end request-response cycle tests
├── performance/            # Performance validation tests
│   ├── memory-usage.test.mjs      # Memory consumption tests
│   ├── response-time.test.mjs     # Response latency tests
│   └── server-startup.test.mjs    # Server initialization tests
├── utils/                  # Test helpers and utilities
│   └── testHelpers.mjs     # Mock objects and test utilities
└── scripts/                # Test execution scripts
    ├── run-tests.mjs       # Main test runner
    ├── run-coverage.mjs    # Coverage analysis runner
    └── run-performance.mjs # Performance test runner
```

### Design Principles

- **Zero External Dependencies**: Uses only Node.js built-in modules (node:test, node:assert)
- **Educational Clarity**: Clear, well-documented test patterns for learning
- **Isolation**: Each test suite runs in isolation with proper cleanup
- **Comprehensive Coverage**: Unit, integration, and performance testing
- **CI/CD Ready**: Automated test execution with proper exit codes

## Test Types and Organization

### Unit Tests (`src/test/unit/`)

Unit tests focus on testing individual functions, modules, and components in isolation:

- **Purpose**: Validate individual functions and modules work correctly
- **Scope**: Test isolated components without external dependencies
- **Coverage**: All public functions and critical internal logic
- **Isolation**: Use mock objects for HTTP requests and responses

**Example unit test scenarios:**
- Request handler function validation
- Routing logic correctness
- Error handling behavior
- Utility function outputs

### Integration Tests (`src/test/integration/`)

Integration tests validate the complete HTTP request-response cycle:

- **Purpose**: Ensure components work together correctly
- **Scope**: End-to-end HTTP workflows from request to response
- **Coverage**: Server startup, request processing, response generation
- **Environment**: Real HTTP server instances with isolated ports

**Example integration test scenarios:**
- HTTP GET requests to `/hello` endpoint
- 404 error handling for undefined routes
- Server lifecycle management
- Response headers and content validation

### Performance Tests (`src/test/performance/`)

Performance tests measure and validate server performance characteristics:

- **Purpose**: Ensure the server meets performance requirements
- **Scope**: Response time, memory usage, startup time
- **Coverage**: Performance benchmarks and resource consumption
- **Thresholds**: Configurable performance limits and alerts

**Performance test categories:**
- **Response Time**: Validates `/hello` endpoint responds within 100ms
- **Memory Usage**: Ensures server operates within 50MB memory limit
- **Server Startup**: Verifies server starts within 1 second

## Getting Started

### Prerequisites

- Node.js 22.x or higher (LTS recommended)
- No external dependencies required
- Basic understanding of HTTP and Node.js concepts

### Environment Setup

The test suite uses environment variables for configuration:

```bash
# Test environment variables
export NODE_ENV=test
export TEST_PORT=3100
export TEST_HOST=127.0.0.1
export TEST_TIMEOUT=30000
```

### Project Structure Verification

Ensure your project structure matches the expected layout:

```
project-root/
├── src/
│   ├── backend/
│   │   ├── server.mjs       # Main server implementation
│   │   ├── config.mjs       # Configuration management
│   │   └── ...
│   └── test/
│       ├── unit/
│       ├── integration/
│       ├── performance/
│       ├── utils/
│       └── scripts/
```

## Running Tests

### Quick Start

Run all tests with a single command:

```bash
# Using npm script (recommended)
npm test

# Direct execution
node src/test/scripts/run-tests.mjs
```

### Test Suite Categories

#### Run All Tests
```bash
npm test
```
Executes unit, integration, and performance tests in sequence.

#### Run Unit Tests Only
```bash
node --test 'src/test/unit/*.test.mjs'
```
Executes only unit tests for individual component validation.

#### Run Integration Tests Only
```bash
node --test 'src/test/integration/*.test.mjs'
```
Executes only integration tests for HTTP workflow validation.

#### Run Performance Tests Only
```bash
npm run performance
# or
node src/test/scripts/run-performance.mjs
```
Executes only performance tests for benchmarking and validation.

#### Run Individual Test Files
```bash
node --test src/test/unit/specific-test.test.mjs
```
Executes a specific test file for focused debugging.

### Test Execution Options

#### Watch Mode (Development)
```bash
node --test --watch 'src/test/**/*.test.mjs'
```
Automatically re-runs tests when files change.

#### Verbose Output
```bash
node --test --test-reporter spec 'src/test/**/*.test.mjs'
```
Provides detailed test execution information.

#### TAP Output Format
```bash
node --test --test-reporter tap 'src/test/**/*.test.mjs'
```
Outputs Test Anything Protocol format for tool integration.

## Test Coverage

### Running Coverage Analysis

Generate comprehensive code coverage reports:

```bash
# Using npm script (recommended)
npm run coverage

# Direct execution
node src/test/scripts/run-coverage.mjs
```

### Coverage Metrics

The test suite maintains high coverage standards:

| Coverage Type | Target | Measurement |
|---|---|---|
| **Statement Coverage** | 95% | Percentage of code statements executed |
| **Branch Coverage** | 90% | Percentage of code branches tested |
| **Function Coverage** | 100% | Percentage of functions tested |
| **Line Coverage** | 95% | Percentage of executable lines tested |

### Coverage Reporting

Coverage reports are generated in multiple formats:

- **Console Output**: Real-time coverage summary
- **Text Report**: Detailed coverage breakdown
- **HTML Report**: Interactive coverage visualization (when configured)

### Coverage Thresholds

The test suite enforces minimum coverage requirements:

```javascript
// Coverage thresholds enforced by test runner
const coverageThresholds = {
    statements: 95,
    branches: 90,
    functions: 100,
    lines: 95
};
```

## Test Helpers and Utilities

### Test Helper Functions

The `src/test/utils/testHelpers.mjs` module provides essential testing utilities:

#### Mock Request Objects
```javascript
import { mockRequest } from './utils/testHelpers.mjs';

const req = mockRequest({
    method: 'GET',
    url: '/hello',
    headers: { 'User-Agent': 'test-client' }
});
```

#### Mock Response Objects
```javascript
import { mockResponse } from './utils/testHelpers.mjs';

const res = mockResponse();
// Use res.getBody() to get captured response content
// Use res.getCapturedHeaders() to get response headers
```

#### Test Server Management
```javascript
import { startTestServer } from './utils/testHelpers.mjs';

const server = await startTestServer(requestHandler);
// Server ready for integration testing
```

#### HTTP Request Utilities
```javascript
import { httpRequest } from './utils/testHelpers.mjs';

const response = await httpRequest({
    method: 'GET',
    path: '/hello'
});
// Returns { status, headers, body }
```

#### Configuration Overrides
```javascript
import { withTestConfig } from './utils/testHelpers.mjs';

await withTestConfig({ NODE_ENV: 'test' }, async () => {
    // Test logic with configuration overrides
});
```

#### Performance Measurement
```javascript
import { measureTime } from './utils/testHelpers.mjs';

const { result, ms } = await measureTime(async () => {
    // Function to measure
});
```

### Test Constants

Common test configuration constants:

```javascript
export const TEST_PORT = 3100;  // Isolated test port
export const TEST_HOST = '127.0.0.1';  // Local test host
```

## CI/CD Integration

### GitHub Actions Integration

The test suite integrates seamlessly with GitHub Actions workflows:

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - run: npm test
      - run: npm run coverage
```

### Exit Codes

The test suite uses standard exit codes for CI/CD integration:

- **0**: All tests passed successfully
- **1**: Test failures or execution errors
- **2**: System-level errors (Node.js not found, etc.)

### Test Automation Scripts

#### Comprehensive Test Runner (`run-tests.mjs`)
- Executes all test suites in sequence
- Provides real-time feedback and results
- Handles process lifecycle and cleanup
- Supports parallel test execution

#### Coverage Analysis Runner (`run-coverage.mjs`)
- Enables built-in Node.js coverage analysis
- Generates comprehensive coverage reports
- Enforces coverage thresholds
- Provides detailed coverage metrics

#### Performance Test Runner (`run-performance.mjs`)
- Executes performance validation tests
- Measures response time and resource usage
- Validates performance thresholds
- Generates performance reports

### Environment Variables

CI/CD environments can configure test behavior:

```bash
# CI/CD environment variables
NODE_ENV=test
CI=true
FORCE_COLOR=0
TEST_TIMEOUT=30000
```

## Educational Best Practices

### Code Quality Standards

The test suite demonstrates educational best practices:

#### Clear Test Naming
```javascript
test('should return "Hello world" for GET /hello endpoint', async () => {
    // Test implementation
});
```

#### Descriptive Test Documentation
```javascript
/**
 * Tests the hello endpoint functionality
 * Validates correct HTTP response and content
 */
describe('Hello Endpoint Tests', () => {
    // Test cases
});
```

#### Comprehensive Error Handling
```javascript
test('should handle server startup errors gracefully', async () => {
    try {
        // Test logic
    } catch (error) {
        // Proper error validation
    }
});
```

### Learning Objectives

The test suite supports these educational goals:

1. **HTTP Protocol Understanding**: Tests demonstrate HTTP request-response cycles
2. **Node.js Fundamentals**: Examples show built-in module usage
3. **Testing Best Practices**: Patterns demonstrate proper test structure
4. **Error Handling**: Tests show comprehensive error management
5. **Performance Awareness**: Performance tests teach optimization concepts

### Code Documentation

All test files include extensive documentation:

- **Purpose**: Clear explanation of what each test validates
- **Context**: Background information for educational understanding
- **Examples**: Practical examples for learning and reference
- **Best Practices**: Demonstrated patterns for test development

## Extending the Test Suite

### Adding New Unit Tests

1. Create a new test file in `src/test/unit/`
2. Follow the naming convention: `*.test.mjs`
3. Import required modules and helpers
4. Write descriptive test cases
5. Update this README with new test information

```javascript
// src/test/unit/new-feature.test.mjs
import { test, describe } from 'node:test';
import assert from 'node:assert';

describe('New Feature Tests', () => {
    test('should validate new feature functionality', () => {
        // Test implementation
    });
});
```

### Adding Integration Tests

1. Create test files in `src/test/integration/`
2. Use test helpers for server management
3. Test complete HTTP workflows
4. Ensure proper cleanup and isolation

### Adding Performance Tests

1. Create test files in `src/test/performance/`
2. Use performance measurement utilities
3. Define performance thresholds
4. Validate resource usage patterns

### Updating Test Helpers

1. Add new utilities to `src/test/utils/testHelpers.mjs`
2. Maintain consistent API patterns
3. Include comprehensive documentation
4. Update this README with new utilities

## Troubleshooting

### Common Issues

#### Test Failures

**Port Already in Use**
```bash
Error: EADDRINUSE: address already in use :::3100
```
Solution: Ensure no other processes are using TEST_PORT (3100)

**Node.js Version Compatibility**
```bash
SyntaxError: Unexpected token 'import'
```
Solution: Upgrade to Node.js 22.x or use proper ES module configuration

**Permission Errors**
```bash
Error: EACCES: permission denied
```
Solution: Check file permissions and avoid using privileged ports

#### Test Environment Issues

**Missing Test Files**
```bash
Error: Cannot find module './test/unit/example.test.mjs'
```
Solution: Verify test file structure and paths

**Configuration Problems**
```bash
Error: Configuration not found
```
Solution: Check environment variables and configuration files

### Debug Mode

Enable debug output for troubleshooting:

```bash
NODE_ENV=development npm test
```

### Performance Issues

**Slow Test Execution**
- Check system resources and available memory
- Verify no other high-CPU processes are running
- Consider running performance tests separately

**Memory Leaks**
- Monitor test process memory usage
- Ensure proper cleanup in test teardown
- Use `--inspect` flag for detailed memory analysis

### Getting Help

1. Review test output for specific error messages
2. Check this README for relevant troubleshooting steps
3. Verify Node.js version compatibility
4. Ensure project structure matches expectations
5. Check environment variable configuration

## Test Suite Maintenance

### Regular Maintenance Tasks

1. **Update Test Coverage**: Regularly review and improve test coverage
2. **Performance Baselines**: Update performance thresholds as needed
3. **Documentation Updates**: Keep README current with test changes
4. **Dependency Updates**: Monitor Node.js version compatibility

### Best Practices for Maintainers

1. **Test Isolation**: Ensure tests don't interfere with each other
2. **Clear Naming**: Use descriptive test and file names
3. **Comprehensive Coverage**: Test both success and failure scenarios
4. **Performance Monitoring**: Regularly validate performance thresholds
5. **Educational Value**: Maintain focus on learning objectives

## Contributing to the Test Suite

### Guidelines for Contributors

1. **Follow Existing Patterns**: Maintain consistency with established test patterns
2. **Include Documentation**: Add comprehensive comments and documentation
3. **Test Coverage**: Ensure new features include corresponding tests
4. **Performance Impact**: Consider performance implications of new tests
5. **Educational Value**: Focus on learning and demonstration purposes

### Code Review Checklist

- [ ] Tests follow established naming conventions
- [ ] All tests include proper documentation
- [ ] Test coverage meets minimum requirements
- [ ] Performance tests validate appropriate thresholds
- [ ] Integration tests use proper isolation
- [ ] Error handling is comprehensive
- [ ] README documentation is updated

---

## Summary

This test suite provides comprehensive validation of the Node.js tutorial HTTP server while demonstrating modern testing practices using only built-in Node.js modules. The suite supports educational objectives by providing clear examples, extensive documentation, and practical testing patterns that serve as learning resources for developers studying Node.js and HTTP server concepts.

The test suite is designed for:
- **Learners**: Clear examples and educational documentation
- **Contributors**: Extensible patterns and comprehensive guidelines
- **CI/CD**: Automated execution with proper exit codes and reporting
- **Maintainers**: Structured organization and maintenance guidelines

For additional information or support, refer to the main project README or review the individual test files for specific implementation details.