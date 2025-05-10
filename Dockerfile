# Dockerfile
# Etapa 1: Construcción
FROM node:20.11-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos necesarios
COPY package*.json ./
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Compilar el proyecto
RUN npm run build

# Etapa 2: Ejecución
FROM node:20.11-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar las dependencias instaladas y la carpeta build desde la etapa anterior
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Exponer el puerto de la aplicación
EXPOSE $PORT

# Comando para ejecutar la aplicación
CMD ["node", "dist/main"]
