FROM node:12-alpine AS BUILD_IMAGE

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm i

COPY . .

RUN npm run build

RUN npm prune --production

FROM node:12-alpine

WORKDIR /usr/src/app

# copy from build image
COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules

CMD [ "node", "./dist/main.js" ]