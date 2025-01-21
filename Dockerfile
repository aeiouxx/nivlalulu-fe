# 1) Build stage
FROM node:14-alpine as build

# Nastavení pracovního adresáře v kontejneru
WORKDIR /app

# Zkopíruj package.json a package-lock.json (pokud existuje)
COPY package*.json ./

# Nainstaluj závislosti
RUN npm install

# Zkopíruj ostatní soubory
COPY . .

# Sestav React aplikaci
RUN npm run build

# 2) Production stage
FROM nginx:alpine

# Zkopíruj sestavenou aplikaci z "build" do Nginx adresáře
COPY --from=build /app/build /usr/share/nginx/html

# Otevři port 80
EXPOSE 80

# Spusť Nginx
CMD ["nginx", "-g", "daemon off;"]
