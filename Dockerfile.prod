# Dockerfile
# Etapa 1: Construcción
FROM node:20.11-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar yarn (viene con corepack en Node 20)
RUN corepack enable && corepack prepare yarn@stable --activate

# Copiar todo el código fuente
COPY . .

# Instalar dependencias con yarn
RUN yarn install

# Compilar el proyecto
RUN yarn build

# Etapa 2: Ejecución
FROM node:20.11-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar yarn (por si acaso)
RUN corepack enable && corepack prepare yarn@stable --activate

# Copiar solo lo necesario desde la etapa de build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json yarn.lock ./

# Exponer el puerto de la aplicación
EXPOSE $APP_PORT

# Comando para ejecutar la aplicación
CMD ["node", "dist/main"]
