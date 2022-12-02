# base image
FROM node:18 AS BUILD_IMAGE

# set working directory
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -- --configuration tracing
#stage 2
FROM nginx:alpine
COPY --from=node /app/dist/mina-frontend /usr/share/nginx/html

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
