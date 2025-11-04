# Contributing to Cypress MCP Server

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## Getting Started

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/yourusername/cypress-mcp-server.git
   cd cypress-mcp-server
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Code Style

- Follow existing code style
- Use ESLint: `npm run lint`
- Format code: `npm run format`
- Use meaningful variable and function names
- Add comments for complex logic

### Writing Tests

- Write tests for new features
- Maintain or improve test coverage
- Test edge cases and error conditions
- Follow existing test patterns

## Making Changes

### Feature Development

1. **Plan your changes**:
   - Open an issue first for major features
   - Discuss the approach before implementing
   - Check for existing related issues/PRs

2. **Implement**:
   - Write clean, maintainable code
   - Add tests for new functionality
   - Update documentation as needed

3. **Test**:
   - Run the full test suite
   - Test manually if applicable
   - Verify no regressions

### Bug Fixes

1. **Identify the issue**:
   - Reproduce the bug
   - Check existing issues
   - Create a minimal reproduction case

2. **Fix**:
   - Implement the fix
   - Add tests to prevent regression
   - Update documentation if needed

3. **Verify**:
   - Test the fix
   - Ensure no new issues introduced

## Pull Request Process

1. **Update your fork**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Ensure quality**:
   - All tests pass
   - Code is linted and formatted
   - Documentation is updated
   - Commit messages are clear

3. **Create PR**:
   - Use clear, descriptive title
   - Provide detailed description
   - Reference related issues
   - Include screenshots/examples if applicable

4. **Review process**:
   - Address review comments
   - Keep PR focused and scoped
   - Update PR as needed

## Commit Messages

Follow conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Maintenance tasks

Examples:
```
feat(cypress): add support for custom commands
fix(handler): resolve timeout issue in test execution
docs(readme): update installation instructions
```

## Code Structure

### Adding New Tools

1. Add tool definition in `src/index.js` (`ListToolsRequestSchema` handler)
2. Add handler in `src/index.js` (`CallToolRequestSchema` handler)
3. Add implementation in `src/cypress-handler.js`
4. Add tests in `tests/`
5. Update documentation

### Adding Configuration Options

1. Update schema in `src/config.js`
2. Add to `cypress-mcp.config.yaml.example`
3. Update documentation
4. Add validation if needed

## Documentation

- Update README.md for user-facing changes
- Update API.md for API changes
- Add examples for new features
- Update troubleshooting guide if needed

## Questions?

- Open an issue for questions
- Check existing documentation
- Review existing code for patterns

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🎉

