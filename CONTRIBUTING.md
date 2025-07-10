# Contributing to Node.js Tutorial Application

Thank you for your interest in contributing to the Node.js tutorial application! This project is designed as an educational resource to help developers learn Node.js fundamentals. We welcome contributions that improve code clarity, documentation, and educational value.

## Code of Conduct

All contributors are expected to adhere to the project's Code of Conduct. Please be respectful and constructive in all interactions.

## How to Contribute

### Getting Started

1. **Fork the repository** and create a new branch for your feature or bugfix.
2. **Write clear, well-documented code** with comments explaining non-obvious logic.
3. **Follow the code style** and linting rules defined in `.eslintrc.json`.
4. **Add or update tests** to cover your changes. Use the built-in Node.js test runner.
5. **Ensure your code runs** on Node.js 22.x LTS or higher.
6. **Do not add external dependencies** unless absolutely necessary and justified for educational value.
7. **Update documentation** (README.md, docs/, or inline comments) as appropriate.

### Development Environment Setup

Ensure you have the following requirements:
- **Node.js**: Version 22.x LTS or higher
- **npm**: Version 11.4.2 or higher
- **Operating System**: Cross-platform (Windows, macOS, Linux)

Verify your setup:
```bash
node --version  # Should show 22.x or higher
npm --version   # Should show 11.4.2 or higher
```

## Pull Request Process

1. **Submit a pull request (PR)** with a clear description of your changes and the problem they solve.
2. **Reference any related issues** in your PR description using keywords like "Fixes #123" or "Closes #456".
3. **Ensure all tests pass** and code is linted before submitting:
   ```bash
   npm test
   npm run lint
   ```
4. **PRs will be reviewed** for code quality, educational clarity, and alignment with project scope.
5. **Respond to review feedback** and make necessary changes promptly.

### PR Title Guidelines

Use clear, descriptive titles following this format:
- `fix: handle 404 errors for unknown routes`
- `feat: add comprehensive JSDoc comments`
- `docs: update README with installation instructions`
- `test: add integration tests for error handling`

## Issue Reporting

### Before Opening an Issue

1. **Search existing issues** before opening a new one to avoid duplicates.
2. **Check the documentation** and README for answers to common questions.

### Creating a New Issue

1. **Provide a clear, descriptive title** that summarizes the issue.
2. **Include a detailed explanation** with the following information:
   - Steps to reproduce the issue
   - Expected behavior
   - Actual behavior
   - Node.js version and operating system
   - Any relevant error messages or logs
3. **Label your issue appropriately** (bug, enhancement, question, documentation, etc.).

### Issue Templates

Use these templates for consistency:

**Bug Report:**
```markdown
**Description:** Brief description of the bug
**Steps to Reproduce:** 
1. Step one
2. Step two
3. Step three
**Expected Behavior:** What should happen
**Actual Behavior:** What actually happens
**Environment:** Node.js version, OS, npm version
**Additional Context:** Any other relevant information
```

**Feature Request:**
```markdown
**Description:** Brief description of the proposed feature
**Educational Value:** How this improves learning outcomes
**Implementation Ideas:** Suggestions for implementation
**Alternatives Considered:** Other approaches you've considered
```

## Scope of Contributions

### In Scope ✅

We welcome contributions in the following areas:
- **Code clarity improvements** and documentation enhancements
- **Bug fixes** and error handling enhancements
- **Test coverage improvements** and testing examples
- **Educational examples** and explanations in comments
- **Performance optimizations** that maintain simplicity
- **Documentation updates** for README, inline comments, and guides

### Out of Scope ❌

The following contributions are outside the project's educational scope:
- **Database integration** or persistence features
- **Authentication, authorization,** or session management
- **Advanced routing,** middleware, or production deployment features
- **Non-educational third-party dependencies** that add complexity
- **Complex business logic** that obscures fundamental concepts
- **Production-grade features** beyond the tutorial scope

## Coding Standards

### Language and Runtime
- **Language**: JavaScript (ES Modules, Node.js 22.x LTS+)
- **Module System**: ES Modules (import/export syntax)
- **Runtime**: Node.js 22.x LTS with Active LTS support

### Style Guide
- **Follow the project's** `.eslintrc.json` and `jsconfig.json` configurations
- **Use ESLint** for code linting and style consistency
- **Run linting** before submitting: `npm run lint`

### Naming Conventions
- **Variables and functions**: Use descriptive, lowerCamelCase
- **Classes**: Use UpperCamelCase
- **Constants**: Use UPPER_SNAKE_CASE
- **Files**: Use kebab-case for file names (e.g., `hello-handler.mjs`)

### Documentation Requirements
- **Document all functions** and classes with JSDoc comments
- **Add inline comments** for complex logic and educational explanations
- **Include examples** in documentation where helpful
- **Explain the "why"** not just the "what" in comments

### Example Code Style
```javascript
/**
 * Handles HTTP requests to the /hello endpoint
 * Educational Note: This demonstrates basic request routing in Node.js
 * 
 * @param {http.IncomingMessage} request - The HTTP request object
 * @param {http.ServerResponse} response - The HTTP response object
 */
function handleHelloRequest(request, response) {
    // Set Content-Type header to indicate plain text response
    response.setHeader('Content-Type', 'text/plain');
    
    // Return successful status code with hello message
    response.writeHead(200);
    response.end('Hello world');
}
```

## Testing Requirements

### Test Framework
- **Framework**: Node.js built-in test runner (`node --test`)
- **Assertion Library**: Node.js built-in assert module
- **No external testing dependencies** required

### Coverage Requirements
- **Strive for 90%+ code coverage** for all contributions
- **All new features** and bug fixes must include tests
- **Run tests** before submitting: `npm test`
- **Check coverage**: `npm run test:coverage`

### Test Organization
Place tests in the appropriate directories:
- **Unit tests**: `src/test/unit/`
- **Integration tests**: `src/test/integration/`
- **Performance tests**: `src/test/performance/`

### Test Naming Conventions
- **Test files**: Use `*.test.mjs` pattern
- **Test descriptions**: Use descriptive, behavior-driven naming
- **Test functions**: `test('should return hello world for /hello endpoint', ...)`

### Example Test Structure
```javascript
import { test, describe } from 'node:test';
import assert from 'node:assert';

describe('Hello Endpoint', () => {
    test('should return hello world for /hello endpoint', async () => {
        // Test implementation
        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(response.body, 'Hello world');
    });
});
```

## Commit Guidelines

### Commit Message Format
Use clear, descriptive commit messages following this pattern:
```
<type>: <description>

<optional body>

<optional footer>
```

### Commit Types
- **feat**: New features or enhancements
- **fix**: Bug fixes
- **docs**: Documentation updates
- **test**: Test additions or improvements
- **refactor**: Code refactoring without functional changes
- **style**: Code style changes (formatting, etc.)
- **chore**: Maintenance tasks

### Examples
- `feat: add comprehensive error handling for undefined routes`
- `fix: handle port binding failures gracefully`
- `docs: update README with Node.js version requirements`
- `test: add integration tests for server lifecycle`

### Atomicity
- **Each commit should represent a single logical change**
- **Keep commits focused** and avoid mixing unrelated changes
- **Use multiple commits** for complex features with logical separation

## Review Process

### Review Criteria
All pull requests will be reviewed based on:
- **Code correctness** and functionality
- **Educational clarity** and learning value
- **Adherence to coding standards** and style guidelines
- **Test coverage** and passing status
- **Documentation quality** and completeness
- **No unnecessary dependencies** or complexity

### Reviewers
- **At least one project maintainer** must review and approve your PR
- **Reviews focus on** educational value and code quality
- **Feedback is constructive** and aimed at improvement

### Review Timeline
- **Initial review**: Within 2-3 business days
- **Follow-up reviews**: Within 1-2 business days after changes
- **Approval and merge**: After all requirements are met

## Development Workflow

### Running the Application
```bash
# Start the server
npm start

# Run in development mode with auto-restart
npm run dev

# Test the endpoint
curl http://localhost:3000/hello
```

### Testing Commands
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
node --test src/test/unit/hello-endpoint.test.mjs
```

### Linting Commands
```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Check for linting errors
npm run lint:check
```

## Resources for Contributors

### Learning Materials
- [Node.js Official Documentation](https://nodejs.org/docs/)
- [Node.js Built-in Test Runner](https://nodejs.org/api/test.html)
- [ES Modules in Node.js](https://nodejs.org/api/esm.html)

### Development Tools
- **Editor**: VS Code with Node.js extensions recommended
- **Debugging**: Use Node.js built-in debugger or VS Code debug features
- **Git**: Use conventional commit messages and meaningful branch names

### Project Structure
```
project/
├── src/
│   ├── server.mjs          # Main server implementation
│   └── test/
│       ├── unit/           # Unit tests
│       ├── integration/    # Integration tests
│       └── performance/    # Performance tests
├── docs/                   # Additional documentation
├── .eslintrc.json         # ESLint configuration
├── jsconfig.json          # JavaScript configuration
├── package.json           # Node.js package configuration
├── README.md              # Project overview
└── CONTRIBUTING.md        # This file
```

## Contact and Support

### Getting Help
- **Questions**: Open an issue with the "question" label
- **Discussions**: Use GitHub Discussions for broader topics
- **Documentation**: Check the README and docs/ directory first

### Communication Channels
- **GitHub Issues**: Primary channel for bug reports and feature requests
- **GitHub Discussions**: Community discussions and questions
- **Pull Request Comments**: Code review and implementation discussions

### Maintainer Contact
For questions about contributions, open an issue or contact the maintainers via GitHub Discussions.

---

## Quick Reference

### Before You Contribute Checklist
- [ ] Fork the repository and create a feature branch
- [ ] Ensure Node.js 22.x LTS+ is installed
- [ ] Write clear, documented code with educational comments
- [ ] Follow ESLint rules and coding standards
- [ ] Add or update tests for your changes
- [ ] Run `npm test` and ensure all tests pass
- [ ] Run `npm run lint` and fix any style issues
- [ ] Update documentation if needed
- [ ] Write clear commit messages
- [ ] Open a pull request with detailed description

### Quick Commands
```bash
# Setup
npm install

# Development
npm start
npm run dev

# Testing
npm test
npm run test:coverage

# Linting
npm run lint
npm run lint:fix

# Check everything
npm run verify  # Runs tests and linting
```

Thank you for contributing to the Node.js tutorial application! Your contributions help make Node.js learning more accessible and effective for developers worldwide.