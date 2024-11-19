FROM node:18.20.4-alpine AS build

ENV NODE_OPTIONS="--no-warnings"

WORKDIR /app

RUN npm install -g @angular/cli

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npx ng build --configuration production

FROM nginx:stable-alpine3.20-slim AS production

RUN rm -rf /usr/share/nginx/html/*

COPY ./default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/sklad/ /usr/share/nginx/html

RUN chmod -R 755 /usr/share/nginx/html && \
    rm -f /usr/share/nginx/html/3rdpartylicenses.txt

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]