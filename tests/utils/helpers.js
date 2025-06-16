const { expect } = require('@playwright/test');

/**
 * Common helper functions for Playwright tests
 */
class TestHelpers {
  constructor(page) {
    this.page = page;
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Login with credentials
   */
  async login(username = 'testuser', password = 'testpass') {
    await this.page.goto('/login.html');
    await this.page.fill('#username', username);
    await this.page.fill('#password', password);
    await this.page.click('button[onclick="logar()"]');
    await this.waitForPageLoad();
  }

  /**
   * Clear localStorage
   */
  async clearStorage() {
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  /**
   * Set localStorage values
   */
  async setLocalStorage(key, value) {
    await this.page.evaluate(([k, v]) => {
      localStorage.setItem(k, v);
    }, [key, value]);
  }

  /**
   * Get localStorage value
   */
  async getLocalStorage(key) {
    return await this.page.evaluate((k) => {
      return localStorage.getItem(k);
    }, key);
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector, timeout = 5000) {
    await this.page.waitForSelector(selector, { 
      state: 'visible', 
      timeout 
    });
  }

  /**
   * Fill form fields from object
   */
  async fillForm(formData) {
    for (const [selector, value] of Object.entries(formData)) {
      await this.page.fill(selector, value);
    }
  }

  /**
   * Check if element exists
   */
  async elementExists(selector) {
    try {
      await this.page.waitForSelector(selector, { timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Take screenshot with timestamp
   */
  async takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${timestamp}.png`,
      fullPage: true 
    });
  }

  /**
   * Wait for API response
   */
  async waitForAPIResponse(urlPattern, timeout = 10000) {
    return await this.page.waitForResponse(
      response => response.url().includes(urlPattern) && response.status() === 200,
      { timeout }
    );
  }

  /**
   * Mock API response
   */
  async mockAPIResponse(urlPattern, responseData, status = 200) {
    await this.page.route(`**/*${urlPattern}*`, route => {
      route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(responseData)
      });
    });
  }

  /**
   * Check table data
   */
  async checkTableData(tableSelector, expectedData) {
    const rows = await this.page.locator(`${tableSelector} tr`).count();
    expect(rows).toBeGreaterThan(0);
    
    for (let i = 0; i < expectedData.length; i++) {
      const rowData = expectedData[i];
      for (const [column, value] of Object.entries(rowData)) {
        const cellSelector = `${tableSelector} tr:nth-child(${i + 1}) td:nth-child(${column})`;
        await expect(this.page.locator(cellSelector)).toContainText(value);
      }
    }
  }

  /**
   * Upload file
   */
  async uploadFile(inputSelector, filePath) {
    await this.page.setInputFiles(inputSelector, filePath);
  }

  /**
   * Download file and verify
   */
  async downloadAndVerify(triggerSelector, expectedFileName) {
    const downloadPromise = this.page.waitForEvent('download');
    await this.page.click(triggerSelector);
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toContain(expectedFileName);
    return download;
  }

  /**
   * Check alert message
   */
  async checkAlert(expectedMessage, alertSelector = '#alert') {
    await this.waitForElement(alertSelector);
    await expect(this.page.locator(alertSelector)).toContainText(expectedMessage);
  }

  /**
   * Navigate and verify page
   */
  async navigateAndVerify(url, expectedTitle) {
    await this.page.goto(url);
    await this.waitForPageLoad();
    await expect(this.page).toHaveTitle(expectedTitle);
  }
}

module.exports = { TestHelpers };
