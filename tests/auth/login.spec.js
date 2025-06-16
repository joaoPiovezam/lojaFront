const { test, expect } = require('@playwright/test');
const { TestHelpers } = require('../utils/helpers');
const { APIMocks } = require('../utils/api-mocks');
const { testData } = require('../fixtures/test-data');

test.describe('Login Functionality', () => {
  let helpers;
  let apiMocks;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    apiMocks = new APIMocks(page);
    await helpers.clearStorage();
  });

  test.afterEach(async ({ page }) => {
    await apiMocks.clearMocks();
  });

  test('should display login form correctly', async ({ page }) => {
    await page.goto('/login.html');
    
    // Check page title
    await expect(page).toHaveTitle('Login');
    
    // Check form elements exist
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[onclick="logar()"]')).toBeVisible();
    
    // Check placeholder texts
    await expect(page.locator('#username')).toHaveAttribute('placeholder', 'Nome');
    await expect(page.locator('#password')).toHaveAttribute('placeholder', 'Senha');
    
    // Check create account link
    await expect(page.locator('a[href="/cadastroCliente.html"]')).toBeVisible();
    await expect(page.locator('a[href="/cadastroCliente.html"]')).toContainText('Criar Conta');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await apiMocks.mockLoginSuccess();
    
    await page.goto('/login.html');
    
    // Fill login form
    await page.fill('#username', testData.users.valid.username);
    await page.fill('#password', testData.users.valid.password);
    
    // Submit form
    await page.click('button[onclick="logar()"]');
    
    // Wait for redirect
    await page.waitForURL('/index.html');
    
    // Verify localStorage was set
    const email = await helpers.getLocalStorage('email');
    const token = await helpers.getLocalStorage('tokenUsuario');
    const tipo = await helpers.getLocalStorage('tipo');
    const clienteId = await helpers.getLocalStorage('clienteId');
    
    expect(email).toBe('testuser@example.com');
    expect(token).toBe('mock-jwt-token-12345');
    expect(tipo).toBe('admin');
    expect(clienteId).toBe('1');
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    await apiMocks.mockLoginFailure();
    
    await page.goto('/login.html');
    
    // Fill login form with invalid credentials
    await page.fill('#username', testData.users.invalid.username);
    await page.fill('#password', testData.users.invalid.password);
    
    // Submit form
    await page.click('button[onclick="logar()"]');
    
    // Wait for error message
    await helpers.waitForElement('#alert');
    
    // Check error message is visible
    await expect(page.locator('#alert')).toBeVisible();
    await expect(page.locator('#alert')).toContainText('nome de usuario ou senha incorretos');
    await expect(page.locator('#alert')).not.toHaveClass(/d-none/);
    
    // Verify localStorage was not set
    const email = await helpers.getLocalStorage('email');
    expect(email).toBeNull();
  });

  test('should handle empty form submission', async ({ page }) => {
    await page.goto('/login.html');
    
    // Try to submit empty form
    await page.click('button[onclick="logar()"]');
    
    // Check that required validation works
    const usernameValidity = await page.locator('#username').evaluate(el => el.validity.valid);
    const passwordValidity = await page.locator('#password').evaluate(el => el.validity.valid);
    
    expect(usernameValidity).toBe(false);
    expect(passwordValidity).toBe(false);
  });

  test('should handle network error gracefully', async ({ page }) => {
    // Mock network error
    await page.route('**/login', route => {
      route.abort('failed');
    });
    
    await page.goto('/login.html');
    
    await page.fill('#username', testData.users.valid.username);
    await page.fill('#password', testData.users.valid.password);
    
    // Submit form
    await page.click('button[onclick="logar()"]');
    
    // Should stay on login page
    await expect(page).toHaveURL(/login\.html/);
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.goto('/login.html');
    
    // Click create account link
    await page.click('a[href="/cadastroCliente.html"]');
    
    // Should navigate to registration page
    await expect(page).toHaveURL(/cadastroCliente\.html/);
  });

  test('should load header script', async ({ page }) => {
    await page.goto('/login.html');
    
    // Check if header script is loaded
    const headerElement = await page.locator('#header');
    await expect(headerElement).toBeAttached();
  });

  test('should have proper form styling', async ({ page }) => {
    await page.goto('/login.html');
    
    // Check Bootstrap classes
    await expect(page.locator('#username')).toHaveClass(/form-control/);
    await expect(page.locator('#password')).toHaveClass(/form-control/);
    await expect(page.locator('button[onclick="logar()"]')).toHaveClass(/btn-primary/);
    
    // Check alert styling
    await expect(page.locator('#alert')).toHaveClass(/alert-danger/);
    await expect(page.locator('#alert')).toHaveClass(/d-none/);
  });

  test('should handle special characters in credentials', async ({ page }) => {
    await apiMocks.mockLoginSuccess();
    
    await page.goto('/login.html');
    
    // Test with special characters
    await page.fill('#username', 'test@user.com');
    await page.fill('#password', 'P@ssw0rd!123');
    
    await page.click('button[onclick="logar()"]');
    
    // Should handle special characters properly
    await helpers.waitForPageLoad();
  });
});
