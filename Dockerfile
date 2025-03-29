# Usa una imagen base con Node.js
FROM node:20 AS builder

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos del proyecto 
COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src

# Instala las dependencias
RUN npm ci --omit=dev

# Transpilar Typescript a Javascript
RUN npm run build

# Segunda etapa: Imagen final para producción
FROM node:20 AS runner
WORKDIR /app

# Copiar solo los archivos necesarios de la etapa anterior
COPY --from=builder /app/node_modules ./app/node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Configuración de variables de entorno
ENV NODE_ENV=production

# Expone el puerto en el que corre la app
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "dist/main.js"]