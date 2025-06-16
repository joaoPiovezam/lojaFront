/**
 * API Mock responses for testing
 */

const API_BASE_URL = 'https://api.athlan.com.br';

class APIMocks {
  constructor(page) {
    this.page = page;
  }

  /**
   * Setup all common API mocks
   */
  async setupCommonMocks() {
    await this.mockLoginSuccess();
    await this.mockOrcamentos();
    await this.mockClientes();
    await this.mockPecas();
    await this.mockFornecedores();
  }

  /**
   * Mock successful login
   */
  async mockLoginSuccess() {
    await this.page.route(`${API_BASE_URL}/login`, route => {
      const request = route.request();
      const postData = JSON.parse(request.postData() || '{}');
      
      if (postData.username === 'testuser' && postData.password === 'testpass') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            token: 'mock-jwt-token-12345',
            user: {
              id: 1,
              email: 'testuser@example.com',
              username: 'testuser'
            },
            tipo: 'admin'
          })
        });
      } else {
        route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Invalid credentials'
          })
        });
      }
    });
  }

  /**
   * Mock failed login
   */
  async mockLoginFailure() {
    await this.page.route(`${API_BASE_URL}/login`, route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Invalid credentials'
        })
      });
    });
  }

  /**
   * Mock orçamentos (budgets) data
   */
  async mockOrcamentos() {
    await this.page.route(`${API_BASE_URL}/orcamento/**`, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: [
            {
              id: 1,
              numero: 'ORC-001',
              cliente: 'Cliente Teste 1',
              valor: 1500.00,
              status: 'pendente',
              data_criacao: '2024-01-15'
            },
            {
              id: 2,
              numero: 'ORC-002',
              cliente: 'Cliente Teste 2',
              valor: 2300.50,
              status: 'aprovado',
              data_criacao: '2024-01-16'
            }
          ],
          count: 2,
          next: null,
          previous: null
        })
      });
    });
  }

  /**
   * Mock clientes (customers) data
   */
  async mockClientes() {
    await this.page.route(`${API_BASE_URL}/clientes/**`, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: [
            {
              id: 1,
              nome: 'Cliente Teste 1',
              email: 'cliente1@test.com',
              telefone: '(11) 99999-9999',
              endereco: 'Rua Teste, 123',
              cidade: 'São Paulo',
              estado: 'SP'
            },
            {
              id: 2,
              nome: 'Cliente Teste 2',
              email: 'cliente2@test.com',
              telefone: '(11) 88888-8888',
              endereco: 'Av. Teste, 456',
              cidade: 'Rio de Janeiro',
              estado: 'RJ'
            }
          ],
          count: 2
        })
      });
    });
  }

  /**
   * Mock peças (parts) data
   */
  async mockPecas() {
    await this.page.route(`${API_BASE_URL}/peca/**`, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: [
            {
              id: 1,
              codigo: 'PEC-001',
              descricao: 'Peça Teste 1',
              preco: 150.00,
              estoque: 10,
              fornecedor: 'Fornecedor A'
            },
            {
              id: 2,
              codigo: 'PEC-002',
              descricao: 'Peça Teste 2',
              preco: 250.00,
              estoque: 5,
              fornecedor: 'Fornecedor B'
            }
          ],
          count: 2
        })
      });
    });
  }

  /**
   * Mock fornecedores (suppliers) data
   */
  async mockFornecedores() {
    await this.page.route(`${API_BASE_URL}/fornecedor/**`, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: [
            {
              id: 1,
              nome: 'Fornecedor A',
              email: 'fornecedorA@test.com',
              telefone: '(11) 77777-7777',
              cnpj: '12.345.678/0001-90'
            },
            {
              id: 2,
              nome: 'Fornecedor B',
              email: 'fornecedorB@test.com',
              telefone: '(11) 66666-6666',
              cnpj: '98.765.432/0001-10'
            }
          ],
          count: 2
        })
      });
    });
  }

  /**
   * Mock successful POST request
   */
  async mockSuccessfulPost(endpoint) {
    await this.page.route(`${API_BASE_URL}${endpoint}`, route => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: Math.floor(Math.random() * 1000),
            message: 'Created successfully'
          })
        });
      } else {
        route.continue();
      }
    });
  }

  /**
   * Mock error response
   */
  async mockErrorResponse(endpoint, status = 500, message = 'Internal Server Error') {
    await this.page.route(`${API_BASE_URL}${endpoint}`, route => {
      route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify({
          error: message
        })
      });
    });
  }

  /**
   * Clear all mocks
   */
  async clearMocks() {
    await this.page.unrouteAll();
  }
}

module.exports = { APIMocks };
