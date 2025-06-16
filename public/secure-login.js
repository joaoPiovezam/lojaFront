/**
 * Secure Login Form Handler
 * Handles login form submission with security validations
 */

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    const alertDiv = document.getElementById('alert');
    const successDiv = document.getElementById('success');
    const alertMessage = document.getElementById('alertMessage');
    const loginText = document.getElementById('loginText');
    const loginSpinner = document.getElementById('loginSpinner');

    // Load header
    loadScript("header.js");

    // Form submission handler
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        await handleLogin();
    });

    // Real-time validation
    usernameInput.addEventListener('input', validateUsername);
    passwordInput.addEventListener('input', validatePassword);

    // Prevent form submission on Enter if validation fails
    loginForm.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (validateForm()) {
                handleLogin();
            }
        }
    });

    /**
     * Validate username input
     */
    function validateUsername() {
        const username = usernameInput.value.trim();
        const usernameError = document.getElementById('usernameError');
        
        usernameInput.classList.remove('is-invalid', 'is-valid');
        
        if (!username) {
            showFieldError(usernameInput, usernameError, 'Nome de usuário é obrigatório');
            return false;
        }
        
        if (username.length < 3) {
            showFieldError(usernameInput, usernameError, 'Nome de usuário deve ter pelo menos 3 caracteres');
            return false;
        }
        
        if (username.length > 50) {
            showFieldError(usernameInput, usernameError, 'Nome de usuário muito longo');
            return false;
        }
        
        // Check for potentially malicious input
        if (/<script|javascript:|on\w+=/i.test(username)) {
            showFieldError(usernameInput, usernameError, 'Caracteres inválidos detectados');
            SecurityUtils.logSecurityEvent('malicious_username_attempt', { username });
            return false;
        }
        
        showFieldSuccess(usernameInput, usernameError);
        return true;
    }

    /**
     * Validate password input
     */
    function validatePassword() {
        const password = passwordInput.value;
        const passwordError = document.getElementById('passwordError');
        
        passwordInput.classList.remove('is-invalid', 'is-valid');
        
        if (!password) {
            showFieldError(passwordInput, passwordError, 'Senha é obrigatória');
            return false;
        }
        
        if (password.length < 8) {
            showFieldError(passwordInput, passwordError, 'Senha deve ter pelo menos 8 caracteres');
            return false;
        }
        
        showFieldSuccess(passwordInput, passwordError);
        return true;
    }

    /**
     * Validate entire form
     */
    function validateForm() {
        const isUsernameValid = validateUsername();
        const isPasswordValid = validatePassword();
        
        return isUsernameValid && isPasswordValid;
    }

    /**
     * Show field error
     */
    function showFieldError(input, errorDiv, message) {
        input.classList.add('is-invalid');
        errorDiv.textContent = message;
    }

    /**
     * Show field success
     */
    function showFieldSuccess(input, errorDiv) {
        input.classList.add('is-valid');
        errorDiv.textContent = '';
    }

    /**
     * Handle login form submission
     */
    async function handleLogin() {
        // Validate form first
        if (!validateForm()) {
            return;
        }

        // Show loading state
        setLoadingState(true);
        hideAlerts();

        try {
            const username = SecurityUtils.sanitizeInput(usernameInput.value.trim());
            const password = passwordInput.value;

            // Additional client-side security checks
            if (!username || !password) {
                throw new Error('Todos os campos são obrigatórios');
            }

            // Attempt login
            const result = await window.secureAuth.login(username, password);
            
            // Show success message
            showSuccess('Login realizado com sucesso! Redirecionando...');
            
            // Clear form
            loginForm.reset();
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 1500);

        } catch (error) {
            console.error('Login error:', error);
            
            let errorMessage = 'Erro interno. Tente novamente.';
            
            if (error.message.includes('Invalid credentials')) {
                errorMessage = 'Nome de usuário ou senha incorretos.';
            } else if (error.message.includes('Too many login attempts')) {
                errorMessage = 'Muitas tentativas de login. Tente novamente em alguns minutos.';
            } else if (error.message.includes('required')) {
                errorMessage = 'Todos os campos são obrigatórios.';
            }
            
            showError(errorMessage);
            
            // Log security event for failed login
            SecurityUtils.logSecurityEvent('login_attempt_failed', {
                username: username,
                error: error.message,
                timestamp: new Date().toISOString()
            });
            
        } finally {
            setLoadingState(false);
        }
    }

    /**
     * Set loading state
     */
    function setLoadingState(loading) {
        if (loading) {
            loginButton.disabled = true;
            loginText.classList.add('d-none');
            loginSpinner.classList.remove('d-none');
            usernameInput.disabled = true;
            passwordInput.disabled = true;
        } else {
            loginButton.disabled = false;
            loginText.classList.remove('d-none');
            loginSpinner.classList.add('d-none');
            usernameInput.disabled = false;
            passwordInput.disabled = false;
        }
    }

    /**
     * Show error message
     */
    function showError(message) {
        alertMessage.textContent = message;
        alertDiv.classList.remove('d-none');
        successDiv.classList.add('d-none');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            alertDiv.classList.add('d-none');
        }, 5000);
    }

    /**
     * Show success message
     */
    function showSuccess(message) {
        successDiv.textContent = message;
        successDiv.classList.remove('d-none');
        alertDiv.classList.add('d-none');
    }

    /**
     * Hide all alerts
     */
    function hideAlerts() {
        alertDiv.classList.add('d-none');
        successDiv.classList.add('d-none');
    }

    /**
     * Load external script
     */
    function loadScript(url) {
        const head = document.getElementsByTagName('head')[0];
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onerror = function() {
            console.error('Failed to load script:', url);
        };
        head.appendChild(script);
    }

    // Check if user is already logged in
    if (window.secureAuth && window.secureAuth.isAuthenticated()) {
        window.location.href = '/index.html';
    }

    // Security: Clear any sensitive data from memory on page unload
    window.addEventListener('beforeunload', function() {
        passwordInput.value = '';
    });

    // Security: Disable right-click context menu on password field
    passwordInput.addEventListener('contextmenu', function(event) {
        event.preventDefault();
    });

    // Security: Prevent password field from being copied
    passwordInput.addEventListener('copy', function(event) {
        event.preventDefault();
    });
});

// Backward compatibility
async function logar() {
    const event = new Event('submit');
    document.getElementById('loginForm').dispatchEvent(event);
}
