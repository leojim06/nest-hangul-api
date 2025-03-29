# Usa una imagen base con Node.js
# FROM node:20 AS builder
FROM node:18-alpine AS builder

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos del proyecto 
# COPY package*.json ./
# COPY tsconfig*.json ./
# COPY src ./src
COPY package.json package-lock.json tsconfig.json ./

# Instala las dependencias
RUN npm ci

# Copia el código fuente de la aplicación
COPY src ./src

# Transpilar Typescript a Javascript
RUN npm run build

# Segunda etapa: Imagen final para producción
FROM node:18-alpine AS runtime

# Crea el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar solo los archivos necesarios de la etapa anterior
COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev

# Copia el código transpilado desde la primera etapa
COPY --from=builder /app/dist ./dist

# Configuración de variables de entorno
ENV NODE_ENV=production

# Expone el puerto en el que corre la app
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "dist/main.js"]