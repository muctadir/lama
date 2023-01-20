# By @BHenkemans
# Stage 1 [Build the app]
FROM node:16.15-alpine3.15 as node

WORKDIR /usr/local/app

COPY ./frontend/ /usr/local/app/

COPY .env /usr/local

WORKDIR /usr/local/app/src/environments

RUN npm i

RUN npm run build

# Stage 2 [Build nginx for the handling of the traffic]
FROM nginx:1.21.6-alpine

COPY ./frontend/default.conf /etc/nginx/conf.d/default.conf

COPY --from=node /usr/local/app/dist/webapp /usr/share/nginx/html
