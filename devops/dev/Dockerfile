FROM node:22.14.0
WORKDIR /app
ARG CACHEBUST date
COPY ./package.json ./yarn.lock ./
RUN yarn install --silent
COPY . .
RUN yarn build
CMD ["yarn", "start"]