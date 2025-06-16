/**
 * Secure File Upload Handler
 * Provides secure file upload with validation and security checks
 */

// Load security utilities
if (typeof SecurityUtils === 'undefined') {
    const script = document.createElement('script');
    script.src = 'security-utils.js';
    document.head.appendChild(script);
}

/**
 * Secure file upload function with validation
 */
async function enviarArquivo() {
    const fileInput = document.getElementById('arquivoSelecionado');
    const resultDiv = document.getElementById('resultado');
    const progressDiv = document.getElementById('uploadProgress');

    if (!fileInput || !fileInput.files.length) {
        showUploadError('Nenhum arquivo selecionado');
        return;
    }

    const arquivo = fileInput.files[0];

    // Validate file
    const validation = SecurityUtils.validateFileUpload(arquivo, {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'application/pdf', 'text/plain', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        allowedExtensions: [
            '.jpg', '.jpeg', '.png', '.gif', '.webp',
            '.pdf', '.txt', '.doc', '.docx'
        ]
    });

    if (!validation.isValid) {
        showUploadError(validation.errors.join(', '));
        return;
    }

    // Rate limiting check
    if (!SecurityUtils.checkRateLimit('file_upload', 10, 300000)) { // 10 uploads per 5 minutes
        showUploadError('Muitos uploads. Tente novamente em alguns minutos.');
        return;
    }

    try {
        // Show progress
        showUploadProgress(0);

        // Create secure form data
        const formData = new FormData();
        formData.append('arquivo', arquivo);
        formData.append('csrf_token', SecurityUtils.getCSRFToken());

        // Get API URL
        const apiUrl = await loadApiUrl();

        // Upload with progress tracking
        const response = await uploadWithProgress(
            `${apiUrl}/upload`,
            formData,
            (progress) => showUploadProgress(progress)
        );

        if (response.ok) {
            const resultado = await response.json();
            showUploadSuccess(resultado.mensagem || 'Arquivo enviado com sucesso!');

            // Log successful upload
            SecurityUtils.logSecurityEvent('file_upload_success', {
                filename: arquivo.name,
                size: arquivo.size,
                type: arquivo.type
            });

        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro no servidor');
        }

    } catch (error) {
        console.error('Erro ao enviar arquivo:', error);
        showUploadError('Erro ao enviar arquivo: ' + error.message);

        // Log failed upload
        SecurityUtils.logSecurityEvent('file_upload_failed', {
            filename: arquivo.name,
            error: error.message
        });
    } finally {
        hideUploadProgress();
    }
}

/**
 * Upload file with progress tracking
 */
function uploadWithProgress(url, formData, onProgress) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Progress tracking
        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                const progress = Math.round((event.loaded / event.total) * 100);
                onProgress(progress);
            }
        });

        // Response handling
        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve({
                    ok: true,
                    json: () => Promise.resolve(JSON.parse(xhr.responseText))
                });
            } else {
                reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
            }
        });

        xhr.addEventListener('error', () => {
            reject(new Error('Network error'));
        });

        xhr.addEventListener('timeout', () => {
            reject(new Error('Upload timeout'));
        });

        // Security headers
        xhr.open('POST', url);
        xhr.setRequestHeader('X-CSRF-Token', SecurityUtils.getCSRFToken());

        // Add auth token if available
        const authToken = SecurityUtils.getCookie('auth_token') || sessionStorage.getItem('auth_token');
        if (authToken) {
            xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
        }

        xhr.timeout = 300000; // 5 minutes timeout
        xhr.send(formData);
    });
}

/**
 * Load API URL
 */
async function loadApiUrl() {
    try {
        const response = await fetch('./rotaBack.json');
        const data = await response.json();
        return data.API_URL;
    } catch (error) {
        throw new Error('Falha ao carregar configuração da API');
    }
}

/**
 * Show upload error
 */
function showUploadError(message) {
    const resultDiv = document.getElementById('resultado');
    if (resultDiv) {
        resultDiv.innerHTML = `<div class="alert alert-danger">${SecurityUtils.sanitizeHTML(message)}</div>`;
    } else {
        alert(message);
    }
}

/**
 * Show upload success
 */
function showUploadSuccess(message) {
    const resultDiv = document.getElementById('resultado');
    if (resultDiv) {
        resultDiv.innerHTML = `<div class="alert alert-success">${SecurityUtils.sanitizeHTML(message)}</div>`;
    } else {
        alert(message);
    }
}

/**
 * Show upload progress
 */
function showUploadProgress(progress) {
    const progressDiv = document.getElementById('uploadProgress');
    if (progressDiv) {
        progressDiv.innerHTML = `
            <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: ${progress}%"
                     aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">
                    ${progress}%
                </div>
            </div>
        `;
        progressDiv.classList.remove('d-none');
    }
}

/**
 * Hide upload progress
 */
function hideUploadProgress() {
    const progressDiv = document.getElementById('uploadProgress');
    if (progressDiv) {
        progressDiv.classList.add('d-none');
    }
}

/**
 * Setup file input validation
 */
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('arquivoSelecionado');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                // Show file info
                const fileInfo = document.getElementById('fileInfo');
                if (fileInfo) {
                    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
                    fileInfo.innerHTML = `
                        <small class="text-muted">
                            Arquivo: ${SecurityUtils.sanitizeHTML(file.name)}<br>
                            Tamanho: ${sizeInMB} MB<br>
                            Tipo: ${SecurityUtils.sanitizeHTML(file.type)}
                        </small>
                    `;
                }

                // Validate immediately
                const validation = SecurityUtils.validateFileUpload(file);
                if (!validation.isValid) {
                    showUploadError(validation.errors.join(', '));
                    this.value = ''; // Clear invalid file
                }
            }
        });
    }
});
