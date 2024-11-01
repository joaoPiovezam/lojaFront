# Use a imagem oficial do NGINX
FROM nginx:alpine

# Copie os arquivos da aplicação para o diretório padrão do NGINX
COPY src /usr/share/nginx/html

# Exponha a porta 80 para acessar a aplicação
EXPOSE 80