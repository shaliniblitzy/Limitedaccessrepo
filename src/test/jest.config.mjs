/**
 * Jest Configuration Placeholder
 * 
 * IMPORTANT: Jest is NOT used in this Node.js tutorial project.
 * 
 * This file exists solely to document the project's testing strategy and prevent
 * confusion for developers who might expect Jest configuration files.
 * 
 * Testing Framework: Node.js Built-in Test Runner (node:test)
 * - Zero external dependencies
 * - Native to Node.js 20+ LTS
 * - Educational clarity and simplicity
 * - Modern testing capabilities without additional setup
 * 
 * Educational Decision Rationale:
 * The Node.js tutorial application uses the built-in test runner to demonstrate
 * fundamental testing concepts without external framework complexity. This approach
 * aligns with the project's educational objectives and zero-dependency philosophy.
 * 
 * @see Technical Specifications/6.6 TESTING STRATEGY/6.6.1 Unit Testing
 * @see https://nodejs.org/api/test.html
 */

// Jest configuration is intentionally not implemented
// This prevents accidental Jest usage and clarifies the testing approach

export default {
  // This configuration object exists only for documentation purposes
  // It should never be used for actual Jest configuration
  
  /**
   * WARNING: Do not attempt to use Jest with this project
   * 
   * Instead, use the following commands for testing:
   * - npm test              (run all tests)
   * - npm run test:watch    (run tests in watch mode)
   * - npm run test:coverage (run tests with coverage)
   * 
   * All test commands use Node.js built-in test runner:
   * - node --test                           (basic test execution)
   * - node --test --watch                   (watch mode)
   * - node --test --experimental-test-coverage (with coverage)
   */
  
  displayName: 'JEST NOT USED - See package.json scripts',
  testEnvironment: 'NOT_APPLICABLE',
  testMatch: ['**/*.test.mjs'],
  
  // Redirect developers to correct testing approach
  setupFilesAfterEnv: [
    // This would normally contain Jest setup files
    // Instead, this serves as documentation
    'USE_NODE_BUILT_IN_TEST_RUNNER_INSTEAD'
  ],
  
  // Documentation of actual test configuration
  collectCoverageFrom: [
    // Coverage is handled by Node.js built-in test runner
    // Use: node --test --experimental-test-coverage
    'COVERAGE_VIA_NODE_TEST_RUNNER'
  ],
  
  // Test framework comparison for educational purposes
  testFramework: {
    current: 'Node.js Built-in Test Runner',
    alternative: 'Jest (not used)',
    rationale: [
      'Zero external dependencies',
      'Native Node.js integration',
      'Educational simplicity',
      'Modern testing capabilities',
      'LTS compatibility'
    ]
  },
  
  // Commands that developers should use instead of Jest
  recommendedCommands: {
    runTests: 'npm test',
    watchMode: 'npm run test:watch',
    coverage: 'npm run test:coverage',
    singleTest: 'node --test path/to/specific.test.mjs'
  },
  
  // Educational resources for Node.js testing
  documentation: {
    nodeTestRunner: 'https://nodejs.org/api/test.html',
    testingBestPractices: 'See Technical Specifications/6.6 TESTING STRATEGY',
    examples: 'See test/ directory for test implementation patterns'
  }
};

/**
 * Migration Note for Jest Users:
 * 
 * If you're familiar with Jest and looking for equivalent functionality:
 * 
 * Jest Feature              | Node.js Built-in Test Runner Equivalent
 * --------------------------|------------------------------------------
 * describe/test blocks      | describe/test from 'node:test'
 * expect assertions         | assert from 'node:assert'
 * beforeEach/afterEach      | beforeEach/afterEach from 'node:test'
 * test.skip                 | test.skip from 'node:test'
 * test.only                 | test.only from 'node:test'
 * Coverage reporting        | --experimental-test-coverage flag
 * Watch mode               | --watch flag
 * Parallel execution       | --test-concurrency flag
 * 
 * Example test file using Node.js built-in test runner:
 * 
 * ```javascript
 * import { test, describe } from 'node:test';
 * import assert from 'node:assert';
 * 
 * describe('Hello Endpoint', () => {
 *   test('should return hello world', () => {
 *     assert.strictEqual('Hello world', 'Hello world');
 *   });
 * });
 * ```
 */

// Error function to prevent accidental Jest usage
function preventJestUsage() {
  throw new Error(`
    Jest is not configured for this project.
    
    This Node.js tutorial application uses the built-in test runner.
    
    Please use these commands instead:
    - npm test (run all tests)
    - npm run test:watch (watch mode)
    - npm run test:coverage (with coverage)
    
    For more information, see the Technical Specifications document.
  `);
}

// Export error function to catch accidental usage
export { preventJestUsage as default };