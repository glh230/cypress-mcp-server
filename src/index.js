#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import cypressHandler from './cypress-handler.js';
import config from './config.js';
import logger from './logger.js';

class CypressMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: config.get('mcp').name,
        version: config.get('mcp').version,
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.setupHandlers();
  }

  setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'cypress_run',
          description: 'Run Cypress tests with specified options. Returns test results including pass/fail counts, duration, and run ID.',
          inputSchema: {
            type: 'object',
            properties: {
              spec: {
                type: 'string',
                description: 'Specific test file or glob pattern to run (e.g., "cypress/e2e/login.cy.js")',
              },
              browser: {
                type: 'string',
                enum: ['chrome', 'firefox', 'edge', 'electron'],
                description: 'Browser to run tests in',
              },
              headless: {
                type: 'boolean',
                description: 'Run in headless mode (default: true)',
              },
              baseUrl: {
                type: 'string',
                description: 'Base URL for the application under test',
              },
              env: {
                type: 'object',
                description: 'Environment variables to pass to Cypress',
              },
              config: {
                type: 'object',
                description: 'Additional Cypress configuration options',
              },
            },
          },
        },
        {
          name: 'cypress_open',
          description: 'Open Cypress Test Runner in headed mode for interactive debugging',
          inputSchema: {
            type: 'object',
            properties: {
              browser: {
                type: 'string',
                enum: ['chrome', 'firefox', 'edge', 'electron'],
                description: 'Browser to open',
              },
              project: {
                type: 'string',
                description: 'Path to Cypress project',
              },
            },
          },
        },
        {
          name: 'cypress_validate',
          description: 'Validate a Cypress test file or test code for syntax and best practices',
          inputSchema: {
            type: 'object',
            properties: {
              testFile: {
                type: 'string',
                description: 'Path to test file to validate',
              },
              testCode: {
                type: 'string',
                description: 'Test code to validate (alternative to testFile)',
              },
            },
            required: ['testFile'],
          },
        },
        {
          name: 'cypress_generate',
          description: 'Generate a Cypress test file from a description',
          inputSchema: {
            type: 'object',
            properties: {
              description: {
                type: 'string',
                description: 'Description of what the test should do',
              },
              testName: {
                type: 'string',
                description: 'Name for the test',
              },
              outputPath: {
                type: 'string',
                description: 'Path where the generated test file should be saved',
              },
            },
            required: ['description'],
          },
        },
        {
          name: 'cypress_get_results',
          description: 'Get test results from a previous Cypress run by run ID, or all results if no ID provided',
          inputSchema: {
            type: 'object',
            properties: {
              runId: {
                type: 'string',
                description: 'Run ID to get results for (optional)',
              },
            },
          },
        },
        {
          name: 'cypress_get_screenshots',
          description: 'Get screenshots captured during test runs',
          inputSchema: {
            type: 'object',
            properties: {
              runId: {
                type: 'string',
                description: 'Run ID to filter screenshots (optional)',
              },
              testPath: {
                type: 'string',
                description: 'Test path to filter screenshots (optional)',
              },
            },
          },
        },
        {
          name: 'cypress_get_videos',
          description: 'Get videos recorded during test runs',
          inputSchema: {
            type: 'object',
            properties: {
              runId: {
                type: 'string',
                description: 'Run ID to filter videos (optional)',
              },
            },
          },
        },
        {
          name: 'cypress_execute_command',
          description: 'Execute a Cypress command with chaining support. This is a lower-level tool for executing specific Cypress commands.',
          inputSchema: {
            type: 'object',
            properties: {
              command: {
                type: 'string',
                description: 'Cypress command to execute (e.g., "visit", "get", "click", "type")',
              },
              args: {
                type: 'array',
                description: 'Arguments for the command',
              },
              selector: {
                type: 'string',
                description: 'CSS selector or text to find element',
              },
              options: {
                type: 'object',
                description: 'Additional options for the command',
              },
            },
            required: ['command'],
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        logger.info(`Tool called: ${name}`, { args });

        switch (name) {
          case 'cypress_run':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await cypressHandler.executeCommand('run', args), null, 2),
                },
              ],
            };

          case 'cypress_open':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await cypressHandler.executeCommand('open', args), null, 2),
                },
              ],
            };

          case 'cypress_validate':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await cypressHandler.executeCommand('validate', args), null, 2),
                },
              ],
            };

          case 'cypress_generate':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await cypressHandler.executeCommand('generate', args), null, 2),
                },
              ],
            };

          case 'cypress_get_results':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await cypressHandler.executeCommand('getResults', args), null, 2),
                },
              ],
            };

          case 'cypress_get_screenshots':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await cypressHandler.executeCommand('getScreenshots', args), null, 2),
                },
              ],
            };

          case 'cypress_get_videos':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await cypressHandler.executeCommand('getVideos', args), null, 2),
                },
              ],
            };

          case 'cypress_execute_command':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      message: 'This is a placeholder for direct command execution. In a full implementation, this would execute Cypress commands in a headless browser context.',
                      command: args.command,
                      args: args.args,
                      selector: args.selector,
                      options: args.options,
                    },
                    null,
                    2
                  ),
                },
              ],
            };

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        logger.error(`Error executing tool ${name}:`, error);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  error: error.message,
                  stack: error.stack,
                },
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }
    });

    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
        {
          uri: 'cypress://config',
          name: 'Cypress Configuration',
          description: 'Current Cypress configuration',
          mimeType: 'application/json',
        },
        {
          uri: 'cypress://results',
          name: 'Test Results',
          description: 'Latest test results',
          mimeType: 'application/json',
        },
      ],
    }));

    // Handle resource reads
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      try {
        if (uri === 'cypress://config') {
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(config.get('cypress'), null, 2),
              },
            ],
          };
        }

        if (uri === 'cypress://results') {
          const results = await cypressHandler.executeCommand('getResults', {});
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(results, null, 2),
              },
            ],
          };
        }

        throw new Error(`Unknown resource: ${uri}`);
      } catch (error) {
        logger.error(`Error reading resource ${uri}:`, error);
        throw error;
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    logger.info('Cypress MCP Server started');
  }
}

// Export the class for testing
export { CypressMCPServer };

// Start the server - MCP servers communicate via stdio
// Always start when run directly (not when imported for testing)
const isMainModule = import.meta.url === `file://${process.argv[1]}` || 
                     process.argv[1]?.endsWith('index.js') ||
                     process.argv[1]?.includes('cypress-mcp-server');

if (isMainModule && process.env.NODE_ENV !== 'test' && !process.env.JEST_WORKER_ID) {
  const server = new CypressMCPServer();
  server.run().catch((error) => {
    // Can't use logger here as it might write to stdout
    // Write to stderr instead (MCP uses stdout for protocol)
    process.stderr.write(`Failed to start Cypress MCP Server: ${error.message}\n`);
    process.exit(1);
  });
}

