# Troubleshooting Guide

Common issues and solutions for Cypress MCP Server.

## Server Issues

### Server Won't Start

**Symptoms**: MCP server doesn't start, no logs appear

**Solutions**:
1. **Check Node.js version**:
   ```bash
   node --version
   ```
   Must be 18.0.0 or higher. Update if needed.

2. **Verify dependencies**:
   ```bash
   npm install
   ```

3. **Check configuration file**:
   - Ensure `cypress-mcp.config.yaml` exists or is referenced correctly
   - Validate YAML syntax
   - Check file permissions

4. **Review logs**:
   ```bash
   tail -f logs/combined.log
   ```

5. **Test server manually**:
   ```bash
   node src/index.js
   ```

### Connection Refused

**Symptoms**: Cursor can't connect to MCP server

**Solutions**:
1. **Check file paths in Cursor config**:
   - Use absolute paths, not relative
   - Verify paths are correct for your OS

2. **Verify file permissions**:
   ```bash
   chmod +x src/index.js
   ```

3. **Check Cursor MCP configuration**:
   - JSON syntax must be valid
   - No trailing commas
   - Properly escaped paths on Windows

4. **Restart Cursor completely**:
   - Close all windows
   - Quit the application
   - Restart

## Cypress Issues

### Tests Not Running

**Symptoms**: Tests fail to execute or hang

**Solutions**:
1. **Verify Cypress installation**:
   ```bash
   npx cypress verify
   ```

2. **Check project path**:
   - Ensure `projectPath` in config points to valid Cypress project
   - Verify `cypress.json` or `cypress.config.js` exists

3. **Test Cypress manually**:
   ```bash
   npx cypress run
   ```

4. **Check baseUrl**:
   - Ensure the URL is accessible
   - Test with: `curl http://localhost:3000`

5. **Review Cypress logs**:
   - Check `cypress/logs/` directory
   - Review test output in MCP server logs

### Browser Issues

**Symptoms**: Browser won't launch or crashes

**Solutions**:
1. **Install required browsers**:
   - Chrome: Usually pre-installed
   - Firefox: May need installation
   - Electron: Included with Cypress

2. **Check browser permissions**:
   - Ensure browser can be launched
   - Check system permissions

3. **Try different browser**:
   ```yaml
   cypress:
     browser: firefox
   ```

4. **Run in headed mode for debugging**:
   ```yaml
   cypress:
     headless: false
   ```

### Timeout Errors

**Symptoms**: Tests fail with timeout errors

**Solutions**:
1. **Increase timeouts in config**:
   ```yaml
   cypress:
     defaultCommandTimeout: 10000
     requestTimeout: 10000
     responseTimeout: 60000
   ```

2. **Check application performance**:
   - Ensure app responds quickly
   - Check for slow API calls
   - Review network conditions

3. **Use explicit waits**:
   ```javascript
   cy.wait(5000) // Wait 5 seconds
   ```

## Configuration Issues

### Invalid Configuration

**Symptoms**: Configuration errors in logs

**Solutions**:
1. **Validate YAML syntax**:
   - Use a YAML validator
   - Check indentation (must use spaces, not tabs)
   - Verify all quotes are properly closed

2. **Check required fields**:
   - Review `cypress-mcp.config.yaml.example`
   - Ensure all required sections are present

3. **Environment variables**:
   - Verify `CYPRESS_MCP_CONFIG` path is correct
   - Check variable syntax

### Security Restrictions

**Symptoms**: Commands are blocked

**Solutions**:
1. **Check allowed commands**:
   ```yaml
   security:
     allowedCommands:
       - '*'  # Allow all
   ```

2. **Add specific commands**:
   ```yaml
   security:
     allowedCommands:
       - run
       - open
       - validate
   ```

## Performance Issues

### Slow Test Execution

**Symptoms**: Tests take too long to run

**Solutions**:
1. **Run specific tests**:
   - Use `spec` parameter to run only needed tests
   - Avoid running entire suite during development

2. **Optimize test configuration**:
   - Reduce viewport size if not needed
   - Disable video recording for faster runs
   - Use headless mode

3. **Check system resources**:
   - Ensure adequate CPU and memory
   - Close other applications

### Memory Issues

**Symptoms**: Out of memory errors

**Solutions**:
1. **Reduce concurrent operations**:
   - Run tests sequentially
   - Limit parallel browser instances

2. **Increase Node.js memory**:
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" node src/index.js
   ```

## Logging Issues

### No Logs Appearing

**Symptoms**: Log files are empty or missing

**Solutions**:
1. **Check log directory**:
   ```bash
   ls -la logs/
   ```

2. **Verify permissions**:
   ```bash
   chmod -R 755 logs/
   ```

3. **Set log level**:
   ```bash
   LOG_LEVEL=debug node src/index.js
   ```

4. **Check disk space**:
   ```bash
   df -h
   ```

### Too Many Logs

**Symptoms**: Log files are too large

**Solutions**:
1. **Reduce log level**:
   ```bash
   LOG_LEVEL=warn node src/index.js
   ```

2. **Implement log rotation**:
   - Use logrotate (Linux)
   - Configure Winston log rotation
   - Set up cleanup scripts

## Cursor Integration Issues

### AI Not Recognizing Tools

**Symptoms**: AI doesn't use Cypress tools

**Solutions**:
1. **Verify MCP connection**:
   - Check Cursor's MCP status
   - Review connection logs

2. **Restart Cursor**:
   - Fully quit and restart
   - Clear Cursor cache if needed

3. **Use explicit prompts**:
   - Try: "Use the cypress_run tool to..."
   - Reference specific tool names

### Tool Execution Fails

**Symptoms**: Tools are called but fail

**Solutions**:
1. **Check tool parameters**:
   - Verify all required parameters are provided
   - Check parameter types match expected format

2. **Review error messages**:
   - Check MCP server logs
   - Review Cursor's error output

3. **Test tool directly**:
   - Use MCP client to test tools
   - Verify tool implementation

## Getting Help

If you're still experiencing issues:

1. **Check existing issues**:
   - Search GitHub issues
   - Review closed issues

2. **Create detailed bug report**:
   - Include error messages
   - Provide configuration (sanitized)
   - Share relevant logs
   - Describe steps to reproduce

3. **Debug information**:
   ```bash
   # Collect system info
   node --version
   npm --version
   npx cypress --version
   
   # Check logs
   tail -100 logs/combined.log
   ```

4. **Minimal reproduction**:
   - Create minimal test case
   - Isolate the problem
   - Share reproduction steps

## Common Error Messages

### "Command not allowed"

**Cause**: Command is not in security allowlist

**Solution**: Add command to `allowedCommands` in config

### "Cypress not found"

**Cause**: Cypress is not installed or not in PATH

**Solution**: Install Cypress or specify full path

### "Test file not found"

**Cause**: Test file path is incorrect

**Solution**: Verify file path and use absolute paths

### "Connection timeout"

**Cause**: Application at baseUrl is not responding

**Solution**: Start application or check baseUrl

### "Browser launch failed"

**Cause**: Browser is not installed or accessible

**Solution**: Install browser or use different browser

