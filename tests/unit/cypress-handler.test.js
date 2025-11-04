import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import CypressHandler from '../../src/cypress-handler.js';

describe('CypressHandler', () => {
  let handler;

  beforeEach(() => {
    handler = new CypressHandler();
  });

  it('should validate test code correctly', async () => {
    const testCode = `
      describe('Test', () => {
        it('should work', () => {
          cy.visit('/');
          cy.get('.button').click();
        });
      });
    `;

    const result = await handler.validateTest({ testCode });
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should detect missing test structure', async () => {
    const testCode = 'const x = 1;';

    const result = await handler.validateTest({ testCode });
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('should generate test from description', async () => {
    const description = 'Test login functionality';
    const result = await handler.generateTest({ description });

    expect(result.success).toBe(true);
    expect(result.testCode).toContain(description);
    expect(result.testCode).toContain('describe');
  });

  it('should throw error when description is missing for generate', async () => {
    await expect(handler.generateTest({})).rejects.toThrow('Description is required');
  });

  it('should throw error when validating without testFile or testCode', async () => {
    await expect(handler.validateTest({})).rejects.toThrow('Either testFile or testCode must be provided');
  });

  it('should return empty results when no run ID matches', async () => {
    await expect(handler.getResults({ runId: 'nonexistent' })).rejects.toThrow('No results found');
  });

  it('should return empty arrays for screenshots when directory does not exist', async () => {
    const result = await handler.getScreenshots({});
    expect(result.screenshots).toEqual([]);
  });

  it('should return empty arrays for videos when directory does not exist', async () => {
    const result = await handler.getVideos({});
    expect(result.videos).toEqual([]);
  });
});

