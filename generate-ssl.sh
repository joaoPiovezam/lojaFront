#!/bin/bash

# SSL Certificate Generation Script for Development/Testing
# This script generates self-signed certificates for local development

echo "🔐 Generating SSL certificates for local development..."

# Create SSL directory
mkdir -p nginx/ssl

# Generate private key
openssl genrsa -out nginx/ssl/nginx-selfsigned.key 2048

# Generate certificate signing request
openssl req -new -key nginx/ssl/nginx-selfsigned.key -out nginx/ssl/nginx-selfsigned.csr -subj "/C=BR/ST=State/L=City/O=Organization/OU=OrgUnit/CN=localhost"

# Generate self-signed certificate
openssl x509 -req -days 365 -in nginx/ssl/nginx-selfsigned.csr -signkey nginx/ssl/nginx-selfsigned.key -out nginx/ssl/nginx-selfsigned.crt

# Set proper permissions
chmod 600 nginx/ssl/nginx-selfsigned.key
chmod 644 nginx/ssl/nginx-selfsigned.crt

# Clean up CSR file
rm nginx/ssl/nginx-selfsigned.csr

echo "✅ SSL certificates generated successfully!"
echo "📁 Certificates location: nginx/ssl/"
echo "🔑 Private key: nginx-selfsigned.key"
echo "📜 Certificate: nginx-selfsigned.crt"
echo ""
echo "⚠️  Note: These are self-signed certificates for development only."
echo "   For production, use certificates from a trusted CA like Let's Encrypt."
echo ""
echo "🚀 To use Let's Encrypt in production, run:"
echo "   certbot --nginx -d your-domain.com"
