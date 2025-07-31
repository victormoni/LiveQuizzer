# === STAGE 1: Build Angular Universal (prerender) ===
FROM node:20-alpine AS build
WORKDIR /app

# 1) Instala dependências
COPY package*.json ./
RUN npm ci

# 2) Copia todo o código e faz o build
COPY . .
# este comando deve gerar em /app/dist/browser:
RUN npm run build -- --output-path=dist --configuration=production

# === STAGE 2: Nginx serve os estáticos ===
FROM nginx:alpine

# limpa os arquivos default do nginx
RUN rm -rf /usr/share/nginx/html/*

# copia o build prerendered/browser para a raiz do nginx
COPY --from=build /app/dist/browser/ /usr/share/nginx/html/

# garante permissão de leitura
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80

# comando padrão já é "nginx -g 'daemon off;'" 
CMD ["nginx", "-g", "daemon off;"]