# Použití oficiálního Node.js image
FROM node:18

# Nastavení pracovního adresáře v kontejneru
WORKDIR /app

# Kopírování package.json a package-lock.json
COPY package*.json ./

# Instalace závislostí
RUN npm install

# Kopírování celého projektu
COPY . .

# Exponování portu pro vývojový server
EXPOSE 3000

# Start vývojového serveru
CMD ["npm", "start"]
