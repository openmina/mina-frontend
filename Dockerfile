# base image
FROM node:latest AS node

# set working directory
WORKDIR /app
COPY . .
RUN npm install
RUN NODE_OPTIONS="--max-old-space-size=8192" npm run build --prod

#stage 2
FROM nginx:alpine
COPY --from=node /app/dist/mina-frontend /usr/share/nginx/html

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
