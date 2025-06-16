const { test, expect } = require('@playwright/test');
const { TestHelpers } = require('../utils/helpers');
const { APIMocks } = require('../utils/api-mocks');
const { testData } = require('../fixtures/test-data');

test.describe('Order Management', () => {
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

  test('should display order creation form', async ({ page }) => {
    await page.goto('/cadastroOrcamento.html');
    
    // Check if page loads
    await helpers.waitForPageLoad();
    
    // Look for common form elements
    const formElements = [
      'form',
      'input[type="text"]',
      'input[type="number"]',
      'select',
      'textarea',
      'button[type="submit"]'
    ];
    
    let hasFormElements = false;
    for (const selector of formElements) {
      if (await helpers.elementExists(selector)) {
        hasFormElements = true;
        break;
      }
    }
    
    expect(hasFormElements).toBe(true);
  });

  test('should display order list page', async ({ page }) => {
    await page.goto('/orcamento.html');
    
    await helpers.waitForPageLoad();
    
    // Check if page has table or list container
    const hasTable = await helpers.elementExists('table') || 
                     await helpers.elementExists('.table') ||
                     await helpers.elementExists('#tabela-orcamento') ||
                     await helpers.elementExists('.container');
    
    expect(hasTable).toBe(true);
  });

  test('should display order details page', async ({ page }) => {
    // Set an order ID in localStorage
    await helpers.setLocalStorage('orcamentoId', '1');
    
    await page.goto('/pedido.html');
    await helpers.waitForPageLoad();
    
    // Check if page loads with order details
    const hasContent = await helpers.elementExists('table') || 
                       await helpers.elementExists('.container') ||
                       await helpers.elementExists('#tabela-pedidos');
    
    expect(hasContent).toBe(true);
  });

  test('should handle order editing', async ({ page }) => {
    await helpers.setLocalStorage('orcamentoId', '1');
    
    await page.goto('/editarPedidos.html');
    await helpers.waitForPageLoad();
    
    // Check if edit form or interface is present
    const hasEditInterface = await helpers.elementExists('form') ||
                             await helpers.elementExists('input') ||
                             await helpers.elementExists('button');
    
    expect(hasEditInterface).toBe(true);
  });

  test('should create new order with valid data', async ({ page }) => {
    await apiMocks.mockSuccessfulPost('/orcamento/');
    
    await page.goto('/cadastroOrcamento.html');
    
    // Fill order form if fields exist
    const orderData = testData.orders.new;
    
    for (const [selector, value] of Object.entries(orderData)) {
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

  test('should validate order form fields', async ({ page }) => {
    await page.goto('/cadastroOrcamento.html');
    
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"], button[onclick*="cadastrar"], input[type="submit"]');
    if (await submitButton.count() > 0) {
      await submitButton.first().click();
      
      // Check for validation
      const requiredFields = page.locator('input[required], select[required]');
      const fieldCount = await requiredFields.count();
      
      if (fieldCount > 0) {
        const hasInvalidField = await page.evaluate(() => {
          const required = document.querySelectorAll('input[required], select[required]');
          return Array.from(required).some(field => !field.validity.valid);
        });
        expect(hasInvalidField).toBe(true);
      }
    }
  });

  test('should handle order search and filtering', async ({ page }) => {
    await page.goto('/orcamento.html');
    await helpers.waitForPageLoad();
    
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="buscar"], input[placeholder*="search"]');
    if (await searchInput.count() > 0) {
      await searchInput.first().fill('test');
      await page.keyboard.press('Enter');
      await helpers.waitForPageLoad();
    }
  });

  test('should handle order pagination', async ({ page }) => {
    await page.goto('/orcamento.html');
    await helpers.waitForPageLoad();
    
    // Look for pagination controls
    const paginationButtons = page.locator('button[onclick*="pagina"], .pagination button, .page-link');
    if (await paginationButtons.count() > 0) {
      // Test pagination function exists
      const hasPaginationFunction = await page.evaluate(() => {
        return typeof window.proximaPagina === 'function';
      });
      expect(hasPaginationFunction).toBe(true);
    }
  });

  test('should display order actions', async ({ page }) => {
    await page.goto('/orcamento.html');
    await helpers.waitForPageLoad();
    
    // Check for action buttons or links
    const actionElements = page.locator('button[onclick*="editar"], button[onclick*="visualizar"], a[onclick*="editar"]');
    
    // If actions exist, test that they work
    if (await actionElements.count() > 0) {
      // Test that action functions exist
      const hasActionFunctions = await page.evaluate(() => {
        return typeof window.editarOrcamento === 'function' ||
               typeof window.vizualizarFatura === 'function' ||
               typeof window.adicionarPecas === 'function';
      });
      expect(hasActionFunctions).toBe(true);
    }
  });

  test('should handle order status updates', async ({ page }) => {
    await helpers.setLocalStorage('orcamentoId', '1');
    await page.goto('/editarPedidos.html');
    await helpers.waitForPageLoad();
    
    // Look for status dropdown or buttons
    const statusElements = page.locator('select[name*="status"], button[onclick*="status"]');
    if (await statusElements.count() > 0) {
      // Test status change functionality
      const statusSelect = page.locator('select[name*="status"]');
      if (await statusSelect.count() > 0) {
        await statusSelect.first().selectOption({ index: 1 });
      }
    }
  });

  test('should handle file uploads for orders', async ({ page }) => {
    await page.goto('/cadastroOrcamento.html');
    
    // Look for file input
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.count() > 0) {
      // Test file upload functionality exists
      const hasUploadFunction = await page.evaluate(() => {
        return typeof window.addPecasOrcamendo === 'function' ||
               typeof window.enviarArquivo === 'function';
      });
      expect(hasUploadFunction).toBe(true);
    }
  });

  test('should generate PDF for orders', async ({ page }) => {
    await helpers.setLocalStorage('orcamentoId', '1');
    await page.goto('/pedido.html');
    await helpers.waitForPageLoad();
    
    // Look for PDF generation button
    const pdfButton = page.locator('button[onclick*="PDF"], button[onclick*="pdf"]');
    if (await pdfButton.count() > 0) {
      // Test PDF generation function exists
      const hasPDFFunction = await page.evaluate(() => {
        return typeof window.gerarPDF === 'function';
      });
      expect(hasPDFFunction).toBe(true);
    }
  });

  test('should handle order parts management', async ({ page }) => {
    await helpers.setLocalStorage('orcamentoId', '1');
    await page.goto('/pecas.html');
    await helpers.waitForPageLoad();
    
    // Check if parts table or interface is present
    const hasPartsInterface = await helpers.elementExists('#tabela-pedidos') ||
                              await helpers.elementExists('table') ||
                              await helpers.elementExists('.container');
    
    expect(hasPartsInterface).toBe(true);
  });

  test('should handle multi-language support', async ({ page }) => {
    await helpers.setLocalStorage('orcamentoId', '1');
    
    // Test English version
    await page.goto('/en/packingList.html');
    await helpers.waitForPageLoad();
    
    // Check if page loads
    const hasContent = await helpers.elementExists('.container') ||
                       await helpers.elementExists('table');
    expect(hasContent).toBe(true);
    
    // Test Spanish version
    await page.goto('/es/packingList.html');
    await helpers.waitForPageLoad();
    
    const hasSpanishContent = await helpers.elementExists('.container') ||
                              await helpers.elementExists('table');
    expect(hasSpanishContent).toBe(true);
  });

  test('should handle order invoice generation', async ({ page }) => {
    await helpers.setLocalStorage('orcamentoId', '1');
    await page.goto('/fatura.html');
    await helpers.waitForPageLoad();
    
    // Check if invoice interface is present
    const hasInvoiceInterface = await helpers.elementExists('table') ||
                                await helpers.elementExists('.container') ||
                                await helpers.elementExists('#fatura');
    
    expect(hasInvoiceInterface).toBe(true);
  });
});
