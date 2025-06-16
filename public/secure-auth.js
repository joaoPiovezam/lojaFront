/**
 * Secure Authentication Module
 * Handles secure login, logout, and session management
 */

class SecureAuth {
    
    constructor() {
        this.apiUrl = null;
        this.init();
    }

    async init() {
        this.apiUrl = await this.loadApiUrl();
        this.setupCSRFToken();
        this.checkAuthStatus();
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
            SecurityUtils.logSecurityEvent('api_url_load_failed', { error: error.message });
            throw new Error('Failed to load API configuration');
        }
    }

    /**
     * Setup CSRF token
     */
    setupCSRFToken() {
        const token = SecurityUtils.generateCSRFToken();
        const metaTag = document.createElement('meta');
        metaTag.name = 'csrf-token';
        metaTag.content = token;
        document.head.appendChild(metaTag);
        sessionStorage.setItem('csrf-token', token);
    }

    /**
     * Secure login function
     */
    async login(username, password) {
        // Rate limiting check
        if (!SecurityUtils.checkRateLimit('login', 5, 300000)) { // 5 attempts per 5 minutes
            SecurityUtils.logSecurityEvent('login_rate_limit_exceeded', { username });
            throw new Error('Too many login attempts. Please try again later.');
        }

        // Input validation
        if (!username || !password) {
            throw new Error('Username and password are required');
        }

        // Sanitize inputs
        username = SecurityUtils.sanitizeInput(username);
        
        if (username.length > 50) {
            throw new Error('Username too long');
        }

        try {
            const response = await SecurityUtils.secureSubmit(
                `${this.apiUrl}/login`,
                {
                    username: username,
                    password: password
                }
            );

            if (!response.ok) {
                SecurityUtils.logSecurityEvent('login_failed', { 
                    username, 
                    status: response.status 
                });
                throw new Error('Invalid credentials');
            }

            const data = await response.json();
            
            // Secure token storage
            this.storeAuthData(data);
            
            SecurityUtils.logSecurityEvent('login_success', { username });
            
            return data;
            
        } catch (error) {
            SecurityUtils.logSecurityEvent('login_error', { 
                username, 
                error: error.message 
            });
            throw error;
        }
    }

    /**
     * Store authentication data securely
     */
    storeAuthData(data) {
        // Clear any existing localStorage auth data
        this.clearLegacyStorage();
        
        // Store in secure session storage (temporary)
        sessionStorage.setItem('user_email', data.user?.email || '');
        sessionStorage.setItem('user_type', data.tipo || '');
        sessionStorage.setItem('user_id', data.user?.id || '');
        
        // Store auth token in secure cookie (if possible) or sessionStorage
        if (data.token) {
            // Try to set secure cookie (will work if HTTPS is enabled)
            try {
                SecurityUtils.setCookie('auth_token', data.token, 1, true, false);
            } catch (error) {
                // Fallback to sessionStorage for development
                sessionStorage.setItem('auth_token', data.token);
            }
        }
        
        // Set session expiry
        const expiryTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
        sessionStorage.setItem('session_expiry', expiryTime.toString());
    }

    /**
     * Clear legacy localStorage authentication data
     */
    clearLegacyStorage() {
        const legacyKeys = ['email', 'tipo', 'tokenUsuario', 'clienteId'];
        legacyKeys.forEach(key => {
            localStorage.removeItem(key);
        });
    }

    /**
     * Get current authentication token
     */
    getAuthToken() {
        // Try cookie first (more secure)
        let token = SecurityUtils.getCookie('auth_token');
        
        // Fallback to sessionStorage
        if (!token) {
            token = sessionStorage.getItem('auth_token');
        }
        
        return token;
    }

    /**
     * Get current user data
     */
    getCurrentUser() {
        return {
            email: sessionStorage.getItem('user_email'),
            type: sessionStorage.getItem('user_type'),
            id: sessionStorage.getItem('user_id')
        };
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        const token = this.getAuthToken();
        const expiry = sessionStorage.getItem('session_expiry');
        
        if (!token || !expiry) {
            return false;
        }
        
        // Check if session has expired
        if (Date.now() > parseInt(expiry)) {
            this.logout();
            return false;
        }
        
        return true;
    }

    /**
     * Check authentication status and redirect if needed
     */
    checkAuthStatus() {
        const currentPage = window.location.pathname;
        const publicPages = ['/login.html', '/cadastroCliente.html', '/cadastroUsuario.html'];
        
        if (!this.isAuthenticated() && !publicPages.includes(currentPage)) {
            // Redirect to login for protected pages
            window.location.href = '/login.html';
            return;
        }
        
        if (this.isAuthenticated() && currentPage === '/login.html') {
            // Redirect authenticated users away from login page
            window.location.href = '/index.html';
            return;
        }
    }

    /**
     * Secure logout
     */
    logout() {
        SecurityUtils.logSecurityEvent('logout', { 
            user: this.getCurrentUser().email 
        });
        
        // Clear all authentication data
        SecurityUtils.deleteCookie('auth_token');
        sessionStorage.clear();
        this.clearLegacyStorage();
        
        // Redirect to login
        window.location.href = '/login.html';
    }

    /**
     * Make authenticated API request
     */
    async authenticatedRequest(url, options = {}) {
        const token = this.getAuthToken();
        
        if (!token) {
            throw new Error('No authentication token available');
        }
        
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        return fetch(url, {
            ...options,
            headers,
            credentials: 'same-origin'
        });
    }

    /**
     * Refresh authentication token
     */
    async refreshToken() {
        try {
            const response = await this.authenticatedRequest(`${this.apiUrl}/refresh-token`, {
                method: 'POST'
            });
            
            if (response.ok) {
                const data = await response.json();
                this.storeAuthData(data);
                return true;
            }
        } catch (error) {
            SecurityUtils.logSecurityEvent('token_refresh_failed', { error: error.message });
        }
        
        // If refresh fails, logout user
        this.logout();
        return false;
    }

    /**
     * Setup automatic token refresh
     */
    setupTokenRefresh() {
        // Refresh token every 30 minutes
        setInterval(() => {
            if (this.isAuthenticated()) {
                this.refreshToken();
            }
        }, 30 * 60 * 1000);
    }
}

// Initialize secure authentication
window.secureAuth = new SecureAuth();

// Backward compatibility functions for existing code
window.logIn = () => window.location.href = '/login.html';
window.logOut = () => window.secureAuth.logout();

// Export for use in other modules
window.SecureAuth = SecureAuth;
