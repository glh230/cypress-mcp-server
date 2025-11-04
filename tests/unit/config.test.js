import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ConfigManager } from '../../src/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('ConfigManager', () => {
  let configManager;
  const testConfigPath = path.join(__dirname, '../../test-config.yaml');

  beforeEach(() => {
    // Clean up test config file if it exists
    if (fs.existsSync(testConfigPath)) {
      fs.unlinkSync(testConfigPath);
    }
    configManager = new ConfigManager();
  });

  afterEach(() => {
    // Clean up test config file
    if (fs.existsSync(testConfigPath)) {
      fs.unlinkSync(testConfigPath);
    }
  });

  it('should load default configuration when no config file exists', () => {
    const config = configManager.get('cypress');
    expect(config).toBeDefined();
    expect(config.browser).toBe('chrome');
    expect(config.headless).toBe(true);
  });

  it('should return cypress configuration', () => {
    const cypressConfig = configManager.getCypressConfig();
    expect(cypressConfig).toBeDefined();
    expect(cypressConfig.browser).toBeDefined();
  });

  it('should return security configuration', () => {
    const securityConfig = configManager.getSecurityConfig();
    expect(securityConfig).toBeDefined();
    expect(securityConfig.allowedCommands).toBeDefined();
  });

  it('should allow all commands when configured with *', () => {
    const isAllowed = configManager.isCommandAllowed('any_command');
    expect(isAllowed).toBe(true);
  });

  it('should merge configurations correctly', () => {
    const testConfig = {
      cypress: {
        browser: 'firefox',
        headless: false,
      },
    };

    const merged = configManager.mergeConfigs(
      { cypress: { browser: 'chrome', headless: true } },
      testConfig
    );

    expect(merged.cypress.browser).toBe('firefox');
    expect(merged.cypress.headless).toBe(false);
  });
});

