FROM node:10 AS builder
WORKDIR /usr/app
COPY ./package*.json ./
RUN npm install
COPY . .
COPY ormconfig.docker.json ./ormconfig.json
RUN npm run build
WORKDIR ./dist
EXPOSE 4000 7777
CMD [ "node", "main" ]



