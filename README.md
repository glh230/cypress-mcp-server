# Cypress MCP Server

A Model Context Protocol (MCP) server implementation that integrates Cypress with Cursor AI, enabling AI-powered test automation, debugging, and script generation.

## 🚀 Features

- **Full Cypress Integration**: Supports all major Cypress commands and features
- **MCP Standard Compliant**: Follows the official Model Context Protocol specification
- **Cursor AI Compatible**: Seamlessly integrates with Cursor's AI assistant
- **Comprehensive Tool Set**: 
  - Run tests in headless or headed mode
  - Validate test files and code
  - Generate tests from descriptions
  - Retrieve test results, screenshots, and videos
  - Execute Cypress commands programmatically
- **Security**: Configurable command allowlist and execution time limits
- **Logging**: Comprehensive logging with Winston
- **Flexible Configuration**: YAML-based configuration with environment variable support

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager
- Cypress project (existing or new)

## 🔧 Installation

### Option 1: Install from npm (when published)

```bash
npm install -g cypress-mcp-server
```

### Option 2: Install from source

```bash
git clone https://github.com/yourusername/cypress-mcp-server.git
cd cypress-mcp-server
npm install
npm link  # Optional: link globally for CLI access
```

## ⚙️ Configuration

### 1. Create Configuration File

Copy the example configuration file:

```bash
cp cypress-mcp.config.yaml.example cypress-mcp.config.yaml
```

### 2. Configure Cursor

Add the MCP server to Cursor's configuration. Open Cursor settings and add:

**On macOS/Linux**: `~/.cursor/mcp.json`

**On Windows**: `%APPDATA%\Cursor\mcp.json`

```json
{
  "mcpServers": {
    "cypress": {
      "command": "node",
      "args": ["/path/to/cypress-mcp-server/src/index.js"],
      "env": {
        "CYPRESS_MCP_CONFIG": "/path/to/cypress-mcp.config.yaml"
      }
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "cypress": {
      "command": "cypress-mcp-server"
    }
  }
}
```

### 3. Customize Configuration

Edit `cypress-mcp.config.yaml`:

```yaml
cypress:
  projectPath: /path/to/your/cypress/project
  browser: chrome
  headless: true
  baseUrl: http://localhost:3000
  viewportWidth: 1280
  viewportHeight: 720
  defaultCommandTimeout: 4000
  requestTimeout: 5000
  responseTimeout: 30000

mcp:
  name: cypress-mcp-server
  version: 1.0.0

security:
  allowedCommands:
    - '*'
  maxExecutionTime: 300000
```

## 🎯 Usage

Once configured, you can use natural language prompts in Cursor to interact with Cypress:

### Running Tests

```
Run all Cypress tests in headless mode
```

```
Run the test file cypress/e2e/login.cy.js using Firefox
```

```
Run Cypress tests with baseUrl set to http://localhost:8080
```

### Generating Tests

```
Generate a Cypress test that validates user login. The test should visit the login page, enter credentials, click login, and verify redirect to dashboard. Save it to cypress/e2e/login.cy.js
```

### Validating Tests

```
Validate the Cypress test file cypress/e2e/checkout.cy.js for syntax errors
```

### Getting Results

```
Show me the results from the last Cypress test run
```

```
Get all screenshots from failed tests
```

## 📚 Available Tools

The MCP server exposes the following tools:

### `cypress_run`
Run Cypress tests with specified options.

**Parameters:**
- `spec` (string, optional): Specific test file or glob pattern
- `browser` (string, optional): Browser to use (chrome, firefox, edge, electron)
- `headless` (boolean, optional): Run in headless mode
- `baseUrl` (string, optional): Base URL for the application
- `env` (object, optional): Environment variables
- `config` (object, optional): Additional Cypress configuration

### `cypress_open`
Open Cypress Test Runner in headed mode for interactive debugging.

**Parameters:**
- `browser` (string, optional): Browser to open
- `project` (string, optional): Path to Cypress project

### `cypress_validate`
Validate a Cypress test file or test code.

**Parameters:**
- `testFile` (string, optional): Path to test file
- `testCode` (string, optional): Test code to validate

### `cypress_generate`
Generate a Cypress test file from a description.

**Parameters:**
- `description` (string, required): Description of the test
- `testName` (string, optional): Name for the test
- `outputPath` (string, optional): Path to save the generated test

### `cypress_get_results`
Get test results from previous runs.

**Parameters:**
- `runId` (string, optional): Specific run ID, or omit for all results

### `cypress_get_screenshots`
Get screenshots captured during test runs.

**Parameters:**
- `runId` (string, optional): Filter by run ID
- `testPath` (string, optional): Filter by test path

### `cypress_get_videos`
Get videos recorded during test runs.

**Parameters:**
- `runId` (string, optional): Filter by run ID

### `cypress_execute_command`
Execute a Cypress command directly (placeholder for advanced use cases).

## 📖 Examples

See the `examples/` directory for:
- Example Cypress test files
- Sample Cursor prompts
- Configuration examples

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## 🔒 Security

The MCP server includes several security features:

1. **Command Allowlist**: Configure which Cypress commands are allowed
2. **Execution Time Limits**: Prevent long-running tests from blocking
3. **Input Validation**: All inputs are validated before execution
4. **Error Handling**: Comprehensive error handling prevents crashes

## 📝 Logging

Logs are written to:
- Console (development mode)
- `logs/error.log` (errors only)
- `logs/combined.log` (all logs)

Set the log level with the `LOG_LEVEL` environment variable:

```bash
LOG_LEVEL=debug node src/index.js
```

## 🐛 Troubleshooting

### Server won't start

1. Check Node.js version: `node --version` (should be 18+)
2. Verify dependencies: `npm install`
3. Check configuration file syntax
4. Review logs in `logs/` directory

### Tests not running

1. Verify Cypress is installed: `npx cypress verify`
2. Check project path in configuration
3. Ensure baseUrl is accessible
4. Check browser permissions

### Cursor not connecting

1. Verify MCP configuration in Cursor settings
2. Check file paths are absolute
3. Restart Cursor after configuration changes
4. Check console for connection errors

### Browser issues

1. Ensure Chrome/Firefox is installed
2. Check browser permissions
3. Try running Cypress manually: `npx cypress open`
4. Review Cypress documentation for browser setup

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [Cypress Documentation](https://docs.cypress.io)
- [Cursor Documentation](https://cursor.com/docs)

## 🙏 Acknowledgments

- Anthropic for the Model Context Protocol specification
- The Cypress team for an amazing testing framework
- Cursor for AI-powered development tools

## 📧 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check existing documentation
- Review example files

---

**Note**: This is a community project and is not officially affiliated with Cypress, Cursor, or Anthropic.

