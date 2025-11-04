# Cypress MCP Server API Reference

## Overview

The Cypress MCP Server exposes Cypress functionality through the Model Context Protocol, allowing AI assistants like Cursor to interact with Cypress programmatically.

## Tools

### cypress_run

Execute Cypress tests with specified options.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| spec | string | No | Specific test file or glob pattern (e.g., "cypress/e2e/login.cy.js") |
| browser | string | No | Browser to use: "chrome", "firefox", "edge", or "electron" |
| headless | boolean | No | Run in headless mode (default: true) |
| baseUrl | string | No | Base URL for the application under test |
| env | object | No | Environment variables to pass to Cypress |
| config | object | No | Additional Cypress configuration options |

#### Returns

```json
{
  "runId": "run_1234567890",
  "success": true,
  "status": "finished",
  "totalTests": 10,
  "totalPassed": 10,
  "totalFailed": 0,
  "totalDuration": 5000
}
```

#### Example

```json
{
  "name": "cypress_run",
  "arguments": {
    "spec": "cypress/e2e/login.cy.js",
    "browser": "chrome",
    "headless": true,
    "baseUrl": "http://localhost:3000"
  }
}
```

---

### cypress_open

Open Cypress Test Runner in headed mode for interactive debugging.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| browser | string | No | Browser to open |
| project | string | No | Path to Cypress project |

#### Returns

```json
{
  "success": true,
  "message": "Cypress Test Runner opened"
}
```

---

### cypress_validate

Validate a Cypress test file or test code for syntax and best practices.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| testFile | string | No* | Path to test file to validate |
| testCode | string | No* | Test code to validate (alternative to testFile) |

*Either testFile or testCode must be provided

#### Returns

```json
{
  "isValid": true,
  "errors": [],
  "warnings": []
}
```

#### Example

```json
{
  "name": "cypress_validate",
  "arguments": {
    "testFile": "cypress/e2e/login.cy.js"
  }
}
```

---

### cypress_generate

Generate a Cypress test file from a description.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| description | string | Yes | Description of what the test should do |
| testName | string | No | Name for the test |
| outputPath | string | No | Path where the generated test file should be saved |

#### Returns

```json
{
  "success": true,
  "testCode": "describe('Test', () => { ... })",
  "outputPath": "/path/to/generated/test.cy.js"
}
```

---

### cypress_get_results

Get test results from a previous Cypress run.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| runId | string | No | Run ID to get results for (omit for all results) |

#### Returns

```json
{
  "runId": "run_1234567890",
  "status": "finished",
  "totalTests": 10,
  "totalPassed": 10,
  "totalFailed": 0,
  "runs": [...]
}
```

---

### cypress_get_screenshots

Get screenshots captured during test runs.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| runId | string | No | Run ID to filter screenshots |
| testPath | string | No | Test path to filter screenshots |

#### Returns

```json
{
  "screenshots": [
    {
      "path": "/path/to/screenshot.png",
      "relativePath": "cypress/screenshots/test.png",
      "size": 12345
    }
  ]
}
```

---

### cypress_get_videos

Get videos recorded during test runs.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| runId | string | No | Run ID to filter videos |

#### Returns

```json
{
  "videos": [
    {
      "path": "/path/to/video.mp4",
      "relativePath": "cypress/videos/test.mp4",
      "size": 1234567
    }
  ]
}
```

---

## Resources

### cypress://config

Access the current Cypress configuration.

**MIME Type**: `application/json`

**Example Response**:
```json
{
  "browser": "chrome",
  "headless": true,
  "baseUrl": "http://localhost:3000",
  "viewportWidth": 1280,
  "viewportHeight": 720
}
```

### cypress://results

Access the latest test results.

**MIME Type**: `application/json`

---

## Error Handling

All tools return errors in the following format:

```json
{
  "error": "Error message",
  "stack": "Error stack trace"
}
```

Common error scenarios:

1. **Command not allowed**: The command is not in the security allowlist
2. **File not found**: Test file or configuration file doesn't exist
3. **Cypress execution error**: Test execution failed
4. **Invalid configuration**: Configuration file has syntax errors

---

## Configuration

Configuration is managed through `cypress-mcp.config.yaml`. See the example configuration file for details.

Environment variables:
- `CYPRESS_MCP_CONFIG`: Path to configuration file
- `LOG_LEVEL`: Logging level (debug, info, warn, error)
- `LOG_DIR`: Directory for log files

---

## Best Practices

1. **Use specific test paths**: Instead of running all tests, specify the test file
2. **Set appropriate timeouts**: Configure timeouts based on your application
3. **Use environment variables**: Store sensitive data in environment variables
4. **Monitor logs**: Check logs for debugging information
5. **Validate before running**: Use `cypress_validate` before executing tests

---

## Limitations

1. Direct command execution (`cypress_execute_command`) is currently a placeholder
2. Parallel test execution is not yet supported
3. Real-time test output streaming is not available
4. Custom Cypress commands are not automatically discovered

---

## Future Enhancements

- Real-time test execution monitoring
- Support for Cypress plugins
- Advanced test generation using AI
- Parallel test execution
- Custom command discovery and execution

