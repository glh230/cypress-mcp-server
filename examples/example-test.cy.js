// Example Cypress test file
// This demonstrates common Cypress patterns that can be used with the MCP server

describe('Example Test Suite', () => {
  beforeEach(() => {
    // Visit the application before each test
    cy.visit('/');
  });

  it('should display the home page', () => {
    // Assert that the page is visible
    cy.get('body').should('be.visible');
  });

  it('should interact with a button', () => {
    // Find and click a button
    cy.get('[data-testid="submit-button"]').click();
    
    // Verify the action was successful
    cy.get('.success-message').should('be.visible');
  });

  it('should fill out a form', () => {
    // Type into input fields
    cy.get('#username').type('testuser');
    cy.get('#password').type('password123');
    
    // Submit the form
    cy.get('form').submit();
    
    // Verify navigation or success
    cy.url().should('include', '/dashboard');
  });

  it('should handle API requests', () => {
    // Intercept API calls
    cy.intercept('GET', '/api/users', { fixture: 'users.json' }).as('getUsers');
    
    // Trigger the API call
    cy.get('[data-testid="load-users"]').click();
    
    // Wait for and verify the response
    cy.wait('@getUsers');
    cy.get('.user-list').should('be.visible');
  });

  it('should wait for elements', () => {
    // Wait for element to appear
    cy.get('.loading-spinner', { timeout: 10000 }).should('not.exist');
    cy.get('.content').should('be.visible');
  });

  it('should handle navigation', () => {
    // Navigate to different pages
    cy.visit('/about');
    cy.contains('About Us').should('be.visible');
    
    cy.visit('/contact');
    cy.url().should('include', '/contact');
  });

  it('should verify text content', () => {
    cy.contains('Welcome').should('have.text', 'Welcome to our site');
    cy.get('h1').should('contain', 'Home Page');
  });

  it('should check element attributes', () => {
    cy.get('a[href="/login"]').should('have.attr', 'href', '/login');
    cy.get('img').should('have.attr', 'alt');
  });

  it('should handle file uploads', () => {
    cy.get('input[type="file"]').selectFile('cypress/fixtures/example.json');
    cy.get('.upload-success').should('be.visible');
  });

  it('should handle multiple assertions', () => {
    cy.get('.card')
      .should('be.visible')
      .and('have.class', 'active')
      .and('contain', 'Card Content');
  });
});

