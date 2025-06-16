// Secure User Registration Module
function loadScript(url) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onerror = function() {
        console.error('Failed to load script:', url);
    };
    head.appendChild(script);
}

// Load required scripts
loadScript("security-utils.js");
loadScript("secure-auth.js");
loadScript("secure-forms.js");
loadScript("header.js");

// Initialize form after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    preecheEnderecoCEP();
    setupSecureRegistration();
});

/**
 * Setup secure registration form
 */
function setupSecureRegistration() {
    const validationRules = {
        email: { type: 'email' },
        username: { type: 'text', minLength: 3, maxLength: 50 },
        password: { type: 'password', confirmField: 'passwordC' },
        passwordC: { type: 'password' },
        cpf: { type: 'cpf' },
        telefone: { type: 'phone' },
        rua: { type: 'text', minLength: 5, maxLength: 100 },
        numero: { type: 'text', minLength: 1, maxLength: 10 },
        bairro: { type: 'text', minLength: 2, maxLength: 50 },
        cidade: { type: 'text', minLength: 2, maxLength: 50 }
    };

    // Setup form validation
    window.secureFormHandler.setupFormValidation('registrationForm', validationRules);

    // Setup input formatting
    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');

    if (cpfInput) {
        cpfInput.addEventListener('input', () => window.secureFormHandler.formatCPF(cpfInput));
    }

    if (telefoneInput) {
        telefoneInput.addEventListener('input', () => window.secureFormHandler.formatPhone(telefoneInput));
    }
}

/**
 * Secure user registration
 */
async function criarConta() {
    try {
        await cadastrarUsuario();
    } catch (error) {
        console.error('Registration error:', error);
        showError(error.message);
    }
}

/**
 * Load API URL securely
 */
async function carregarUrl() {
    try {
        const urlA = await fetch('./rotaBack.json');
        const dados = await urlA.json();
        return dados.API_URL;
    } catch (error) {
        SecurityUtils.logSecurityEvent('api_url_load_failed', { error: error.message });
        throw new Error('Falha ao carregar configuração da API');
    }
}

/**
 * Secure user registration with validation
 */
async function cadastrarUsuario() {
    // Rate limiting check
    if (!SecurityUtils.checkRateLimit('registration', 3, 600000)) { // 3 attempts per 10 minutes
        throw new Error('Muitas tentativas de cadastro. Tente novamente em alguns minutos.');
    }

    const urlA = await carregarUrl();

    // Collect and sanitize form data
    const dados = {
        email: SecurityUtils.sanitizeInput(document.getElementById("email").value.trim()),
        username: SecurityUtils.sanitizeInput(document.getElementById("username").value.trim()),
        password: document.getElementById("password").value,
        passwordC: document.getElementById("passwordC").value,
        cpf: document.getElementById("cpf").value.replace(/\D/g, ''),
        cep: SecurityUtils.sanitizeInput(document.getElementById("cep").value.trim()),
        rua: SecurityUtils.sanitizeInput(document.getElementById("rua").value.trim()),
        numero: SecurityUtils.sanitizeInput(document.getElementById("numero").value.trim()),
        complemento: SecurityUtils.sanitizeInput(document.getElementById("complemento").value.trim()),
        bairro: SecurityUtils.sanitizeInput(document.getElementById("bairro").value.trim()),
        cidade: SecurityUtils.sanitizeInput(document.getElementById("cidade").value.trim()),
        telefone: document.getElementById("telefone").value.replace(/\D/g, '')
    };

    // Validation
    if (!SecurityUtils.validateEmail(dados.email)) {
        throw new Error('Email inválido');
    }

    const passwordValidation = SecurityUtils.validatePassword(dados.password);
    if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors[0]);
    }

    if (dados.password !== dados.passwordC) {
        throw new Error('Senhas não coincidem');
    }

    if (!window.secureFormHandler.isValidCPF(dados.cpf)) {
        throw new Error('CPF inválido');
    }

    // Build address string securely
    const endereco = `rua: ${dados.rua}, número: ${dados.numero}, complemento: ${dados.complemento}, bairro: ${dados.bairro}`;

    try {
        // Create user account
        const signupResponse = await SecurityUtils.secureSubmit(urlA + "/signup", {
            email: dados.email,
            username: dados.username,
            password: dados.password
        });

        if (!signupResponse.ok) {
            const errorData = await signupResponse.json();
            throw new Error(errorData.message || 'Erro ao criar conta');
        }

        // Create user profile
        const profileResponse = await SecurityUtils.secureSubmit(urlA + "/usuarios/", {
            nome: dados.username,
            empresa: "JP",
            email: dados.email,
            cpfcnpj: dados.cpf,
            endereco: endereco,
            cep: dados.cep,
            cidade: dados.cidade,
            pais: "Brasil",
            telefone: dados.telefone
        });

        if (!profileResponse.ok) {
            throw new Error('Erro ao criar perfil do usuário');
        }

        // Success
        showSuccess('Conta criada com sucesso! Redirecionando para login...');

        // Clear form
        document.getElementById('registrationForm').reset();

        // Redirect to login after delay
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 2000);

        SecurityUtils.logSecurityEvent('user_registration_success', {
            email: dados.email,
            username: dados.username
        });

    } catch (error) {
        SecurityUtils.logSecurityEvent('user_registration_failed', {
            email: dados.email,
            error: error.message
        });
        throw error;
    }
}

/**
 * Show error message
 */
function showError(message) {
    const alertDiv = document.getElementById('alert');
    const alertMessage = document.getElementById('alertMessage');

    if (alertDiv && alertMessage) {
        alertMessage.textContent = message;
        alertDiv.classList.remove('d-none');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            alertDiv.classList.add('d-none');
        }, 5000);
    } else {
        alert(message);
    }
}

/**
 * Show success message
 */
function showSuccess(message) {
    const successDiv = document.getElementById('success');

    if (successDiv) {
        successDiv.textContent = message;
        successDiv.classList.remove('d-none');
    } else {
        alert(message);
    }
}

/**
 * Legacy CPF formatting function (kept for compatibility)
 */
function cpf() {
    var cpfInput = document.querySelector("#cpf");
    if (cpfInput) {
        cpfInput.addEventListener("input", function() {
            window.secureFormHandler.formatCPF(cpfInput);
        });
    }
}

/**
 * Address auto-fill from CEP
 */
function preecheEnderecoCEP() {
    const cepInput = document.getElementById('cep');
    if (!cepInput) return;

    cepInput.addEventListener('blur', async function() {
        const cep = this.value.replace(/\D/g, '');

        if (cep.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();

                if (!data.erro) {
                    document.getElementById('rua').value = SecurityUtils.sanitizeInput(data.logradouro || '');
                    document.getElementById('bairro').value = SecurityUtils.sanitizeInput(data.bairro || '');
                    document.getElementById('cidade').value = SecurityUtils.sanitizeInput(data.localidade || '');
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
            }
        }
    });
}

function preecheEnderecoCEP(){
    const cepInput = document.getElementById('cep');

    cepInput.addEventListener('blur', () => {
        const cep = cepInput.value;
        const url = `https://viacep.com.br/ws/${cep}/json/`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    alert('CEP não encontrado');
                } else {
                    document.getElementById('rua').value = data.logradouro;
                    document.getElementById('bairro').value = data.bairro;
                    document.getElementById('cidade').value = data.localidade;
                    document.getElementById('estado').value = data.uf;
                }
            })
            .catch(error => {
                console.error('Erro ao buscar CEP:', error);
            });
    });
}