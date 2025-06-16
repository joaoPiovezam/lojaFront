const { test, expect } = require('@playwright/test');
const { TestHelpers } = require('../utils/helpers');
const { APIMocks } = require('../utils/api-mocks');
const { testData } = require('../fixtures/test-data');

test.describe('Home Page Functionality', () => {
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

  test('should display home page correctly', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check page title
    await expect(page).toHaveTitle('Home');
    
    // Check main sections exist
    await expect(page.locator('#header')).toBeAttached();
    await expect(page.locator('#dropdownOrcamento')).toBeVisible();
    await expect(page.locator('#tabela-orcamento')).toBeVisible();
    await expect(page.locator('#tabela-faturas')).toBeVisible();
    await expect(page.locator('#tabela-cotacoes')).toBeVisible();
    
    // Check section headers
    await expect(page.locator('h5')).toHaveCount(3);
    await expect(page.getByText('Orçamentos não faturados')).toBeVisible();
    await expect(page.getByText('Orçamentos faturados')).toBeVisible();
    await expect(page.getByText('Cotações por faturas')).toBeVisible();
  });

  test('should initialize localStorage correctly', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check that orcamentoId is initialized
    const orcamentoId = await helpers.getLocalStorage('orcamentoId');
    expect(orcamentoId).toBe('0');
  });

  test('should load dropdown options', async ({ page }) => {
    await page.goto('/index.html');
    await helpers.waitForPageLoad();
    
    // Check dropdown exists and has default option
    const dropdown = page.locator('#dropdownOrcamento');
    await expect(dropdown).toBeVisible();
    
    const defaultOption = dropdown.locator('option[value=""]');
    await expect(defaultOption).toContainText('Selecione o Orçamento');
  });

  test('should update localStorage when dropdown changes', async ({ page }) => {
    await page.goto('/index.html');
    await helpers.waitForPageLoad();
    
    // Simulate dropdown change
    await page.evaluate(() => {
      const dropdown = document.getElementById('dropdownOrcamento');
      const option = document.createElement('option');
      option.value = '123';
      option.text = 'Orçamento 123';
      dropdown.appendChild(option);
      dropdown.value = '123';
      dropdown.dispatchEvent(new Event('change'));
    });
    
    // Check localStorage was updated
    const orcamentoId = await helpers.getLocalStorage('orcamentoId');
    expect(orcamentoId).toBe('123');
  });

  test('should load orçamentos não faturados', async ({ page }) => {
    await page.goto('/index.html');
    await helpers.waitForPageLoad();
    
    // Wait for data to load
    await page.waitForTimeout(2000);
    
    // Check if table container exists
    const tabelaOrcamento = page.locator('#tabela-orcamento');
    await expect(tabelaOrcamento).toBeVisible();
  });

  test('should load orçamentos faturados', async ({ page }) => {
    await page.goto('/index.html');
    await helpers.waitForPageLoad();
    
    // Wait for data to load
    await page.waitForTimeout(2000);
    
    // Check if table container exists
    const tabelaFaturas = page.locator('#tabela-faturas');
    await expect(tabelaFaturas).toBeVisible();
  });

  test('should load cotações por faturas', async ({ page }) => {
    await page.goto('/index.html');
    await helpers.waitForPageLoad();
    
    // Wait for data to load
    await page.waitForTimeout(2000);
    
    // Check if table container exists
    const tabelaCotacoes = page.locator('#tabela-cotacoes');
    await expect(tabelaCotacoes).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await apiMocks.mockErrorResponse('/orcamento/', 500, 'Server Error');
    
    await page.goto('/index.html');
    await helpers.waitForPageLoad();
    
    // Page should still load even with API errors
    await expect(page.locator('#tabela-orcamento')).toBeVisible();
    await expect(page.locator('#tabela-faturas')).toBeVisible();
    await expect(page.locator('#tabela-cotacoes')).toBeVisible();
  });

  test('should have proper Bootstrap styling', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check Bootstrap classes
    await expect(page.locator('.container')).toHaveCount(3);
    
    // Check that Bootstrap CSS is loaded
    const bootstrapLink = page.locator('link[href*="bootstrap"]');
    await expect(bootstrapLink).toBeAttached();
  });

  test('should load custom CSS', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check that custom CSS is loaded
    const customCssLink = page.locator('link[href="style.css"]');
    await expect(customCssLink).toBeAttached();
  });

  test('should load JavaScript files', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check that index.js is loaded
    const indexScript = page.locator('script[src="index.js"]');
    await expect(indexScript).toBeAttached();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/index.html');
    
    // Check that page elements are still visible
    await expect(page.locator('#dropdownOrcamento')).toBeVisible();
    await expect(page.locator('.container')).toHaveCount(3);
    
    // Check viewport meta tag
    const viewportMeta = page.locator('meta[name="viewport"]');
    await expect(viewportMeta).toHaveAttribute('content', 'width=device-width, initial-scale=1.0');
  });

  test('should handle navigation functions', async ({ page }) => {
    await page.goto('/index.html');
    await helpers.waitForPageLoad();
    
    // Test if navigation functions are available
    const hasNavigationFunctions = await page.evaluate(() => {
      return typeof window.adicionarPecas === 'function' &&
             typeof window.vizualizarFatura === 'function' &&
             typeof window.vizualizarPacotes === 'function' &&
             typeof window.vizualizarPedidoCompra === 'function' &&
             typeof window.editarOrcamento === 'function';
    });
    
    expect(hasNavigationFunctions).toBe(true);
  });

  test('should handle pagination if present', async ({ page }) => {
    await page.goto('/index.html');
    await helpers.waitForPageLoad();
    
    // Check if pagination function exists
    const hasPaginationFunction = await page.evaluate(() => {
      return typeof window.proximaPagina === 'function';
    });
    
    expect(hasPaginationFunction).toBe(true);
  });
});
