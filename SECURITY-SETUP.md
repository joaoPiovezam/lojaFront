# 🔐 Security Setup Guide

This guide provides step-by-step instructions to implement all security fixes for the web application.

## 🚨 Critical Security Fixes Implemented

### 1. HTTPS/TLS Configuration
- ✅ Nginx configured for HTTPS with HTTP redirect
- ✅ SSL certificate generation script provided
- ✅ Security headers implemented
- ✅ HSTS (HTTP Strict Transport Security) enabled

### 2. Secure Authentication
- ✅ JWT tokens moved from localStorage to secure cookies
- ✅ Session management with expiration
- ✅ Rate limiting for login attempts
- ✅ Input validation and sanitization

### 3. XSS Protection
- ✅ Input sanitization utilities
- ✅ Content Security Policy (CSP) headers
- ✅ HTML escaping for dynamic content
- ✅ Secure DOM manipulation

### 4. CSRF Protection
- ✅ CSRF token generation and validation
- ✅ Secure form submission utilities
- ✅ State-changing operations protected

### 5. File Upload Security
- ✅ File type validation
- ✅ File size limits
- ✅ Malicious file detection
- ✅ Progress tracking with security

## 📋 Setup Instructions

### Step 1: Generate SSL Certificates

For development/testing:
```bash
# Make the script executable and run it
chmod +x generate-ssl.sh
./generate-ssl.sh
```

For production with Let's Encrypt:
```bash
# Install certbot (if not already installed)
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate for your domain
sudo certbot --nginx -d your-domain.com

# Update nginx configuration to use the generated certificates
# Edit nginx/sites-available/app.conf and update the SSL certificate paths
```

### Step 2: Update Docker Configuration

The docker-compose.yml has been updated to include SSL support. Build and run:

```bash
# Build the updated container
docker-compose build

# Start the services
docker-compose up -d
```

### Step 3: Update HTML Files

Update your HTML files to include the new security scripts. For each HTML file, add:

```html
<head>
    <!-- Add CSP meta tag -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://stackpath.bootstrapcdn.com; font-src 'self' https://stackpath.bootstrapcdn.com; connect-src 'self' https://api.athlan.com.br;">
    
    <!-- Add CSRF token meta tag -->
    <meta name="csrf-token" content="">
    
    <!-- Update Bootstrap with integrity check -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
</head>

<body>
    <!-- Your content -->
    
    <!-- Load security scripts before other scripts -->
    <script src="security-utils.js"></script>
    <script src="secure-auth.js"></script>
    <script src="secure-forms.js"></script>
    <!-- Your other scripts -->
</body>
```

### Step 4: Update Form HTML

Update your forms to include proper validation and security:

```html
<form id="yourFormId" novalidate>
    <div class="form-group">
        <input type="email" class="form-control" id="email" required>
        <div class="invalid-feedback" id="emailError"></div>
    </div>
    
    <div class="form-group">
        <input type="password" class="form-control" id="password" required minlength="8">
        <div class="invalid-feedback" id="passwordError"></div>
    </div>
    
    <button type="submit" class="btn btn-primary">
        <span id="submitText">Submit</span>
        <span id="submitSpinner" class="spinner-border spinner-border-sm d-none"></span>
    </button>
</form>

<!-- Add alert divs -->
<div id="alert" class="alert alert-danger d-none"></div>
<div id="success" class="alert alert-success d-none"></div>
```

### Step 5: Update JavaScript Files

Replace your existing JavaScript files with the secure versions:

1. **Login**: Use `secure-login.js` instead of `login.js`
2. **Registration**: Update `cadastroUsuario.js` with secure validation
3. **File Upload**: Use the updated `carregarArquivos.js`
4. **Header**: Use the updated `header.js`

### Step 6: Environment Configuration

Create a `.env` file for sensitive configuration:

```env
# API Configuration
API_URL=https://api.athlan.com.br
API_TIMEOUT=30000

# Security Configuration
CSRF_TOKEN_EXPIRY=3600
SESSION_TIMEOUT=86400
MAX_LOGIN_ATTEMPTS=5
RATE_LIMIT_WINDOW=300000

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf
```

## 🛡️ Security Features Overview

### Authentication Security
- Secure token storage (cookies with HttpOnly, Secure, SameSite)
- Session timeout and automatic refresh
- Rate limiting for login attempts
- Strong password requirements
- Input validation and sanitization

### Data Protection
- All inputs sanitized before processing
- XSS protection with HTML escaping
- CSRF tokens for state-changing operations
- Secure file upload with validation
- SQL injection prevention (input sanitization)

### Network Security
- HTTPS enforcement with HSTS
- Security headers (CSP, X-Frame-Options, etc.)
- Rate limiting at nginx level
- Secure cookie configuration

### Monitoring and Logging
- Security event logging
- Failed login attempt tracking
- Malicious input detection
- File upload monitoring

## 🔧 Configuration Options

### Nginx Security Headers
The nginx configuration includes comprehensive security headers:
- `Strict-Transport-Security`: Forces HTTPS
- `Content-Security-Policy`: Prevents XSS attacks
- `X-Frame-Options`: Prevents clickjacking
- `X-Content-Type-Options`: Prevents MIME sniffing
- `Referrer-Policy`: Controls referrer information

### Rate Limiting
Three rate limiting zones are configured:
- Login: 5 requests per minute
- API: 30 requests per minute  
- General: 100 requests per minute

### File Upload Restrictions
- Maximum file size: 10MB (configurable)
- Allowed types: Images, PDFs, documents
- File extension validation
- MIME type verification

## 🚀 Testing the Security Implementation

### 1. Test HTTPS Configuration
```bash
# Check if HTTPS is working
curl -I https://your-domain.com

# Verify security headers
curl -I https://your-domain.com | grep -E "(Strict-Transport|Content-Security|X-Frame)"
```

### 2. Test Authentication
- Try logging in with valid credentials
- Test rate limiting by making multiple failed login attempts
- Verify session timeout functionality

### 3. Test Input Validation
- Try submitting forms with malicious input (should be sanitized)
- Test file upload with invalid file types
- Verify CSRF protection on form submissions

### 4. Test Security Headers
Use online tools like:
- [Security Headers](https://securityheaders.com/)
- [SSL Labs](https://www.ssllabs.com/ssltest/)

## 📝 Maintenance and Updates

### Regular Security Tasks
1. **Update Dependencies**: Keep all libraries and frameworks updated
2. **Monitor Logs**: Review security event logs regularly
3. **Certificate Renewal**: Renew SSL certificates before expiration
4. **Security Audits**: Perform regular security assessments

### Monitoring Security Events
Security events are logged to the browser console and localStorage. In production, implement server-side logging:

```javascript
// Example: Send security events to monitoring service
SecurityUtils.logSecurityEvent = function(event, details) {
    fetch('/api/security-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, details, timestamp: new Date().toISOString() })
    });
};
```

## 🆘 Troubleshooting

### Common Issues

1. **HTTPS Certificate Errors**
   - Verify certificate paths in nginx configuration
   - Check certificate validity: `openssl x509 -in cert.pem -text -noout`

2. **CSP Violations**
   - Check browser console for CSP errors
   - Update CSP policy to allow necessary resources

3. **Authentication Issues**
   - Clear browser storage and cookies
   - Verify API endpoints are accessible
   - Check CORS configuration

4. **File Upload Failures**
   - Verify file size limits
   - Check allowed file types configuration
   - Ensure proper permissions on upload directory

For additional support, check the security event logs in the browser's localStorage under the key `security_logs`.
