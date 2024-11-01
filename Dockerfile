# Use a imagem base do Nginx
FROM nginx:alpine

# Copiar os arquivos estáticos para o diretório padrão do Nginx
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# Expor a porta 80
EXPOSE 80