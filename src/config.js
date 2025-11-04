import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'yaml';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration schema
const ConfigSchema = z.object({
  cypress: z.object({
    projectPath: z.string().optional(),
    browser: z.enum(['chrome', 'firefox', 'edge', 'electron']).optional(),
    headless: z.boolean().optional(),
    baseUrl: z.string().optional(),
    viewportWidth: z.number().optional(),
    viewportHeight: z.number().optional(),
    defaultCommandTimeout: z.number().optional(),
    requestTimeout: z.number().optional(),
    responseTimeout: z.number().optional(),
  }),
  mcp: z.object({
    name: z.string().optional(),
    version: z.string().optional(),
  }),
  security: z.object({
    allowedCommands: z.array(z.string()).optional(),
    maxExecutionTime: z.number().optional(),
  }),
});

class ConfigManager {
  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig() {
    const configPath = process.env.CYPRESS_MCP_CONFIG || 
      path.join(process.cwd(), 'cypress-mcp.config.yaml');
    
    const defaultConfig = {
      cypress: {
        browser: 'chrome',
        headless: true,
        viewportWidth: 1280,
        viewportHeight: 720,
        defaultCommandTimeout: 4000,
        requestTimeout: 5000,
        responseTimeout: 30000,
      },
      mcp: {
        name: 'cypress-mcp-server',
        version: '1.0.0',
      },
      security: {
        allowedCommands: ['*'], // Allow all by default
        maxExecutionTime: 300000, // 5 minutes
      },
    };

    if (fs.existsSync(configPath)) {
      try {
        const fileContent = fs.readFileSync(configPath, 'utf-8');
        const fileConfig = yaml.parse(fileContent);
        const merged = this.mergeConfigs(defaultConfig, fileConfig);
        return ConfigSchema.parse(merged);
      } catch (error) {
        console.warn(`Failed to load config from ${configPath}:`, error.message);
        return ConfigSchema.parse(defaultConfig);
      }
    }

    return ConfigSchema.parse(defaultConfig);
  }

  mergeConfigs(defaultConfig, fileConfig) {
    return {
      cypress: { ...defaultConfig.cypress, ...fileConfig.cypress },
      mcp: { ...defaultConfig.mcp, ...fileConfig.mcp },
      security: { ...defaultConfig.security, ...fileConfig.security },
    };
  }

  get(key) {
    return this.config[key];
  }

  getCypressConfig() {
    return this.config.cypress;
  }

  getSecurityConfig() {
    return this.config.security;
  }

  isCommandAllowed(command) {
    const allowed = this.config.security.allowedCommands;
    return allowed.includes('*') || allowed.includes(command);
  }
}

export { ConfigManager };
export default new ConfigManager();

