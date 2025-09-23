# Etapa 1: Construcción
FROM node:20.11-alpine AS builder

WORKDIR /app

# Copiar solo package.json y yarn.lock primero
COPY package.json yarn.lock ./

# Instalar dependencias
RUN corepack enable && corepack prepare yarn@stable --activate
RUN yarn install

# Copiar el resto del código
COPY . .

# Compilar el proyecto
RUN yarn build

# Etapa 2: Ejecución
FROM node:20.11-alpine

WORKDIR /app

# Instalar yarn en caso de necesitarlo
RUN corepack enable && corepack prepare yarn@stable --activate

# Copiar build y dependencias desde builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Exponer puerto
EXPOSE $APP_PORT

CMD ["node", "dist/main"]
