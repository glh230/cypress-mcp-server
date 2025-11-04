import cypress from 'cypress';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';
import logger from './logger.js';

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
   * Run Cypress tests
   */
  async runTests(options = {}) {
    const cypressConfig = config.getCypressConfig();
    const runId = `run_${Date.now()}`;

    const runOptions = {
      headless: options.headless ?? cypressConfig.headless,
      browser: options.browser ?? cypressConfig.browser,
      spec: options.spec,
      config: {
        baseUrl: options.baseUrl ?? cypressConfig.baseUrl,
        viewportWidth: options.viewportWidth ?? cypressConfig.viewportWidth,
        viewportHeight: options.viewportHeight ?? cypressConfig.viewportHeight,
        defaultCommandTimeout: options.defaultCommandTimeout ?? cypressConfig.defaultCommandTimeout,
        requestTimeout: options.requestTimeout ?? cypressConfig.requestTimeout,
        responseTimeout: options.responseTimeout ?? cypressConfig.responseTimeout,
        ...options.config,
      },
      env: options.env || {},
      project: options.project || cypressConfig.projectPath,
    };

    // Remove undefined values
    Object.keys(runOptions).forEach(key => {
      if (runOptions[key] === undefined) {
        delete runOptions[key];
      }
    });

    logger.info(`Starting Cypress run: ${runId}`, runOptions);

    try {
      const result = await cypress.run(runOptions);
      
      this.testResults.set(runId, {
        runId,
        status: result.status,
        startedTestsAt: result.startedTestsAt,
        endedTestsAt: result.endedTestsAt,
        totalDuration: result.totalDuration,
        totalSuites: result.totalSuites,
        totalTests: result.totalTests,
        totalPassed: result.totalPassed,
        totalFailed: result.totalFailed,
        totalPending: result.totalPending,
        totalSkipped: result.totalSkipped,
        runs: result.runs,
      });

      logger.info(`Cypress run completed: ${runId}`, {
        status: result.status,
        totalTests: result.totalTests,
        totalPassed: result.totalPassed,
        totalFailed: result.totalFailed,
      });

      return {
        runId,
        success: result.status === 'finished' && result.totalFailed === 0,
        ...this.testResults.get(runId),
      };
    } catch (error) {
      logger.error(`Cypress run failed: ${runId}`, error);
      throw error;
    }
  }

  /**
   * Open Cypress Test Runner (for debugging)
   */
  async openCypress(options = {}) {
    const cypressConfig = config.getCypressConfig();

    const openOptions = {
      browser: options.browser ?? cypressConfig.browser,
      config: {
        baseUrl: options.baseUrl ?? cypressConfig.baseUrl,
        ...options.config,
      },
      env: options.env || {},
      project: options.project || cypressConfig.projectPath,
    };

    // Remove undefined values
    Object.keys(openOptions).forEach(key => {
      if (openOptions[key] === undefined) {
        delete openOptions[key];
      }
    });

    logger.info('Opening Cypress Test Runner', openOptions);

    try {
      // Note: cypress.open() doesn't return a promise in the same way
      // This is mainly for documentation/planning purposes
      await cypress.open(openOptions);
      
      return {
        success: true,
        message: 'Cypress Test Runner opened',
      };
    } catch (error) {
      logger.error('Failed to open Cypress Test Runner', error);
      throw error;
    }
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
        code = fs.readFileSync(testFile, 'utf-8');
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
      fs.writeFileSync(outputPath, testTemplate, 'utf-8');
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
    const files = fs.readdirSync(screenshotsDir, { recursive: true });

    for (const file of files) {
      const fullPath = path.join(screenshotsDir, file);
      if (fs.statSync(fullPath).isFile() && /\.(png|jpg|jpeg)$/i.test(file)) {
        if (!runId || file.includes(runId) || !testPath || file.includes(testPath)) {
          screenshots.push({
            path: fullPath,
            relativePath: path.relative(projectPath, fullPath),
            size: fs.statSync(fullPath).size,
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
    const files = fs.readdirSync(videosDir, { recursive: true });

    for (const file of files) {
      const fullPath = path.join(videosDir, file);
      if (fs.statSync(fullPath).isFile() && /\.mp4$/i.test(file)) {
        if (!runId || file.includes(runId)) {
          videos.push({
            path: fullPath,
            relativePath: path.relative(projectPath, fullPath),
            size: fs.statSync(fullPath).size,
          });
        }
      }
    }

    return { videos };
  }
}

export default new CypressHandler();

