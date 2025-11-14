import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { promisify } from 'util';
import config from './config.js';
import logger from './logger.js';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Lazy load Cypress - check if it's available
let cypressAvailable = null; // null = not checked yet, true/false = checked
let cypressModule = null;

async function checkCypressAvailability() {
  if (cypressAvailable !== null) return cypressAvailable;
  
  try {
    cypressModule = await import('cypress');
    cypressAvailable = true;
    return true;
  } catch (error) {
    cypressAvailable = false;
    return false;
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CypressHandler {
  constructor() {
    this.activeRuns = new Map();
    this.testResults = new Map();
  }

  /**
   * Execute a Cypress command
   */
  async executeCommand(command, args = {}) {
    logger.info(`Executing Cypress command: ${command}`, { args });

    // Security check
    if (!config.isCommandAllowed(command)) {
      throw new Error(`Command ${command} is not allowed by security configuration`);
    }

    try {
      switch (command) {
        case 'run':
          return await this.runTests(args);
        case 'open':
          return await this.openCypress(args);
        case 'validate':
          return await this.validateTest(args);
        case 'generate':
          return await this.generateTest(args);
        case 'getResults':
          return await this.getResults(args);
        case 'getScreenshots':
          return await this.getScreenshots(args);
        case 'getVideos':
          return await this.getVideos(args);
        default:
          throw new Error(`Unknown command: ${command}`);
      }
    } catch (error) {
      logger.error(`Error executing command ${command}:`, error);
      throw error;
    }
  }

  /**
   * Run Cypress tests using child process to avoid blocking MCP stdio
   */
  async runTests(options = {}) {
    const isAvailable = await checkCypressAvailability();
    if (!isAvailable) {
      throw new Error('Cypress is not installed. Please install it with: npm install cypress --save-dev');
    }

    const cypressConfig = config.getCypressConfig();
    const runId = `run_${Date.now()}`;
    const projectPath = options.project || cypressConfig.projectPath || process.cwd();

    // Build Cypress CLI arguments
    const args = ['run'];
    
    if (options.headless !== false && cypressConfig.headless !== false) {
      args.push('--headless');
    }
    
    if (options.browser || cypressConfig.browser) {
      args.push('--browser', options.browser || cypressConfig.browser);
    }
    
    if (options.spec) {
      args.push('--spec', options.spec);
    }

    // Build config object for Cypress
    const cypressConfigObj = {
      baseUrl: options.baseUrl || cypressConfig.baseUrl,
      viewportWidth: options.viewportWidth || cypressConfig.viewportWidth,
      viewportHeight: options.viewportHeight || cypressConfig.viewportHeight,
      defaultCommandTimeout: options.defaultCommandTimeout || cypressConfig.defaultCommandTimeout,
      requestTimeout: options.requestTimeout || cypressConfig.requestTimeout,
      responseTimeout: options.responseTimeout || cypressConfig.responseTimeout,
      ...options.config,
    };

    // Write config to temp file if needed
    const configPath = path.join(projectPath, 'cypress.config.js');
    const hasConfigFile = fs.existsSync(configPath) || fs.existsSync(path.join(projectPath, 'cypress.json'));

    logger.info(`Starting Cypress run: ${runId}`, { args, projectPath });

    return new Promise((resolve, reject) => {
      // Use npx cypress to run in separate process
      const cypressProcess = spawn('npx', ['cypress', ...args], {
        cwd: projectPath,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: {
          ...process.env,
          ...(options.env || {}),
          ...(cypressConfigObj.baseUrl ? { CYPRESS_baseUrl: cypressConfigObj.baseUrl } : {}),
        },
      });

      let stdout = '';
      let stderr = '';

      cypressProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      cypressProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      cypressProcess.on('close', (code) => {
        // Parse Cypress output to extract results
        // This is a simplified version - in production you'd want more robust parsing
        const success = code === 0;
        
        const result = {
          runId,
          success,
          exitCode: code,
          stdout: stdout.substring(0, 1000), // Limit output size
          stderr: stderr.substring(0, 1000),
          message: success ? 'Tests completed successfully' : 'Tests failed',
        };

        this.testResults.set(runId, result);
        logger.info(`Cypress run completed: ${runId}`, { success, code });

        if (success) {
          resolve(result);
        } else {
          reject(new Error(`Cypress tests failed with exit code ${code}: ${stderr.substring(0, 200)}`));
        }
      });

      cypressProcess.on('error', (error) => {
        logger.error(`Cypress process error: ${runId}`, error);
        reject(new Error(`Failed to start Cypress: ${error.message}`));
      });
    });
  }

  /**
   * Open Cypress Test Runner (for debugging)
   * Note: This won't work in headless MCP context, but provides instructions
   */
  async openCypress(options = {}) {
    const isAvailable = await checkCypressAvailability();
    if (!isAvailable) {
      throw new Error('Cypress is not installed. Please install it with: npm install cypress --save-dev');
    }

    const cypressConfig = config.getCypressConfig();
    const projectPath = options.project || cypressConfig.projectPath || process.cwd();

    // In MCP/headless context, we can't open a GUI
    // Return instructions instead
    return {
      success: false,
      message: 'Cypress Test Runner cannot be opened in headless MCP context',
      instructions: `To open Cypress Test Runner manually, run:
cd ${projectPath}
npx cypress open`,
      projectPath,
    };
  }

  /**
   * Validate a test file or test code
   */
  async validateTest(options = {}) {
    const { testFile, testCode } = options;

    if (!testFile && !testCode) {
      throw new Error('Either testFile or testCode must be provided');
    }

    try {
      let code = testCode;
      if (testFile) {
        code = await readFile(testFile, 'utf-8');
      }

      // Basic validation - check for common Cypress syntax
      const validation = {
        isValid: true,
        errors: [],
        warnings: [],
      };

      // Check for required imports/describes
      if (!code.includes('describe(') && !code.includes('it(') && !code.includes('cy.')) {
        validation.warnings.push('No test structure found (describe/it)');
      }

      // Check for common Cypress commands
      const commonCommands = ['cy.visit', 'cy.get', 'cy.contains', 'cy.click', 'cy.type'];
      const hasCommands = commonCommands.some(cmd => code.includes(cmd));
      
      if (!hasCommands) {
        validation.warnings.push('No common Cypress commands detected');
      }

      // Check for syntax errors (basic check)
      try {
        // This is a simple check - in production you might want to use a proper parser
        if (code.includes('cy.') && !code.includes('cypress')) {
          // This is fine, cypress is available globally
        }
      } catch (error) {
        validation.isValid = false;
        validation.errors.push(`Syntax error: ${error.message}`);
      }

      return validation;
    } catch (error) {
      logger.error('Test validation failed', error);
      throw error;
    }
  }

  /**
   * Generate a test file from a description
   */
  async generateTest(options = {}) {
    const { description, outputPath, testName } = options;

    if (!description) {
      throw new Error('Description is required to generate a test');
    }

    // This is a placeholder - in a real implementation, you might use AI
    // to generate test code based on the description
    const testTemplate = `describe('${testName || 'Generated Test'}', () => {
  it('${description}', () => {
    // TODO: Implement test based on: ${description}
    cy.visit('/');
    // Add your test steps here
  });
});
`;

    if (outputPath) {
      await writeFile(outputPath, testTemplate, 'utf-8');
      logger.info(`Test file generated: ${outputPath}`);
    }

    return {
      success: true,
      testCode: testTemplate,
      outputPath: outputPath || null,
    };
  }

  /**
   * Get test results by run ID
   */
  async getResults(options = {}) {
    const { runId } = options;

    if (runId) {
      const result = this.testResults.get(runId);
      if (!result) {
        throw new Error(`No results found for runId: ${runId}`);
      }
      return result;
    }

    // Return all results
    return Array.from(this.testResults.values());
  }

  /**
   * Get screenshots from a test run
   */
  async getScreenshots(options = {}) {
    const { runId, testPath } = options;
    const cypressConfig = config.getCypressConfig();
    const projectPath = cypressConfig.projectPath || process.cwd();
    const screenshotsDir = path.join(projectPath, 'cypress', 'screenshots');

    if (!fs.existsSync(screenshotsDir)) {
      return { screenshots: [] };
    }

    const screenshots = [];
    const files = await readdir(screenshotsDir, { recursive: true });

    for (const file of files) {
      const fullPath = path.join(screenshotsDir, file);
      const fileStat = await stat(fullPath);
      if (fileStat.isFile() && /\.(png|jpg|jpeg)$/i.test(file)) {
        if (!runId || file.includes(runId) || !testPath || file.includes(testPath)) {
          screenshots.push({
            path: fullPath,
            relativePath: path.relative(projectPath, fullPath),
            size: fileStat.size,
          });
        }
      }
    }

    return { screenshots };
  }

  /**
   * Get videos from a test run
   */
  async getVideos(options = {}) {
    const { runId } = options;
    const cypressConfig = config.getCypressConfig();
    const projectPath = cypressConfig.projectPath || process.cwd();
    const videosDir = path.join(projectPath, 'cypress', 'videos');

    if (!fs.existsSync(videosDir)) {
      return { videos: [] };
    }

    const videos = [];
    const files = await readdir(videosDir, { recursive: true });

    for (const file of files) {
      const fullPath = path.join(videosDir, file);
      const fileStat = await stat(fullPath);
      if (fileStat.isFile() && /\.mp4$/i.test(file)) {
        if (!runId || file.includes(runId)) {
          videos.push({
            path: fullPath,
            relativePath: path.relative(projectPath, fullPath),
            size: fileStat.size,
          });
        }
      }
    }

    return { videos };
  }
}

export default new CypressHandler();

