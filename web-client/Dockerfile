FROM node:12-alpine AS BUILD_IMAGE
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm i
COPY . .
RUN npm run build
RUN npm run export

FROM nginx:1.18-alpine
WORKDIR /var/www/front
COPY --from=BUILD_IMAGE /usr/src/app/out .
COPY nginx.conf /etc/nginx/