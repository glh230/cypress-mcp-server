# Quick Start Guide

Get up and running with Cypress MCP Server in 5 minutes.

## Step 1: Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cypress-mcp-server.git
cd cypress-mcp-server

# Install dependencies
npm install
```

## Step 2: Configuration

Create a configuration file:

```bash
cp cypress-mcp.config.yaml.example cypress-mcp.config.yaml
```

Edit `cypress-mcp.config.yaml` with your settings:

```yaml
cypress:
  baseUrl: http://localhost:3000
  browser: chrome
  headless: true
```

## Step 3: Configure Cursor

Add to Cursor's MCP configuration:

**macOS/Linux**: `~/.cursor/mcp.json`  
**Windows**: `%APPDATA%\Cursor\mcp.json`

```json
{
  "mcpServers": {
    "cypress": {
      "command": "node",
      "args": ["/absolute/path/to/cypress-mcp-server/src/index.js"]
    }
  }
}
```

Replace `/absolute/path/to/` with the actual path to your project.

## Step 4: Restart Cursor

Close and reopen Cursor to load the MCP server.

## Step 5: Test It

In Cursor, try these prompts:

```
Run all Cypress tests
```

```
Generate a Cypress test that visits the homepage and checks for a title
```

## Troubleshooting

### Server not starting

1. Check Node.js version: `node --version` (needs 18+)
2. Verify path in Cursor config is absolute
3. Check logs in `logs/` directory

### Tests not running

1. Make sure Cypress is installed: `npx cypress verify`
2. Check `baseUrl` in config is accessible
3. Verify test files exist in your Cypress project

### Cursor not connecting

1. Restart Cursor completely
2. Check Cursor's developer console for errors
3. Verify the MCP configuration JSON is valid

## Next Steps

- Read the [full README](../README.md) for detailed documentation
- Check [API Reference](API.md) for all available tools
- See [examples](../examples/) for sample tests and prompts

## Example Workflow

1. **Generate a test**:
   ```
   Generate a Cypress test for user login that validates the login form
   ```

2. **Run the test**:
   ```
   Run the test file cypress/e2e/login.cy.js
   ```

3. **Check results**:
   ```
   Show me the results from the last test run
   ```

4. **Debug failures**:
   ```
   Get screenshots from failed tests
   ```

## Common Use Cases

### Running Specific Tests

```
Run tests matching the pattern cypress/e2e/auth/*.cy.js
```

### Running with Different Browser

```
Run all Cypress tests using Firefox
```

### Running with Environment Variables

```
Run Cypress tests with environment variable API_URL=https://api.example.com
```

### Validating Test Code

```
Validate the test file cypress/e2e/checkout.cy.js
```

## Tips

- Use specific test paths instead of running all tests for faster feedback
- Set appropriate timeouts in your config based on your app's response times
- Use `cypress_validate` before running tests to catch syntax errors early
- Check logs regularly for debugging information

For more advanced usage, see the [full documentation](../README.md).

