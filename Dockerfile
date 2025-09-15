FROM node:20-alpine AS builder
WORKDIR /app

# Instala dependencias
COPY package*.json ./
RUN npm ci

# Copia el código y construye
COPY . .
# Forzamos la salida a /app/dist para que el COPY de la fase runtime sea estable
RUN npm run build -- --configuration production --output-path=dist

EXPOSE 4000
CMD ["node", "/app/dist/server/server.mjs"]