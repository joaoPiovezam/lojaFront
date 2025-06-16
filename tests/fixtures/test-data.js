/**
 * Test data fixtures for Playwright tests
 */

const testData = {
  // User credentials
  users: {
    valid: {
      username: 'testuser',
      password: 'testpass',
      email: 'testuser@example.com'
    },
    invalid: {
      username: 'wronguser',
      password: 'wrongpass'
    },
    admin: {
      username: 'admin',
      password: 'adminpass',
      email: 'admin@example.com'
    }
  },

  // Customer data
  customers: {
    new: {
      '#nome': 'João Silva',
      '#email': 'joao.silva@email.com',
      '#telefone': '(11) 99999-9999',
      '#endereco': 'Rua das Flores, 123',
      '#cidade': 'São Paulo',
      '#estado': 'SP',
      '#cep': '01234-567',
      '#cnpj': '12.345.678/0001-90'
    },
    existing: {
      id: 1,
      nome: 'Cliente Teste',
      email: 'cliente@test.com',
      telefone: '(11) 88888-8888'
    }
  },

  // Order/Budget data
  orders: {
    new: {
      '#cliente': '1',
      '#descricao': 'Pedido de teste',
      '#valor': '1500.00',
      '#prazo': '2024-12-31',
      '#observacoes': 'Observações do pedido de teste'
    },
    existing: {
      id: 1,
      numero: 'ORC-001',
      cliente: 'Cliente Teste',
      valor: 1500.00,
      status: 'pendente'
    }
  },

  // Parts data
  parts: {
    new: {
      '#codigo': 'PEC-TEST-001',
      '#descricao': 'Peça de Teste',
      '#preco': '150.00',
      '#estoque': '10',
      '#fornecedor': '1'
    },
    existing: {
      id: 1,
      codigo: 'PEC-001',
      descricao: 'Peça Existente',
      preco: 100.00,
      estoque: 5
    }
  },

  // Supplier data
  suppliers: {
    new: {
      '#nome': 'Fornecedor Teste',
      '#email': 'fornecedor@test.com',
      '#telefone': '(11) 77777-7777',
      '#cnpj': '98.765.432/0001-10',
      '#endereco': 'Av. Industrial, 456',
      '#cidade': 'São Paulo',
      '#estado': 'SP'
    },
    existing: {
      id: 1,
      nome: 'Fornecedor Existente',
      email: 'fornecedor@existing.com'
    }
  },

  // Invoice data
  invoices: {
    new: {
      '#numero': 'FAT-001',
      '#orcamento': '1',
      '#valor': '1500.00',
      '#vencimento': '2024-12-31',
      '#observacoes': 'Fatura de teste'
    }
  },

  // File upload test data
  files: {
    csv: {
      name: 'test-parts.csv',
      content: 'codigo,descricao,preco\nPEC-001,Peça 1,100.00\nPEC-002,Peça 2,200.00'
    },
    txt: {
      name: 'test-data.txt',
      content: 'PEC-001;Peça 1;100.00\nPEC-002;Peça 2;200.00'
    }
  },

  // API response templates
  apiResponses: {
    loginSuccess: {
      token: 'mock-jwt-token-12345',
      user: {
        id: 1,
        email: 'testuser@example.com',
        username: 'testuser'
      },
      tipo: 'admin'
    },
    loginError: {
      error: 'Invalid credentials'
    },
    emptyList: {
      results: [],
      count: 0,
      next: null,
      previous: null
    },
    paginatedResponse: {
      results: [],
      count: 0,
      next: 'http://api.example.com/endpoint/?page=2',
      previous: null
    }
  },

  // Form validation messages
  validationMessages: {
    required: 'Este campo é obrigatório',
    email: 'Digite um email válido',
    phone: 'Digite um telefone válido',
    cnpj: 'Digite um CNPJ válido',
    number: 'Digite um número válido'
  },

  // Navigation menu items
  navigation: {
    mainMenu: [
      { text: 'Home', url: '/index.html' },
      { text: 'Clientes', url: '/cadastroCliente.html' },
      { text: 'Fornecedores', url: '/fornecedores.html' },
      { text: 'Peças', url: '/pecas.html' },
      { text: 'Orçamentos', url: '/orcamento.html' },
      { text: 'Pedidos', url: '/pedido.html' },
      { text: 'Faturas', url: '/fatura.html' }
    ]
  },

  // Table headers for verification
  tableHeaders: {
    customers: ['Nome', 'Email', 'Telefone', 'Cidade', 'Ações'],
    orders: ['Número', 'Cliente', 'Valor', 'Status', 'Data', 'Ações'],
    parts: ['Código', 'Descrição', 'Preço', 'Estoque', 'Fornecedor', 'Ações'],
    suppliers: ['Nome', 'Email', 'Telefone', 'CNPJ', 'Ações'],
    invoices: ['Número', 'Orçamento', 'Valor', 'Vencimento', 'Status', 'Ações']
  },

  // Language options
  languages: {
    pt: { code: 'pt-BR', flag: 'br_flag.png' },
    en: { code: 'en', flag: 'Flag_of_Great_Britain.png' },
    es: { code: 'es', flag: 'Bandera_de_España.png' }
  }
};

module.exports = { testData };
