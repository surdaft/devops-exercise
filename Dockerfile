FROM node:lts-alpine AS build

RUN mkdir /app

WORKDIR /app

ADD . /app

RUN npm i && npm run build

FROM nginx:alpine AS serve

EXPOSE 80

COPY --from=build /app/dist/ /usr/share/nginx/html/