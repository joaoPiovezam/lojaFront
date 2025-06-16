/**
 * Security Utilities for Frontend Application
 * Provides essential security functions for XSS prevention, input validation, and secure operations
 */

class SecurityUtils {
    
    /**
     * Sanitize HTML input to prevent XSS attacks
     * @param {string} input - Raw HTML input
     * @returns {string} - Sanitized HTML
     */
    static sanitizeHTML(input) {
        if (typeof input !== 'string') return '';
        
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    /**
     * Sanitize input for safe DOM insertion
     * @param {string} input - Raw input
     * @returns {string} - Sanitized input
     */
    static sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        
        return input
            .replace(/[<>]/g, '') // Remove < and >
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+=/gi, '') // Remove event handlers
            .trim();
    }

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} - True if valid email
     */
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length <= 254;
    }

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {object} - Validation result with isValid and errors
     */
    static validatePassword(password) {
        const errors = [];
        
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!/\d/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Generate CSRF token
     * @returns {string} - CSRF token
     */
    static generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Get CSRF token from meta tag or generate new one
     * @returns {string} - CSRF token
     */
    static getCSRFToken() {
        let token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (!token) {
            token = this.generateCSRFToken();
            // Store in sessionStorage for this session
            sessionStorage.setItem('csrf-token', token);
        }
        return token;
    }

    /**
     * Secure cookie management
     */
    static setCookie(name, value, days = 7, secure = true, httpOnly = false) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        
        let cookieString = `${name}=${value}${expires}; path=/`;
        
        if (secure) {
            cookieString += '; Secure';
        }
        
        if (httpOnly) {
            cookieString += '; HttpOnly';
        }
        
        cookieString += '; SameSite=Strict';
        
        document.cookie = cookieString;
    }

    /**
     * Get cookie value
     * @param {string} name - Cookie name
     * @returns {string|null} - Cookie value or null
     */
    static getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    /**
     * Delete cookie
     * @param {string} name - Cookie name
     */
    static deleteCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    /**
     * Validate file upload
     * @param {File} file - File to validate
     * @param {object} options - Validation options
     * @returns {object} - Validation result
     */
    static validateFileUpload(file, options = {}) {
        const {
            maxSize = 5 * 1024 * 1024, // 5MB default
            allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
            allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf']
        } = options;

        const errors = [];

        if (!file) {
            errors.push('No file selected');
            return { isValid: false, errors };
        }

        // Check file size
        if (file.size > maxSize) {
            errors.push(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
        }

        // Check file type
        if (!allowedTypes.includes(file.type)) {
            errors.push(`File type ${file.type} is not allowed`);
        }

        // Check file extension
        const extension = '.' + file.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(extension)) {
            errors.push(`File extension ${extension} is not allowed`);
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Rate limiting check (client-side)
     * @param {string} action - Action identifier
     * @param {number} maxAttempts - Maximum attempts
     * @param {number} timeWindow - Time window in milliseconds
     * @returns {boolean} - True if action is allowed
     */
    static checkRateLimit(action, maxAttempts = 5, timeWindow = 60000) {
        const key = `rateLimit_${action}`;
        const now = Date.now();
        
        let attempts = JSON.parse(localStorage.getItem(key) || '[]');
        
        // Remove old attempts outside time window
        attempts = attempts.filter(timestamp => now - timestamp < timeWindow);
        
        if (attempts.length >= maxAttempts) {
            return false;
        }
        
        attempts.push(now);
        localStorage.setItem(key, JSON.stringify(attempts));
        
        return true;
    }

    /**
     * Secure form submission with CSRF protection
     * @param {string} url - Target URL
     * @param {object} data - Form data
     * @param {string} method - HTTP method
     * @returns {Promise} - Fetch promise
     */
    static async secureSubmit(url, data, method = 'POST') {
        const csrfToken = this.getCSRFToken();
        
        const headers = {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken
        };

        // Add authorization token if available
        const authToken = this.getCookie('auth_token') || sessionStorage.getItem('auth_token');
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        return fetch(url, {
            method: method,
            headers: headers,
            body: JSON.stringify(data),
            credentials: 'same-origin'
        });
    }

    /**
     * Log security events (for monitoring)
     * @param {string} event - Event type
     * @param {object} details - Event details
     */
    static logSecurityEvent(event, details = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: event,
            details: details,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // In production, send to security monitoring service
        console.warn('Security Event:', logEntry);
        
        // Store locally for debugging (remove in production)
        const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
        logs.push(logEntry);
        
        // Keep only last 100 logs
        if (logs.length > 100) {
            logs.splice(0, logs.length - 100);
        }
        
        localStorage.setItem('security_logs', JSON.stringify(logs));
    }
}

// Export for use in other files
window.SecurityUtils = SecurityUtils;
