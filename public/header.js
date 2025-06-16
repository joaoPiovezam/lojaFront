/**
 * Secure Header Module
 * Provides secure navigation and user interface
 */

// Load security utilities if not already loaded
if (typeof SecurityUtils === 'undefined') {
    const script = document.createElement('script');
    script.src = 'security-utils.js';
    document.head.appendChild(script);
}

const template = document.createElement('template');

// Secure template with sanitized content
template.innerHTML = `
            <div class="navbar" id="navbar">
                <select onchange="atualizarMoeda()" id="dropDownMoeda" class="form-control" style="width: auto; display: inline-block;">
                    <option value="BRL">R$ BRL</option>
                    <option value="USD">US$ USD</option>
                    <option value="EUR">€ EUR</option>
                    <option value="CRC">₡ CRC</option>
                </select>
                <ul id="geral" class="navbar-nav">
                        <li><a href="/" class="nav-link">HOME</a></li>
                        <li><a href="/pecas.html" class="nav-link">Peça</a></li>
                        <li><a href="/cadastroOrcamento.html" class="nav-link">Orçamento</a></li>
                        <li><a href="/cadastroFatura.html" class="nav-link">Fatura</a></li>
                        <li><a href="/cadastroCotacao.html" class="nav-link">Cotação</a></li>
                        <li><a href="/cadastroPedidoCompra.html" class="nav-link">Pedido de Compra</a></li>
                        <li><a href="/cadastroPacotes.html" class="nav-link">Packing List</a></li>
                        <li><a href="/cadastroEstoque.html" class="nav-link">Estoque</a></li>
                        <li><a href="/fornecedores.html" class="nav-link">Fornecedores</a></li>
                        <li><a href="/cadastroTransportadora.html" class="nav-link">Transportadoras</a></li>
                </ul>
                <ul id="cliente" class="navbar-nav">
                    <li><a href="/pecas.html" class="nav-link">Catálogo</a></li>
                    <li><a href="/meusPedidos.html" class="nav-link">Meus Pedidos</a></li>
                </ul>

            <div class="login-link" id="loginSection">
                <button id="loginButton" type="button" class="btn btn-primary" onclick="secureLogIn()">
                    <i class="fas fa-user"></i> Fazer Login
                </button>
            </div>

            <div class="login-link" id="logoutSection">
                <span id="userInfo" class="text-light mr-2"></span>
                <button id="logoutButton" type="button" class="btn btn-secondary" onclick="secureLogOut()">
                    <i class="fas fa-sign-out-alt"></i> Sair
                </button>
            </div>
            </div>
`;

// Initialize header after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeSecureHeader();
});

/**
 * Initialize secure header
 */
function initializeSecureHeader() {
    const headerElement = document.getElementById('header');
    if (headerElement) {
        headerElement.appendChild(template.content);
        setupAuthenticationUI();
        setupCurrencySelector();
        setupSecurityEventListeners();
    }
}

/**
 * Setup authentication UI based on current state
 */
function setupAuthenticationUI() {
    const loginSection = document.getElementById('loginSection');
    const logoutSection = document.getElementById('logoutSection');
    const geralMenu = document.getElementById('geral');
    const clienteMenu = document.getElementById('cliente');
    const userInfo = document.getElementById('userInfo');

    // Check authentication status
    const isAuthenticated = window.secureAuth ? window.secureAuth.isAuthenticated() : checkLegacyAuth();
    const userType = getUserType();
    const userEmail = getUserEmail();

    if (isAuthenticated) {
        // Show logout section, hide login
        if (loginSection) loginSection.style.display = 'none';
        if (logoutSection) logoutSection.style.display = 'block';

        // Show user info
        if (userInfo && userEmail) {
            userInfo.textContent = SecurityUtils.sanitizeHTML(userEmail);
        }

        // Show appropriate menu based on user type
        if (userType === 'cliente') {
            if (geralMenu) geralMenu.style.display = 'none';
            if (clienteMenu) clienteMenu.style.display = 'block';
        } else {
            if (geralMenu) geralMenu.style.display = 'block';
            if (clienteMenu) clienteMenu.style.display = 'none';
        }
    } else {
        // Show login section, hide logout
        if (loginSection) loginSection.style.display = 'block';
        if (logoutSection) logoutSection.style.display = 'none';

        // Hide both menus for unauthenticated users
        if (geralMenu) geralMenu.style.display = 'none';
        if (clienteMenu) clienteMenu.style.display = 'none';
    }
}

/**
 * Setup currency selector with security
 */
function setupCurrencySelector() {
    const currencySelect = document.getElementById('dropDownMoeda');
    if (currencySelect) {
        // Get saved currency preference securely
        const savedCurrency = sessionStorage.getItem('selectedCurrency') || 'BRL';
        currencySelect.value = savedCurrency;

        // Add change event listener
        currencySelect.addEventListener('change', atualizarMoeda);
    }
}

/**
 * Setup security event listeners
 */
function setupSecurityEventListeners() {
    // Monitor for suspicious activity
    document.addEventListener('click', function(event) {
        const target = event.target;

        // Log navigation attempts
        if (target.tagName === 'A' && target.href) {
            SecurityUtils.logSecurityEvent('navigation_attempt', {
                url: target.href,
                text: target.textContent
            });
        }
    });

    // Monitor for form tampering
    document.addEventListener('input', function(event) {
        const target = event.target;

        // Check for potentially malicious input
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
            const value = target.value;
            if (/<script|javascript:|on\w+=/i.test(value)) {
                SecurityUtils.logSecurityEvent('malicious_input_detected', {
                    field: target.name || target.id,
                    value: value
                });

                // Clear malicious input
                target.value = SecurityUtils.sanitizeInput(value);
            }
        }
    });
}

/**
 * Check legacy authentication (for backward compatibility)
 */
function checkLegacyAuth() {
    const legacyEmail = localStorage.getItem('email');
    const legacyToken = localStorage.getItem('tokenUsuario');

    return legacyEmail && legacyEmail !== 'null' && legacyToken;
}

/**
 * Get user type securely
 */
function getUserType() {
    if (window.secureAuth) {
        return window.secureAuth.getCurrentUser().type;
    }

    // Fallback to legacy storage
    return sessionStorage.getItem('user_type') || localStorage.getItem('tipo');
}

/**
 * Get user email securely
 */
function getUserEmail() {
    if (window.secureAuth) {
        return window.secureAuth.getCurrentUser().email;
    }

    // Fallback to legacy storage
    return sessionStorage.getItem('user_email') || localStorage.getItem('email');
}

/**
 * Secure currency update
 */
function atualizarMoeda() {
    const currencySelect = document.getElementById('dropDownMoeda');
    if (currencySelect) {
        const selectedCurrency = currencySelect.value;

        // Validate currency selection
        const validCurrencies = ['BRL', 'USD', 'EUR', 'CRC'];
        if (validCurrencies.includes(selectedCurrency)) {
            sessionStorage.setItem('selectedCurrency', selectedCurrency);

            // Log currency change
            SecurityUtils.logSecurityEvent('currency_changed', {
                currency: selectedCurrency
            });

            // Reload page to apply currency change
            location.reload();
        } else {
            SecurityUtils.logSecurityEvent('invalid_currency_attempt', {
                currency: selectedCurrency
            });
        }
    }
}

/**
 * Secure login function
 */
function secureLogIn() {
    window.location.href = '/login.html';
}

/**
 * Secure logout function
 */
function secureLogOut() {
    if (window.secureAuth) {
        window.secureAuth.logout();
    } else {
        // Legacy logout
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login.html';
    }
}

// Backward compatibility functions
function logIn() {
    secureLogIn();
}

function logOut() {
    secureLogOut();
}