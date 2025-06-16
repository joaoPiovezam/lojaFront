/**
 * Secure Form Handler
 * Provides secure form submission and validation utilities
 */

class SecureFormHandler {
    
    constructor() {
        this.apiUrl = null;
        this.init();
    }

    async init() {
        this.apiUrl = await this.loadApiUrl();
    }

    /**
     * Load API URL from configuration
     */
    async loadApiUrl() {
        try {
            const response = await fetch('./rotaBack.json');
            const data = await response.json();
            return data.API_URL;
        } catch (error) {
            console.error('Failed to load API URL:', error);
            return null;
        }
    }

    /**
     * Secure form submission with CSRF protection and validation
     */
    async submitForm(formId, endpoint, options = {}) {
        const form = document.getElementById(formId);
        if (!form) {
            throw new Error('Form not found');
        }

        const formData = new FormData(form);
        const data = {};
        
        // Convert FormData to object and sanitize
        for (let [key, value] of formData.entries()) {
            if (typeof value === 'string') {
                data[key] = SecurityUtils.sanitizeInput(value);
            } else {
                data[key] = value;
            }
        }

        // Validate required fields
        if (options.requiredFields) {
            const missingFields = options.requiredFields.filter(field => !data[field] || data[field].trim() === '');
            if (missingFields.length > 0) {
                throw new Error(`Campos obrigatórios: ${missingFields.join(', ')}`);
            }
        }

        // Custom validation
        if (options.validator) {
            const validationResult = options.validator(data);
            if (!validationResult.isValid) {
                throw new Error(validationResult.error);
            }
        }

        // Submit with security headers
        return await SecurityUtils.secureSubmit(
            `${this.apiUrl}${endpoint}`,
            data,
            options.method || 'POST'
        );
    }

    /**
     * Validate email field
     */
    validateEmailField(input) {
        const email = input.value.trim();
        const errorDiv = input.parentNode.querySelector('.invalid-feedback');
        
        input.classList.remove('is-invalid', 'is-valid');
        
        if (!email) {
            this.showFieldError(input, errorDiv, 'Email é obrigatório');
            return false;
        }
        
        if (!SecurityUtils.validateEmail(email)) {
            this.showFieldError(input, errorDiv, 'Email inválido');
            return false;
        }
        
        this.showFieldSuccess(input, errorDiv);
        return true;
    }

    /**
     * Validate password field with strength requirements
     */
    validatePasswordField(input, confirmInput = null) {
        const password = input.value;
        const errorDiv = input.parentNode.querySelector('.invalid-feedback');
        
        input.classList.remove('is-invalid', 'is-valid');
        
        if (!password) {
            this.showFieldError(input, errorDiv, 'Senha é obrigatória');
            return false;
        }
        
        const validation = SecurityUtils.validatePassword(password);
        if (!validation.isValid) {
            this.showFieldError(input, errorDiv, validation.errors[0]);
            return false;
        }
        
        // Check password confirmation if provided
        if (confirmInput && confirmInput.value !== password) {
            const confirmErrorDiv = confirmInput.parentNode.querySelector('.invalid-feedback');
            this.showFieldError(confirmInput, confirmErrorDiv, 'Senhas não coincidem');
            return false;
        }
        
        this.showFieldSuccess(input, errorDiv);
        return true;
    }

    /**
     * Validate CPF field
     */
    validateCPFField(input) {
        const cpf = input.value.replace(/\D/g, ''); // Remove non-digits
        const errorDiv = input.parentNode.querySelector('.invalid-feedback');
        
        input.classList.remove('is-invalid', 'is-valid');
        
        if (!cpf) {
            this.showFieldError(input, errorDiv, 'CPF é obrigatório');
            return false;
        }
        
        if (!this.isValidCPF(cpf)) {
            this.showFieldError(input, errorDiv, 'CPF inválido');
            return false;
        }
        
        this.showFieldSuccess(input, errorDiv);
        return true;
    }

    /**
     * Validate phone field
     */
    validatePhoneField(input) {
        const phone = input.value.replace(/\D/g, '');
        const errorDiv = input.parentNode.querySelector('.invalid-feedback');
        
        input.classList.remove('is-invalid', 'is-valid');
        
        if (!phone) {
            this.showFieldError(input, errorDiv, 'Telefone é obrigatório');
            return false;
        }
        
        if (phone.length < 10 || phone.length > 11) {
            this.showFieldError(input, errorDiv, 'Telefone deve ter 10 ou 11 dígitos');
            return false;
        }
        
        this.showFieldSuccess(input, errorDiv);
        return true;
    }

    /**
     * Validate text field with length limits
     */
    validateTextField(input, minLength = 1, maxLength = 255) {
        const text = input.value.trim();
        const errorDiv = input.parentNode.querySelector('.invalid-feedback');
        
        input.classList.remove('is-invalid', 'is-valid');
        
        if (!text) {
            this.showFieldError(input, errorDiv, 'Campo obrigatório');
            return false;
        }
        
        if (text.length < minLength) {
            this.showFieldError(input, errorDiv, `Mínimo ${minLength} caracteres`);
            return false;
        }
        
        if (text.length > maxLength) {
            this.showFieldError(input, errorDiv, `Máximo ${maxLength} caracteres`);
            return false;
        }
        
        // Check for potentially malicious input
        if (/<script|javascript:|on\w+=/i.test(text)) {
            this.showFieldError(input, errorDiv, 'Caracteres inválidos detectados');
            SecurityUtils.logSecurityEvent('malicious_input_attempt', { 
                field: input.name || input.id,
                value: text 
            });
            return false;
        }
        
        this.showFieldSuccess(input, errorDiv);
        return true;
    }

    /**
     * Show field error
     */
    showFieldError(input, errorDiv, message) {
        input.classList.add('is-invalid');
        if (errorDiv) {
            errorDiv.textContent = message;
        }
    }

    /**
     * Show field success
     */
    showFieldSuccess(input, errorDiv) {
        input.classList.add('is-valid');
        if (errorDiv) {
            errorDiv.textContent = '';
        }
    }

    /**
     * Setup real-time validation for a form
     */
    setupFormValidation(formId, validationRules) {
        const form = document.getElementById(formId);
        if (!form) return;

        Object.keys(validationRules).forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field) return;

            const rule = validationRules[fieldId];
            
            field.addEventListener('blur', () => {
                this.validateField(field, rule);
            });
            
            field.addEventListener('input', () => {
                // Clear validation state on input
                field.classList.remove('is-invalid', 'is-valid');
            });
        });

        // Form submission validation
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            
            let isValid = true;
            Object.keys(validationRules).forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field && !this.validateField(field, validationRules[fieldId])) {
                    isValid = false;
                }
            });

            if (isValid) {
                // Form is valid, proceed with submission
                this.handleFormSubmission(form, validationRules);
            }
        });
    }

    /**
     * Validate individual field based on rule
     */
    validateField(field, rule) {
        switch (rule.type) {
            case 'email':
                return this.validateEmailField(field);
            case 'password':
                const confirmField = rule.confirmField ? document.getElementById(rule.confirmField) : null;
                return this.validatePasswordField(field, confirmField);
            case 'cpf':
                return this.validateCPFField(field);
            case 'phone':
                return this.validatePhoneField(field);
            case 'text':
                return this.validateTextField(field, rule.minLength, rule.maxLength);
            default:
                return true;
        }
    }

    /**
     * Handle form submission after validation
     */
    async handleFormSubmission(form, validationRules) {
        // This should be overridden by specific form handlers
        console.log('Form validated successfully:', form.id);
    }

    /**
     * CPF validation algorithm
     */
    isValidCPF(cpf) {
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            return false;
        }

        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(9))) return false;

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(10))) return false;

        return true;
    }

    /**
     * Format CPF input
     */
    formatCPF(input) {
        let value = input.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        input.value = value;
    }

    /**
     * Format phone input
     */
    formatPhone(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length <= 10) {
            value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        input.value = value;
    }
}

// Initialize secure form handler
window.secureFormHandler = new SecureFormHandler();
window.SecureFormHandler = SecureFormHandler;
