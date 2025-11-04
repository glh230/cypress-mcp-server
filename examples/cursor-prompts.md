# Example Cursor Prompts for Cypress MCP

This document provides example prompts you can use in Cursor to interact with Cypress via the MCP server.

## Running Tests

### Run all tests
```
Run all Cypress tests in headless mode
```

### Run specific test file
```
Run the Cypress test file cypress/e2e/login.cy.js
```

### Run tests in a specific browser
```
Run Cypress tests using Firefox browser
```

### Run tests with custom configuration
```
Run Cypress tests with baseUrl set to http://localhost:8080 and viewport 1920x1080
```

## Generating Tests

### Generate a test from description
```
Generate a Cypress test that validates user login functionality. The test should:
1. Visit the login page
2. Enter username and password
3. Click the login button
4. Verify redirect to dashboard
5. Save the test to cypress/e2e/login.cy.js
```

### Generate multiple tests
```
Generate Cypress tests for the checkout flow including:
- Adding items to cart
- Filling shipping information
- Selecting payment method
- Completing the order
```

## Validating Tests

### Validate a test file
```
Validate the Cypress test file cypress/e2e/checkout.cy.js for syntax errors and best practices
```

### Validate test code
```
Validate this Cypress test code:
describe('My Test', () => {
  it('should work', () => {
    cy.visit('/');
    cy.get('.button').click();
  });
});
```

## Getting Results

### Get latest test results
```
Show me the results from the last Cypress test run
```

### Get specific run results
```
Get the test results for run ID run_1234567890
```

### Get screenshots from failed tests
```
Get all screenshots from the last failed test run
```

### Get test videos
```
Get all videos from the last Cypress test run
```

## Debugging

### Open Cypress Test Runner
```
Open Cypress Test Runner in headed mode for interactive debugging
```

### Run tests with environment variables
```
Run Cypress tests with environment variable API_URL=https://api.example.com
```

## Complex Scenarios

### End-to-end test scenario
```
Create a complete Cypress test for user registration that:
1. Navigates to the signup page
2. Fills in all required fields
3. Submits the form
4. Verifies email confirmation message
5. Handles any validation errors
6. Tests the success flow
```

### API testing scenario
```
Create a Cypress test that:
1. Intercepts GET /api/users
2. Mocks the response with sample data
3. Verifies the UI displays the mocked data correctly
4. Tests error handling for failed API calls
```

### Form validation testing
```
Generate Cypress tests for form validation that check:
- Required fields show error messages
- Email format validation
- Password strength requirements
- Form submission only when valid
```

## Best Practices Prompts

### Follow Cypress best practices
```
Generate a Cypress test following best practices for:
- Page Object Model pattern
- Data-driven testing with fixtures
- Custom commands for common actions
- Proper wait strategies
```

### Accessibility testing
```
Create Cypress tests that validate accessibility:
- ARIA labels are present
- Keyboard navigation works
- Screen reader compatibility
- Color contrast requirements
```

## Troubleshooting

### Debug failing test
```
The test cypress/e2e/login.cy.js is failing. Help me debug it by:
1. Validating the test code
2. Running it with verbose output
3. Capturing screenshots on failure
```

### Test performance
```
Analyze the performance of the test suite and identify slow tests
```

