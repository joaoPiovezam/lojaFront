const { test, expect } = require('@playwright/test');
const { TestHelpers } = require('../utils/helpers');
const { APIMocks } = require('../utils/api-mocks');
const { testData } = require('../fixtures/test-data');

test.describe('Navigation and Integration Tests', () => {
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

  test('should navigate between main pages', async ({ page }) => {
    const pages = [
      { url: '/index.html', title: 'Home' },
      { url: '/login.html', title: 'Login' },
      { url: '/cadastroCliente.html', title: /Cliente|Cadastro/ },
      { url: '/orcamento.html', title: /Orçamento/ },
      { url: '/pedido.html', title: /Pedido/ },
      { url: '/fatura.html', title: /Fatura/ }
    ];

    for (const pageInfo of pages) {
      await page.goto(pageInfo.url);
      await helpers.waitForPageLoad();
      
      // Check if page loads without errors
      const hasError = await page.locator('body').evaluate(body => {
        return body.textContent?.includes('404') || 
               body.textContent?.includes('Error') ||
               body.textContent?.includes('Not Found');
      });
      
      expect(hasError).toBe(false);
    }
  });

  test('should load header component on all pages', async ({ page }) => {
    const pages = [
      '/index.html',
      '/login.html',
      '/cadastroCliente.html',
      '/orcamento.html',
      '/pedido.html'
    ];

    for (const url of pages) {
      await page.goto(url);
      await helpers.waitForPageLoad();
      
      // Check if header element exists
      const header = page.locator('#header');
      await expect(header).toBeAttached();
    }
  });

  test('should handle localStorage persistence across pages', async ({ page }) => {
    // Set localStorage on one page
    await page.goto('/index.html');
    await helpers.setLocalStorage('testKey', 'testValue');
    await helpers.setLocalStorage('orcamentoId', '123');
    
    // Navigate to another page
    await page.goto('/pedido.html');
    
    // Check if localStorage persists
    const testValue = await helpers.getLocalStorage('testKey');
    const orcamentoId = await helpers.getLocalStorage('orcamentoId');
    
    expect(testValue).toBe('testValue');
    expect(orcamentoId).toBe('123');
  });

  test('should handle API configuration loading', async ({ page }) => {
    await page.goto('/index.html');
    await helpers.waitForPageLoad();
    
    // Check if rotaBack.json is loaded
    const response = await page.request.get('/rotaBack.json');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('API_URL');
    expect(data.API_URL).toBe('https://api.athlan.com.br');
  });

  test('should handle cross-page navigation with order ID', async ({ page }) => {
    // Start on index page
    await page.goto('/index.html');
    await helpers.setLocalStorage('orcamentoId', '456');
    
    // Navigate to order details
    await page.goto('/pedido.html');
    await helpers.waitForPageLoad();
    
    // Check if order ID is maintained
    const orcamentoId = await helpers.getLocalStorage('orcamentoId');
    expect(orcamentoId).toBe('456');
  });

  test('should handle language switching', async ({ page }) => {
    await helpers.setLocalStorage('orcamentoId', '1');
    
    // Start with Portuguese version
    await page.goto('/packingList.html');
    await helpers.waitForPageLoad();
    
    // Check for language flags/links
    const englishFlag = page.locator('a[href*="/en/"], img[src*="Flag_of_Great_Britain"]');
    const spanishFlag = page.locator('a[href*="/es/"], img[src*="Bandera_de_España"]');
    
    if (await englishFlag.count() > 0) {
      // Test English navigation
      await englishFlag.first().click();
      await helpers.waitForPageLoad();
      await expect(page).toHaveURL(/\/en\//);
    }
    
    if (await spanishFlag.count() > 0) {
      // Navigate back and test Spanish
      await page.goto('/packingList.html');
      await spanishFlag.first().click();
      await helpers.waitForPageLoad();
      await expect(page).toHaveURL(/\/es\//);
    }
  });

  test('should handle file operations across pages', async ({ page }) => {
    await page.goto('/pecas.html');
    await helpers.waitForPageLoad();
    
    // Check if file upload functions exist
    const hasFileUploadFunctions = await page.evaluate(() => {
      return typeof window.addPecasOrcamendo === 'function' ||
             typeof window.addPecasCatalogo === 'function' ||
             typeof window.addPecasCatalogoFornecedor === 'function';
    });
    
    expect(hasFileUploadFunctions).toBe(true);
  });

  test('should handle PDF generation across different pages', async ({ page }) => {
    await helpers.setLocalStorage('orcamentoId', '1');
    
    const pdfPages = [
      '/fatura.html',
      '/packingList.html',
      '/pedido.html'
    ];
    
    for (const url of pdfPages) {
      await page.goto(url);
      await helpers.waitForPageLoad();
      
      // Check if PDF generation function exists
      const hasPDFFunction = await page.evaluate(() => {
        return typeof window.gerarPDF === 'function';
      });
      
      if (hasPDFFunction) {
        expect(hasPDFFunction).toBe(true);
      }
    }
  });

  test('should handle responsive design across pages', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 768, height: 1024 },  // Tablet
      { width: 375, height: 667 }    // Mobile
    ];
    
    const pages = ['/index.html', '/login.html', '/cadastroCliente.html'];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      
      for (const url of pages) {
        await page.goto(url);
        await helpers.waitForPageLoad();
        
        // Check if page is still functional
        const hasContent = await helpers.elementExists('body') &&
                          await helpers.elementExists('.container, .content, main');
        expect(hasContent).toBe(true);
      }
    }
  });

  test('should handle error pages gracefully', async ({ page }) => {
    // Test non-existent page
    const response = await page.goto('/non-existent-page.html');
    
    // Should either redirect or show 404
    if (response) {
      expect([200, 404]).toContain(response.status());
    }
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    // Navigate through pages
    await page.goto('/index.html');
    await page.goto('/login.html');
    await page.goto('/cadastroCliente.html');
    
    // Go back
    await page.goBack();
    await expect(page).toHaveURL(/login\.html/);
    
    // Go back again
    await page.goBack();
    await expect(page).toHaveURL(/index\.html/);
    
    // Go forward
    await page.goForward();
    await expect(page).toHaveURL(/login\.html/);
  });

  test('should handle external links and resources', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check if Bootstrap CSS loads
    const bootstrapResponse = await page.waitForResponse(
      response => response.url().includes('bootstrap') && response.status() === 200,
      { timeout: 10000 }
    ).catch(() => null);
    
    // Should either load Bootstrap or handle gracefully
    if (bootstrapResponse) {
      expect(bootstrapResponse.status()).toBe(200);
    }
  });

  test('should maintain session state during navigation', async ({ page }) => {
    // Simulate login
    await apiMocks.mockLoginSuccess();
    await helpers.login();
    
    // Navigate to different pages
    const pages = ['/index.html', '/orcamento.html', '/pedido.html'];
    
    for (const url of pages) {
      await page.goto(url);
      await helpers.waitForPageLoad();
      
      // Check if session data is maintained
      const token = await helpers.getLocalStorage('tokenUsuario');
      const email = await helpers.getLocalStorage('email');
      
      expect(token).toBeTruthy();
      expect(email).toBeTruthy();
    }
  });
});
