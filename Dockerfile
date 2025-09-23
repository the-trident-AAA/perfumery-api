# Dockerfile
# Etapa 1: Construcción
FROM node:20.11-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar yarn (en alpine no viene por defecto)
RUN corepack enable && corepack prepare yarn@stable --activate

# Copiar los archivos necesarios para instalar dependencias
COPY package.json yarn.lock ./

# Instalar dependencias con yarn
RUN yarn install --frozen-lockfile

# Copiar el resto del código fuente
COPY . .

# Compilar el proyecto
RUN yarn build

# Etapa 2: Ejecución
FROM node:20.11-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar yarn también en runtime por si lo necesitas
RUN corepack enable && corepack prepare yarn@stable --activate

# Copiar las dependencias instaladas y la carpeta build desde la etapa anterior
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json yarn.lock ./

# Exponer el puerto de la aplicación
EXPOSE $APP_PORT

# Comando para ejecutar la aplicación
CMD ["node", "dist/main"]
