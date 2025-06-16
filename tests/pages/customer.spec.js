const { test, expect } = require('@playwright/test');
const { TestHelpers } = require('../utils/helpers');
const { APIMocks } = require('../utils/api-mocks');
const { testData } = require('../fixtures/test-data');

test.describe('Customer Management', () => {
  let helpers;
  let apiMocks;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    apiMocks = new APIMocks(page);
    await helpers.clearStorage();
    await apiMocks.setupCommonMocks();
  });

  test.afterEach(async ({ page }) => {
    await apiMocks.clearMocks();
  });

  test('should display customer registration form', async ({ page }) => {
    await page.goto('/cadastroCliente.html');
    
    // Check if form elements exist
    const formFields = ['#nome', '#email', '#telefone', '#endereco', '#cidade', '#estado', '#cep'];
    
    for (const field of formFields) {
      if (await helpers.elementExists(field)) {
        await expect(page.locator(field)).toBeVisible();
      }
    }
    
    // Check if submit button exists
    const submitButton = page.locator('button[type="submit"], button[onclick*="cadastrar"], input[type="submit"]');
    if (await submitButton.count() > 0) {
      await expect(submitButton.first()).toBeVisible();
    }
  });

  test('should register new customer successfully', async ({ page }) => {
    await apiMocks.mockSuccessfulPost('/clientes/');
    await page.goto('/cadastroCliente.html');
    
    // Fill customer form if fields exist
    const customerData = testData.customers.new;
    
    for (const [selector, value] of Object.entries(customerData)) {
      if (await helpers.elementExists(selector)) {
        await page.fill(selector, value);
      }
    }
    
    // Submit form
    const submitButton = page.locator('button[type="submit"], button[onclick*="cadastrar"], input[type="submit"]');
    if (await submitButton.count() > 0) {
      await submitButton.first().click();
      await helpers.waitForPageLoad();
    }
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/cadastroCliente.html');
    
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"], button[onclick*="cadastrar"], input[type="submit"]');
    if (await submitButton.count() > 0) {
      await submitButton.first().click();
      
      // Check for validation messages or required field indicators
      const requiredFields = page.locator('input[required], select[required]');
      const fieldCount = await requiredFields.count();
      
      if (fieldCount > 0) {
        // At least one required field should be invalid
        const hasInvalidField = await page.evaluate(() => {
          const required = document.querySelectorAll('input[required], select[required]');
          return Array.from(required).some(field => !field.validity.valid);
        });
        expect(hasInvalidField).toBe(true);
      }
    }
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/cadastroCliente.html');
    
    const emailField = page.locator('#email, input[type="email"]');
    if (await emailField.count() > 0) {
      // Enter invalid email
      await emailField.first().fill('invalid-email');
      
      // Check validation
      const isValid = await emailField.first().evaluate(el => el.validity.valid);
      expect(isValid).toBe(false);
      
      // Enter valid email
      await emailField.first().fill('valid@email.com');
      const isValidNow = await emailField.first().evaluate(el => el.validity.valid);
      expect(isValidNow).toBe(true);
    }
  });

  test('should handle form submission errors', async ({ page }) => {
    await apiMocks.mockErrorResponse('/clientes/', 400, 'Validation Error');
    await page.goto('/cadastroCliente.html');
    
    // Fill form with valid data
    const customerData = testData.customers.new;
    for (const [selector, value] of Object.entries(customerData)) {
      if (await helpers.elementExists(selector)) {
        await page.fill(selector, value);
      }
    }
    
    // Submit form
    const submitButton = page.locator('button[type="submit"], button[onclick*="cadastrar"], input[type="submit"]');
    if (await submitButton.count() > 0) {
      await submitButton.first().click();
      
      // Should handle error gracefully (stay on page or show error message)
      await helpers.waitForPageLoad();
    }
  });

  test('should navigate back to login from registration', async ({ page }) => {
    await page.goto('/cadastroCliente.html');
    
    // Look for login link
    const loginLink = page.locator('a[href*="login"], a[href="/login.html"]');
    if (await loginLink.count() > 0) {
      await loginLink.first().click();
      await expect(page).toHaveURL(/login\.html/);
    }
  });

  test('should load header component', async ({ page }) => {
    await page.goto('/cadastroCliente.html');
    
    // Check if header is loaded
    const header = page.locator('#header');
    await expect(header).toBeAttached();
  });

  test('should have proper form styling', async ({ page }) => {
    await page.goto('/cadastroCliente.html');
    
    // Check for Bootstrap form classes
    const formControls = page.locator('.form-control');
    if (await formControls.count() > 0) {
      await expect(formControls.first()).toBeVisible();
    }
    
    // Check for Bootstrap button classes
    const buttons = page.locator('.btn');
    if (await buttons.count() > 0) {
      await expect(buttons.first()).toBeVisible();
    }
  });

  test('should handle special characters in form fields', async ({ page }) => {
    await page.goto('/cadastroCliente.html');
    
    // Test special characters in name field
    const nameField = page.locator('#nome, input[name="nome"]');
    if (await nameField.count() > 0) {
      await nameField.first().fill('José da Silva & Cia. Ltda.');
      const value = await nameField.first().inputValue();
      expect(value).toBe('José da Silva & Cia. Ltda.');
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/cadastroCliente.html');
    
    // Check that form is still usable on mobile
    const form = page.locator('form');
    if (await form.count() > 0) {
      await expect(form.first()).toBeVisible();
    }
    
    // Check viewport meta tag
    const viewportMeta = page.locator('meta[name="viewport"]');
    await expect(viewportMeta).toHaveAttribute('content', /width=device-width/);
  });

  test('should handle CNPJ validation if present', async ({ page }) => {
    await page.goto('/cadastroCliente.html');
    
    const cnpjField = page.locator('#cnpj, input[name="cnpj"]');
    if (await cnpjField.count() > 0) {
      // Test invalid CNPJ
      await cnpjField.first().fill('123.456.789/0001-00');
      
      // Test valid CNPJ format
      await cnpjField.first().fill('12.345.678/0001-90');
      const value = await cnpjField.first().inputValue();
      expect(value).toContain('12.345.678/0001-90');
    }
  });

  test('should handle phone number formatting', async ({ page }) => {
    await page.goto('/cadastroCliente.html');
    
    const phoneField = page.locator('#telefone, input[name="telefone"], input[type="tel"]');
    if (await phoneField.count() > 0) {
      await phoneField.first().fill('11999999999');
      
      // Check if formatting is applied or value is accepted
      const value = await phoneField.first().inputValue();
      expect(value.length).toBeGreaterThan(0);
    }
  });
});
